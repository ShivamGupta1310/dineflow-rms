const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig');
module.exports = {
  preset: '@react-native/jest-preset',
  collectCoverageFrom: [
    'App.{ts,tsx}', // ← Include root App.tsx
    'src/screens/**/*.{js,jsx,ts,tsx}',
    'src/hooks/**/*.{js,jsx,ts,tsx}',
    '!src/**/styles.ts',
    '!src/**/styles.tsx',
    '!src/**/*.d.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/*.(test|spec).[jt]s?(x)',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|' +
      'react-native|' +
      '@react-navigation|' +
      'react-native-reanimated|' +
      '@react-native-community|' +
      '@react-native-firebase|' +
      'immer|' +
      'react-native-element-dropdown|' +
      'react-native-confirmation-code-field' +
      ')/)',
  ],
};
 