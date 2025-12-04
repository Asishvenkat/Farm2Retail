export default {
  preset: null,
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['__tests__/setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(arcjet|@arcjet)/)'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
