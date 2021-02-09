module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.{js,ts}', '!**/*.d.ts', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '@/common/(.*)': '<rootDir>/common/$1',
    '@/components/(.*)': '<rootDir>/components/$1',
    '@/hooks/(.*)': '<rootDir>/hooks/$1',
    '@/prisma/(.*)': '<rootDir>/prisma/$1',
  },
};
