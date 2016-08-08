'use strict'

// package modules
const WebPageTest = require('webpagetest');
const config = require('config');
const winston = require('winston');
const argv = require('yargs').argv;


/**
 * The call to WPT
 * @param  {String}   url The URL to test
 * @param  {Function} cb  The callback
 */
const handleWPT = (cb) => {
  if (!argv.url) {
    winston.error('No URL defined!');
    process.exit();
  }

  const url = argv.url;
  const wpt = new WebPageTest(config.wptHost, config.apiKey);
  const opts = {
    firstViewOnly: true,
    pollResults: 5,
    private: true,
    runs: 1,
    timeout: 120,
    video: 1
  };

  if (argv.mobile) {
    opts.location = 'Dulles_MotoG:Motorola G - Chrome';
    opts.connectivity = '3G';
  }

  winston.info('Beginning profile for ' + url);
  wpt.runTest(url, opts, cb);
};

/**
 * WPT module.
 * @module lib/wpt
 */
module.exports = {
  handleWPT: handleWPT
};
