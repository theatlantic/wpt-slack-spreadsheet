'use strict'

// core modules
const os = require('os');

// package modules
const request = require('request');
const config = require('config');

// custom modules
const f = require('./format');


/**
 * Make a POST request
 * @param  {String}   url     The URL to POST to
 * @param  {Object}   payload The POST payload
 * @param  {Function} cb      The callback
 */
const makeRequest = (url, payload, cb) => {
  request.post({
    url: url,
    form: {
      payload: JSON.stringify(payload)
    }
  }, cb);
};


/**
 * Handle the returned data and POST the data to Slack
 * @param  {Object}   results The results of the test
 * @param  {Function} cb      The callback
 */
const handleRunTest = (results, cb) => {
  const data = results.data;
  const firstView = data.runs['1'].firstView;
  const fields = [];
  const metrics = [
    'domInteractive',
    'TTFB',
    'firstPaint',
    'loadTime',
    'fullyLoaded',
    'visualComplete',
    'SpeedIndex'
  ];

  metrics.forEach(metric => {
    let suffix = 'ms';
    if (metric === 'SpeedIndex') {
      suffix = '';
    }

    fields.push({
      title: metric,
      value: firstView[metric] + suffix,
      short: true
    });
  });

  fields.push({
    title: 'PSI Score',
    value: results.psi.speed,
    short: true
  });

  const payload = {
    channel: config.channel,
    text: [
      f.url(data.url, firstView.title),
      data.summary
    ].join(os.EOL),
    icon_emoji: ':chart_with_upwards_trend:',
    username: 'Performance Bot',
    attachments: [{
      fallback: '',
      color: '#000000',
      ts: data.completed,
      footer: [
        data.location,
        data.connectivity
      ].join(' - '),
      fields: fields
    }]
  };

  makeRequest(config.webhookUrl, payload, cb);
};


/**
 * Send the formatted results to Slack
 * @param  {Object}   results The full results object
 * @param  {Function} cb      The callback
 */
const sendToSlack = (results, cb) => {
  handleRunTest(results, cb);
};


/**
 * Slack module.
 * @module lib/slack
 */
module.exports = {
  sendToSlack: sendToSlack
};
