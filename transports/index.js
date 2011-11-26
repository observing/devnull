/**!
 * dev/null
 * @copyright (c) 2011 Observe.it (observe.it) <arnout@observe.com>
 * MIT Licensed
 */

/**
 * Lazy require the `stream` transport.
 */

var stream;
Object.defineProperty(exports, 'stream', {
  get: function () {
    return stream || (stream = require('./stream'))
  }
});

/**
 * Lazy require the transport base.
 */

var transport;
Object.defineProperty(exports, 'transport', {
  get: function () {
    return transport || (transport = require('./transport'))
  }
});
