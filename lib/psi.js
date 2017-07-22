'use strict';

const config = require('config');
const psi = require('psi');
const winston = require('winston');
const argv = require('yargs').argv;


if (!config.psiAPIKey) {
  winston.error('No PSI API key specified!');
  process.exit();
}


/**
 * Format the data we need; discard the rest
 * @param  {Object}   data The data to format
 * @param  {Function} cb   The async callback
 */
const formatData = (data, cb) => {
  const ruleGroups = {};
  ruleGroups.speed = data.ruleGroups.SPEED.score;
  ruleGroups.usability = (data.ruleGroups.USABILITY && data.ruleGroups.USABILITY.score) || null; // eslint-disable-line max-len,no-extra-parens

  const results = Object.assign({}, ruleGroups, data.pageStats);
  cb(null, {psi: results});
};


/**
 * The call to PSI
 * @param  {Function} cb The async callback
 */
const handlePSI = (cb) => {
  if (!argv.url) {
    winston.error('No URL defined!');
    process.exit();
  }

  const url = argv.url;
  let strategy = 'desktop';

  if (argv.mobile) {
    strategy = 'mobile';
  }

  winston.info(`Beginning Pagespeed Insights profile for ${url}`);
  psi(url, {
    nokey: config.psiAPIKey,
    strategy: strategy
  })
  .then((data) => formatData(data, cb)) // eslint-disable-line dot-location
  .catch((e) => cb(e, null)); // eslint-disable-line dot-location
};


/**
 * PSI module.
 * @module lib/psi
 */
module.exports = {
  handlePSI: handlePSI
};
