module.exports = {
    // The test environment that will be used for testing
    testEnvironment: 'node',
  
    // Indicates whether each individual test should be reported during the run
    verbose: true,
  
    // The glob patterns Jest uses to detect test files
    testMatch: [
      '**/test/**/*.test.js'
    ],
  
    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.js',
      'index.js',
    ],
  
    // Custom reporters
    reporters: [
      'default'
    ],
  
    // Module file extensions for importing
    moduleFileExtensions: ['js', 'json'],
  
    // A list of paths to directories that Jest should use to search for files in
    roots: [
      '<rootDir>'
    ]
  };