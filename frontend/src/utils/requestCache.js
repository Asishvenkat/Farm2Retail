const responseCache = new Map();
const pendingRequests = new Map();

const isFresh = (entry) => entry && entry.expiresAt > Date.now();

export const getCachedRequest = async (
  key,
  fetcher,
  { ttl = 30000, force = false } = {},
) => {
  if (!force) {
    const cachedEntry = responseCache.get(key);
    if (isFresh(cachedEntry)) {
      return cachedEntry.data;
    }

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }
  }

  const requestPromise = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      responseCache.set(key, {
        data,
        expiresAt: Date.now() + ttl,
      });
      pendingRequests.delete(key);
      return data;
    })
    .catch((error) => {
      pendingRequests.delete(key);
      throw error;
    });

  pendingRequests.set(key, requestPromise);

  return requestPromise;
};

export const invalidateCachedRequest = (matcher) => {
  const shouldDelete =
    typeof matcher === 'function'
      ? matcher
      : (key) => key === matcher || key.startsWith(`${matcher}:`);

  for (const key of responseCache.keys()) {
    if (shouldDelete(key)) {
      responseCache.delete(key);
    }
  }

  for (const key of pendingRequests.keys()) {
    if (shouldDelete(key)) {
      pendingRequests.delete(key);
    }
  }
};
