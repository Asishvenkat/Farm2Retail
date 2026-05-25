import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';
import { isSpoofedBot } from '@arcjet/inspect';

const { ARCJET_KEY } = process.env;
const isProduction = process.env.NODE_ENV === 'production';

let hasLoggedLocalSkip = false;

const normalizeIp = (ip = '') =>
  String(ip).trim().replace(/^\[|\]$/g, '').replace(/^::ffff:/, '');

const getHeaderIp = (value) => {
  if (Array.isArray(value)) {
    return normalizeIp(value[0] || '');
  }

  if (typeof value !== 'string') {
    return '';
  }

  return normalizeIp(value.split(',')[0] || '');
};

const isPrivateIpv4 = (ip) => {
  const octets = ip.split('.').map(Number);

  if (octets.length !== 4 || octets.some((octet) => Number.isNaN(octet))) {
    return false;
  }

  return (
    octets[0] === 0 ||
    octets[0] === 10 ||
    octets[0] === 127 ||
    (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
};

const isLocalOrPrivateIp = (ip) => {
  const normalizedIp = normalizeIp(ip).toLowerCase();

  if (!normalizedIp) {
    return true;
  }

  if (normalizedIp === '::1' || normalizedIp === '::') {
    return true;
  }

  if (
    normalizedIp.startsWith('fc') ||
    normalizedIp.startsWith('fd') ||
    normalizedIp.startsWith('fe80:')
  ) {
    return true;
  }

  return isPrivateIpv4(normalizedIp);
};

const getClientIp = (req) => {
  const headerCandidates = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'fly-client-ip',
    'x-vercel-forwarded-for',
    'true-client-ip',
    'x-client-ip',
  ];

  for (const header of headerCandidates) {
    const headerIp = getHeaderIp(req.headers?.[header]);

    if (headerIp) {
      return headerIp;
    }
  }

  return normalizeIp(
    req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || '',
  );
};

const shouldSkipArcjet = (req) => {
  if (process.env.ARCJET_ENV === 'development') {
    return false;
  }

  return !isProduction && isLocalOrPrivateIp(getClientIp(req));
};

const shouldBypassArcjet = (req) => {
  if (!shouldSkipArcjet(req)) {
    return false;
  }

  if (!hasLoggedLocalSkip) {
    console.warn(
      'Arcjet skipped for local/private IP traffic outside production. Set ARCJET_ENV=development locally to enable Arcjet dev mode.',
    );
    hasLoggedLocalSkip = true;
  }

  return true;
};

let aj = null;

if (ARCJET_KEY) {
  aj = arcjet({
    key: ARCJET_KEY,
    rules: [
      // Shield protects your app from common attacks e.g. SQL injection
      shield({ mode: 'LIVE' }),
      // Create a bot detection rule
      detectBot({
        mode: 'LIVE', // Blocks requests. Use "DRY_RUN" to log only
        // Block all bots except the following
        allow: [
          'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
          // Uncomment to allow these other common bot categories
          // See the full list at https://arcjet.com/bot-list
          //"CATEGORY:MONITOR", // Uptime monitoring services
          //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
        ],
      }),
      // Create a token bucket rate limit. Other algorithms are supported.
      tokenBucket({
        mode: 'LIVE',
        // Tracked by IP address by default, but this can be customized
        // See https://docs.arcjet.com/fingerprints
        //characteristics: ["ip.src"],
        refillRate: 5, // Refill 5 tokens per interval
        interval: 10, // Refill every 10 seconds
        capacity: 10, // Bucket capacity of 10 tokens
      }),
    ],
  });
} else {
  console.warn(
    'Arcjet key is missing. Set ARCJET_KEY in your environment to enable Arcjet protection.',
  );
}

// Arcjet middleware wrapper
export const arcjetMiddleware = async (req, res, next) => {
  if (!aj || shouldBypassArcjet(req)) {
    return next();
  }

  try {
    const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket

    if (decision.isErrored()) {
      console.warn('Arcjet skipped request after error:', decision.reason.message);
      return next();
    }

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: 'Too Many Requests' });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({ error: 'No bots allowed' });
      }

      return res.status(403).json({ error: 'Forbidden' });
    }

    // Requests from hosting IPs are likely from bots, so they can usually be
    // blocked. However, consider your use case - if this is an API endpoint
    // then hosting IPs might be legitimate.
    // https://docs.arcjet.com/blueprints/vpn-proxy-detection
    if (decision.ip?.isHosting?.()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Paid Arcjet accounts include additional verification checks using IP data.
    // Verification isn't always possible, so we recommend checking the decision
    // separately.
    // https://docs.arcjet.com/bot-protection/reference#bot-verification
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  } catch (err) {
    console.error('Arcjet middleware error:', err);
    next();
  }
};

// Specific middleware for auth endpoints (5 requests per 15 minutes)
export const authRateLimit = async (req, res, next) => {
  if (!aj || shouldBypassArcjet(req)) {
    return next();
  }

  try {
    const decision = await aj.protect(req, {
      requested: 1,
      rules: [
        tokenBucket({
          mode: 'LIVE',
          refillRate: 5, // 5 tokens
          interval: 15 * 60, // per 15 minutes (900 seconds)
          capacity: 5, // max 5 requests
        }),
      ],
    });

    if (decision.isErrored()) {
      console.warn(
        'Arcjet skipped auth rate limit after error:',
        decision.reason.message,
      );
      return next();
    }

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: 'Too many authentication attempts. Please try again later.',
        });
      }
    }

    next();
  } catch (err) {
    console.error('Auth rate limit error:', err);
    next();
  }
};

// Specific middleware for payment endpoints (10 requests per hour)
export const paymentRateLimit = async (req, res, next) => {
  if (!aj || shouldBypassArcjet(req)) {
    return next();
  }

  try {
    const decision = await aj.protect(req, {
      requested: 1,
      rules: [
        tokenBucket({
          mode: 'LIVE',
          refillRate: 10, // 10 tokens
          interval: 60 * 60, // per hour (3600 seconds)
          capacity: 10, // max 10 requests
        }),
      ],
    });

    if (decision.isErrored()) {
      console.warn(
        'Arcjet skipped payment rate limit after error:',
        decision.reason.message,
      );
      return next();
    }

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: 'Too many payment requests. Please try again later.',
        });
      }
    }

    next();
  } catch (err) {
    console.error('Payment rate limit error:', err);
    next();
  }
};

export default aj;
