'use strict'

// core modules
const fs = require('fs');

// package modules
const async = require('async');
const config = require('config');
const winston = require('winston');
const GoogleSpreadsheet = require('google-spreadsheet');
const argv = require('yargs').argv;


if (!argv.creds) {
  winston.error('No Google Spreadsheet credentials specified!');
  process.exit();
}

const doc = new GoogleSpreadsheet(config.spreadsheetId);
/**
 * Prevent dirty data from ruining Spreadsheet headers
 * @type {Array}
 */
const metrics = [
  'SpeedIndex',
  'TTFB',
  'URL',
  'adult_site',
  'aft',
  'base_page_cdn',
  'browser_main_memory_kb',
  'browser_name',
  'browser_other_private_memory_kb',
  'browser_process_count',
  'browser_version',
  'browser_working_set_kb',
  'bytesIn',
  'bytesInDoc',
  'bytesOut',
  'bytesOutDoc',
  'cached',
  'connections',
  'docCPUms',
  'docCPUpct',
  'docTime',
  'domContentLoadedEventEnd',
  'domContentLoadedEventStart',
  'domElements',
  'domInteractive',
  'domLoading',
  'domTime',
  'effectiveBps',
  'effectiveBpsDoc',
  'eventName',
  'firstPaint',
  'fixed_viewport',
  'fullyLoaded',
  'fullyLoadedCPUms',
  'fullyLoadedCPUpct',
  'gzip_savings',
  'gzip_total',
  'image_savings',
  'image_total',
  'isResponsive',
  'lastVisualChange',
  'loadEventEnd',
  'loadEventStart',
  'loadTime',
  'minify_savings',
  'minify_total',
  'numSteps',
  'optimization_checked',
  'pageSpeedVersion',
  'render',
  'requestsDoc',
  'requestsFull',
  'responses_200',
  'responses_404',
  'responses_other',
  'result',
  'run',
  'score_cache',
  'score_cdn',
  'score_combine',
  'score_compress',
  'score_cookies',
  'score_etags',
  'score_gzip',
  'score_keep-alive',
  'score_minify',
  'score_progressive_jpeg',
  'server_count',
  'server_rtt',
  'step',
  'tester',
  'title',
  'titleTime',
  'visualComplete'
];

// :(
let wptResults;


/**
 * Read the Google Spreadsheet config file
 * @param  {Function} cb The callback
 */
const readConfig = cb => {
  fs.readFile(argv.creds, (err, data) => {
    cb(err, JSON.parse(data));
  });
};

/**
 * Set the auth for the Google Spreadsheet
 * @param  {Object}   creds The credentials JSON object
 * @param  {Function} cb    The callback
 */
const setAuth = (creds, cb) => {
  doc.useServiceAccountAuth(creds, cb);
};

/**
 * Get worksheet info
 * @param  {Function} cb The callback
 */
const getInfoAndWorksheets = cb => {
  doc.getInfo((err, info) => {
    let tab = 0;
    if (argv.tab) {
      tab = argv.tab;
    }

    const sheet = info.worksheets[tab];
    cb(err, sheet);
  });
};

/**
 * Format WPT results
 * @param  {Object}   sheet The worksheet
 * @param  {Function} cb    The callback
 */
const formatResults = (sheet, cb) => {
  const data = wptResults.data;
  const firstView = data.runs['1'].firstView;
  const obj = {};

  Object.keys(firstView).forEach(k => {
    if (typeof firstView[k] === 'string' || typeof firstView[k] === 'number') {
      obj[k] = firstView[k];
    }
  });

  cb(null, sheet, obj);
};

/**
 * Resize and set the sheet header...every time
 * @param  {Object}   sheet The worksheet
 * @param  {Object}   obj   The sorted results
 * @param  {Function} cb    The callback
 */
const setSheetHeader = (sheet, obj, cb) => {
  const metricsObj = {
    date: new Date()
  };

  metrics.forEach(metric => {
    metricsObj[metric] = obj[metric];
  });

  sheet.resize({
    colCount: Object.keys(metricsObj).length
  }, () => {
    sheet.setHeaderRow(metrics, err => {
      cb(err, sheet, metricsObj);
    });
  });
};

/**
 * Insert the data into the spreadsheet
 * @param  {Object}   sheet The worksheet
 * @param  {Object}   obj   The sorted data
 * @param  {Function} cb    The callback
 */
const insertData = (sheet, obj, cb) => {
  sheet.addRow(obj, cb);
};

/**
 * Handle the results
 * @param  {Object}   results The WPT results
 * @param  {Function} cb      The callback
 */
const handleResults = (results, cb) => {
  wptResults = results;

  async.waterfall([
    readConfig,
    setAuth,
    getInfoAndWorksheets,
    formatResults,
    setSheetHeader,
    insertData
  ], cb);
};

/**
 * Spreadsheet module.
 * @module lib/spreadsheet
 */
module.exports = {
  handleResults: handleResults
};
