module.exports = {
    setupFilesAfterEnv: [
        './config/jest/setupTestFramework.js'
    ],
    // moduleNameMapper: {
    //     '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    //     '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js'
    //   },
      automock: false,
      verbose: true,
      transform: {
        '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
        //'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
      },
      moduleFileExtensions: [
        'js',
        'jsx'
      ],
      moduleDirectories: [
        'node_modules'
      ],
      unmockedModulePathPatterns: [
        '<rootDir>/node_modules/react/',
        '<rootDir>/node_modules/react-dom/'
      ],
      transformIgnorePatterns: [
        '/node_modules/'
      ],
      coveragePathIgnorePatterns: [
        '/node_modules/'
      ],
      modulePathIgnorePatterns: [
        '/node_modules/'
      ],
      testPathIgnorePatterns: [
        "<rootDir>/(build|docs|scripts|node_modules)/"
      ],
      collectCoverage: true,
      coverageReporters: [
        'json',
        'lcov',
        'text'
      ]
       }