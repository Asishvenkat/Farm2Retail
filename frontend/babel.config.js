module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    [
      'babel-plugin-transform-import-meta',
      {
        module: 'ENV',
      },
    ],
  ],
  env: {
    test: {
      plugins: [
        [
          'babel-plugin-transform-import-meta',
          {
            module: 'ENV',
          },
        ],
      ],
    },
  },
};
