module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    paths: ['features/**/*.feature'],
    require: ['step-definitions/**/*.ts', 'hooks/**/*.ts', 'fixtures/**/*.ts'],
    format: ['allure-cucumberjs/reporter'],
    formatOptions: {
      resultsDir: 'allure-results'
    },
    parallel: 4,
    publishQuiet: true
  }
};
