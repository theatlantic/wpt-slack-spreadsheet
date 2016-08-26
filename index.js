'use strict'

// package modules
const async = require('async');
const winston = require('winston');

// custom modules
const wpt = require('./lib/wpt');
const slack = require('./lib/slack');
const spreadsheet = require('./lib/spreadsheet');
const timeout = require('./lib/timeout');

winston.info('START');

/*
 * init app
 */
wpt.handleWPT((err, results) => {
  if (err) {
    results = timeout;
    winston.error(err);
  }

  winston.info('Finished running WPT');

  async.parallel([
    (cb) => {
      winston.info('Sending to Google Spreadsheet');
      spreadsheet.handleResults(results, cb);
    },
    (cb) => {
      winston.info('Sending to Slack');
      slack.sendToSlack(results, cb);
    }
  ], () => {
    winston.info('DONE');
  });
});
