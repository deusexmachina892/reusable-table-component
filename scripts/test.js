// Set the NODE_ENV to test
process.env.NODE_ENV = 'test';

// Requiring Jest
const jest = require('jest');

// Getting arguments from the terminal
const argv = process.argv.slice(2);

// Running jest passing the arguments
jest.run(argv);