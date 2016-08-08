// format.spec.js
'use strict';

// package modules
const assert  = require('chai').assert;

// custom modules
const f = require('../lib/format');

describe('format', () => {
  describe('#pre', () => {
    it('should return a string', () => {
      const result = f.pre('hello world');
      assert.isString(result);
    });

    it('should return a pre block with "undefined" when no string is passed', () => {
      const result = f.pre();
      assert.strictEqual(result, '```undefined```');
    });

    it('should return a pre block with the passed string', () => {
      const result = f.pre('hello world');
      assert.strictEqual(result, '```hello world```');
    });
  });

  describe('#code', () => {
    it('should return a string', () => {
      const result = f.code('hello world');
      assert.isString(result);
    });

    it('should return a code block with "undefined" when no string is passed', () => {
      const result = f.code();
      assert.strictEqual(result, '`undefined`');
    });

    it('should return a code block with the passed string', () => {
      const result = f.code('hello world');
      assert.strictEqual(result, '`hello world`');
    });
  });

  describe('#bold', () => {
    it('should return a string', () => {
      const result = f.bold('hello world');
      assert.isString(result);
    });

    it('should return a bold block with "undefined" when no string is passed', () => {
      const result = f.bold();
      assert.strictEqual(result, '*undefined*');
    });

    it('should return a bold block with the passed string', () => {
      const result = f.bold('hello world');
      assert.strictEqual(result, '*hello world*');
    });
  });

  describe('#italic', () => {
    it('should return a string', () => {
      const result = f.italic('hello world');
      assert.isString(result);
    });

    it('should return a italic block with "undefined" when no string is passed', () => {
      const result = f.italic();
      assert.strictEqual(result, '_undefined_');
    });

    it('should return a italic block with the passed string', () => {
      const result = f.italic('hello world');
      assert.strictEqual(result, '_hello world_');
    });
  });

  describe('#strike', () => {
    it('should return a string', () => {
      const result = f.strike('hello world');
      assert.isString(result);
    });

    it('should return a strike block with "undefined" when no string is passed', () => {
      const result = f.strike();
      assert.strictEqual(result, '~undefined~');
    });

    it('should return a strike block with the passed string', () => {
      const result = f.strike('hello world');
      assert.strictEqual(result, '~hello world~');
    });
  });

  describe('#blockquote', () => {
    it('should return a string', () => {
      const result = f.blockquote('hello world');
      assert.isString(result);
    });

    it('should return a blockquote block with "undefined" when no string is passed', () => {
      const result = f.blockquote();
      assert.strictEqual(result, '> undefined');
    });

    it('should return a blockquote block with the passed string', () => {
      const result = f.blockquote('hello world');
      assert.strictEqual(result, '> hello world');
    });
  });

  describe('#user', () => {
    const userObj = {
      id: 'jeremy-green',
      name: 'Jeremy Green'
    };

    it('should return a string', () => {
      const result = f.user(userObj);
      assert.isString(result);
    });

    it('should throw a `TypeError` when no string is passed', () => {
      assert.throw(f.user, TypeError);
    });

    it('should return a user formatted string with the passed string', () => {
      const result = f.user(userObj);
      assert.strictEqual(result, '<@jeremy-green|Jeremy Green>');
    });
  });

  describe('#url', () => {
    const url = 'https://github.com/theatlantic/wpt-slack-spreadsheet';
    const title = 'theatlantic/wpt-slack-spreadsheet: Profile a URL in WPT \
    and send the relevant results to Slack and store all the results in a \
    Google Spreadsheet.';

    it('should return a string', () => {
      const result = f.url(url);
      assert.isString(result);
    });

    it('should throw a `TypeError` when no string is passed', () => {
      const result = f.url();
      assert.strictEqual(result, `<undefined>`);
    });

    it('should return a url formatted string with the passed string', () => {
      const result = f.url(url);
      assert.strictEqual(result, `<${url}>`);
    });

    it('should add a title to the url formatted string', () => {
      const result = f.url(url, title);
      assert.strictEqual(result, `<${url}|${title}>`);
    });
  });
});
