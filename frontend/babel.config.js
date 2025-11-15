export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    [
      'babel-plugin-transform-vite-meta-env',
      {
        env: {
          VITE_API_BASE_URL: 'http://localhost:5000/api/',
          VITE_SOCKET_URL: 'http://localhost:5000',
          VITE_RAZORPAY_KEY: 'test_razorpay_key'
        }
      }
    ]
  ]
};

