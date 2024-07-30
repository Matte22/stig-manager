const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');

const iterationConfig = require('./mocha/iterations');


if (!iterationConfig) {
  throw new Error('Iterations configuration not found');
}
// Initialize a new Mocha instance
const mocha = new Mocha();

// Get test files
const testDir = './mocha/iterate';
// Function to get test files
const getTestFiles = (testDir) => {
  return fs.readdirSync(testDir).filter(file => file.endsWith('.js')).map(file => path.resolve(testDir, file));
};

const clearRequireCache = (testFiles) => {
  testFiles.forEach(file => {
    const resolvedPath = require.resolve(file);
    if (require.cache[resolvedPath]) {
      delete require.cache[resolvedPath];
    }
  });
};

// Function to run tests with a specific configuration
const runTestsWithConfig = (config, index) => {
  return new Promise((resolve, reject) => {
    const mocha = new Mocha({
      reporter: 'mochawesome',
      reporterOptions: {
        reportDir: './mochawesome-reports',
        reportFilename: `report-${index}`,
        quiet: true,
        json: false,
        html: true,
        overwrite: false,
        timestamp: true
      },
      cleanReferencesAfterRun: true // Clean up references after each run
    });
    const testFiles = getTestFiles(testDir);
    clearRequireCache(testFiles);

    // Add each test file to the new Mocha instance
    testFiles.forEach(file => mocha.addFile(file));

    process.env.ITERATION_CONFIG = JSON.stringify(config);

    mocha.run(failures => {
      mocha.dispose(); // Dispose of the Mocha instance after the run

      if (failures) {
        reject(new Error(`Tests failed for config: ${JSON.stringify(config)}`));
      } else {
        resolve();
      }
    });
  });
};

// // Function to run tests with a specific configuration
// const runTestsWithConfig = (config) => {
//   process.env.ITERATION_CONFIG = JSON.stringify(config);
//   return new Promise((resolve, reject) => {
//     mocha.run(failures => {
//       if (failures) {
//         reject(new Error(`Tests failed for config: ${JSON.stringify(config)}`));
//       } else {
//         resolve();
//       }
//     });
//   });
// };

// Run tests for each configuration synchronously
(async () => {
  for (const [index, config] of iterationConfig.entries()) {
    console.log(`Running tests for config: ${JSON.stringify(config.user)}`);
    try {
      await runTestsWithConfig(config, index);
      console.log(`Tests passed for config: ${JSON.stringify(config.user)}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1); // Exit with failure
    }
  }
  process.exit(0); // Exit with success
})();

