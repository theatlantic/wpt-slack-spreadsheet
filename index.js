'use strict'

// package modules
const async = require('async');
const winston = require('winston');

// custom modules
const wpt = require('./lib/wpt');
const psi = require('./lib/psi');
const slack = require('./lib/slack');
const spreadsheet = require('./lib/spreadsheet');

winston.info('START');

/*
 * init app
 */
async.parallel([
  psi.handlePSI,
  wpt.handleWPT
], (err, results) => {

  if (err) {
    winston.error(err);
    return;
  }

  winston.info('Finished running WPT');

  const data = Object.assign({}, ...results);
  async.parallel([
    (cb) => {
      winston.info('Sending to Google Spreadsheet');
      spreadsheet.handleResults(data, cb);
    },
    (cb) => {
      winston.info('Sending to Slack');
      slack.sendToSlack(data, cb);
    }
  ], () => {
    winston.info('DONE');
  });
});
