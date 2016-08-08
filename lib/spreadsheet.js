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
  Reflect.deleteProperty(obj, 'date');
  const keys = Object.keys(obj).sort();
  keys.unshift('date');
  obj.date = new Date();

  sheet.resize({
    colCount: keys.length
  }, () => {
    sheet.setHeaderRow(keys, (err) => {
      cb(err, sheet, obj);
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
