/**!
 * dev/null
 * @copyright (c) 2011 observe.it (observe.it) <arnout@observe.com>
 * mit licensed
 */

var Transport = require('./transport')
  , util = require('util');

/**
 * A streaming tranport module for the logger, it should work with every node.js
 * stream that uses the standard write interface.
 *
 * @param {Stream} stream
 * @param {Object} options
 * @api public
 */

var Streamer = module.exports = function streamer (logger, options) {
  // properties that could be overriden
  this.stream = process.stdout;

  Transport.apply(this, arguments);

  // set the correct name
  this.name = 'streamer';
};

/**
 * Inherit from `Transport`
 */

util.inherits(Streamer, Transport);

/**
 * Write the dataz
 *
 * @param {String} type
 * @param {String} namespace
 * @api public
 */

Streamer.prototype.write = function write (type, namespace, args) {
  if (this.stream.writable) {
    this.stream.write(
        this.logger.stamp()
      + ' '
      + this.logger.prefix[type]
      + ' ('
      + namespace
      + ') '
      + this.logger.format.apply(this, args)
      + '\n'
    );
  }

  return this;
};

Streamer.prototype.close = function () {
  // don't close the stdout
  if (this.stream === process.stdout) return this;

  if (this.stream.end) {
    try { this.stream.end() }
    catch (e) {}
  }
}
