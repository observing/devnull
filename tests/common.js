/**!
 * @copyright (c) 2011 Observe.it (observe.it) <arnout@observe.com>
 * MIT Licensed
 */

var EventEmitter = require('events').EventEmitter
  , slice = Array.prototype.slice;

/**
 * Default globals
 */

Logger = require('../');
Transport = require('../transports/transport');
Transports = require('../transports/');

/**
 * Fixtures
 */

fixtures = {};
fixtures.transport = function () {
  var EE = new EventEmitter();

  /**
   * A small evented dummy that allows us to listen to different events
   *
   * @api private
   */

  function dummy () {
    EE.emit.apply(EE, ['initialize'].concat(slice.call(arguments)));

    this.close = function close () {
      EE.emit.apply(EE, ['close'].concat(slice.call(arguments)));
    }

    this.write = function write () {
      EE.emit.apply(EE, ['write'].concat(slice.call(arguments)));
    }
  }

  // return the fake transport
  return {
      on: function (name, fn) { EE.on(name, fn) }
    , dummy: dummy
  }
};
