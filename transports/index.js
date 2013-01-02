'use strict';

/**!
 * dev/null
 * @copyright (c) 2013 Observe.it (http://observe.it) <opensource@observe.it>
 * MIT Licensed
 */

/**
 * Lazy require the different transports
 */
['stream', 'mongodb', 'transport'].forEach(function generate(transport) {
  var cached;

  Object.defineProperty(exports, transport, {
    get: function get() {
      return cached || (cached = require('./'+ transport));
    }
  });
});
