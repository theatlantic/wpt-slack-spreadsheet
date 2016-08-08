'use strict';

/**
 * Format
 * @module format
 */
module.exports = {
  /**
   * Wrap the passed string in three ticks
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  pre(str) {
    return '```' + str + '```';
  },
  /**
   * Wrap the passed string in one tick
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  code(str) {
    return '`' + str + '`';
  },
  /**
   * Wrap the passed string in asterisks
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  bold(str) {
    return '*' + str + '*';
  },
  /**
   * Wrap the passed string in underscores
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  italic(str) {
    return '_' + str + '_';
  },
  /**
   * Wrap the passed string in a strikethru
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  strike(str) {
    return '~' + str + '~';
  },
  /**
   * Format the provided username
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  /**
   * Format the provided username
   * @param  {Object} user The `user` object
   * @return {String}      The formatted user string
   */
  user(user) {
    return '<@' + user.id + '|' + user.name + '>';
  },
  /**
   * Format the provided URL
   * @param  {String} url   The URL
   * @param  {String} title The optional title
   * @return {String}       The formatted URL
   */
  url(url, title) {
    let str = '<' + url;
    if (title) {
      str += '|' + title;
    }
    str += '>';
    return str;
  },
  /**
   * Wrap the passed string in a blockquote
   * @param  {String} str The string to format
   * @return {String}     The formatted string
   */
  blockquote(str) {
    return '> ' + str;
  }
};
