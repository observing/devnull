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
  this.logger = logger;
  this.stream = options.stream || process.stdout;
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
 * @param {String} timestamp
 * @api public
 */

Streamer.prototype.write = function write (type, namespace, timestamp, args) {
  if (this.stream.writable) {
    this.stream.write(
        stamp
      + ' '
      + this.logger.prefix[type]
      + ' ('
      + namespace
      + ')'
      + this.logger.format(args)
    );
  }
};
