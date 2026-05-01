module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    paths: ['features/**/*.feature'],
    require: ['step-definitions/**/*.ts', 'hooks/**/*.ts', 'fixtures/**/*.ts'],
    format: ['html:reports/cucumber-report.html'],
    parallel: 4,
    publishQuiet: true
  }
};
