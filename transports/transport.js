var EventEmitter = process.EventEmitter;

/**
 * The base setup.
 *
 * @constructor
 * @param {Object} options
 * @api private
 */

var Transport = module.exports = function transport (options) {
  options = options || {};

  this.name = 'transport';

  // extend
  for (var key in options) this[key] = options[key];
};

Transport.prototype.__proto__ = EventEmitter.prototype;

/**
 * This the function that gets called for each log call and should always be
 * present in a transport.
 *
 * @param {String} type log type
 * @param {String} namespace namespace
 * @param {String} timestamp stamp
 * @api public
 */

Transport.prototype.write = function write (type, namespace, timestamp) {};
