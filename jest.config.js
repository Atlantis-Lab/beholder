module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '/(__tests__|e2e)/.*\\.(test|spec)\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/node_modules/', '/.c9/'],
  collectCoverageFrom: ['packages/*/src/**/*.(ts|tsx)'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['json', 'lcov', 'html', 'text', 'text-summary'],
  roots: ['packages/'],
}
