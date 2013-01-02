/*globals it:true, describe:true, Transport:true, fixtures:true, Logger:true, expect:true */

/**!
 * dev/null
 * @copyright (c) 2013 Observe.it (http://observe.it) <opensource@observe.it>
 * MIT Licensed
 */
describe('dev/null, logger', function () {
  'use strict';

  it('should expose the current version number', function () {
    expect(Logger.version).to.be.a('string');
    expect(Logger.version).to.match(/[0-9]+\.[0-9]+\.[0-9]+/);
  });

  it('should expose the logging methods', function () {
    expect(Logger.methods).to.be.a('object');
    expect(Logger.methods.development).to.be.a('object');
    expect(Logger.methods.production).to.be.a('object');

    var production = Object.keys(Logger.methods.production)
      , development = Object.keys(Logger.methods.development);

    expect(production.length).to.be.above(0);
    expect(development.length).to.be.above(0);

    expect(production.length).to.equal(development.length);

    production.forEach(function (key) {
      expect(development.indexOf(key)).to.be.above(-1);
      expect(Logger.methods.production[key]).to.be.a('string');
      expect(Logger.methods.development[key]).to.be.a('string');
    });
  });

  it('should expose the logging levels', function () {
    expect(Logger.levels).to.be.a('object');

    var levels = Object.keys(Logger.levels);
    expect(levels.length).to.be.above(0);

    levels.forEach(function (key) {
      expect(Logger.levels[key]).to.be.a('number');
    });
  });

  it('should have the same log levels as methods', function () {
    var levels = Object.keys(Logger.levels)
      , production = Object.keys(Logger.methods.production);

    expect(levels.length).to.equal(production.length);

    levels.forEach(function (key) {
      expect(production.indexOf(key)).to.be.above(-1);
    });
  });

  describe('#initialization', function () {
    it('should not throw when constructed without arguments', function () {
      var logger = new Logger;
    });

    it('should have defaults', function () {
      var logger = new Logger;

      expect(logger).to.respondTo('configure');
      expect(logger).to.respondTo('use');
      expect(logger).to.respondTo('has');
      expect(logger).to.respondTo('remove');
      expect(logger).to.respondTo('write');

      expect(logger.env).to.be.a('string');
      expect(logger.level).to.be.a('number');
      expect(logger.notification).to.be.a('number');
      expect(logger.timestamp).to.be.a('boolean');
      expect(logger.pattern).to.be.a('string');
    });

    it('should not throw when constructed with an empty object', function () {
      var logger = new Logger({});

      expect(logger).to.respondTo('configure');
      expect(logger).to.respondTo('use');
      expect(logger).to.respondTo('has');
      expect(logger).to.respondTo('remove');
      expect(logger).to.respondTo('write');

      expect(logger.env).to.be.a('string');
      expect(logger.level).to.be.a('number');
      expect(logger.notification).to.be.a('number');
      expect(logger.timestamp).to.be.a('boolean');
      expect(logger.pattern).to.be.a('string');
    });

    it('should override the defaults with a config object', function () {
      var logger = new Logger({
          level: 1
        , notification: 0
        , pattern: 'pew pew'
      });

      expect(logger.level).to.equal(1);
      expect(logger.notification).to.equal(0);
      expect(logger.pattern).to.equal('pew pew');
    });

    it('should not override the methods with a config object', function () {
      var logger = new Logger({ use: 'pewpew' });

      expect(logger).to.respondTo('use');
    });

    it('should not introduce new properties with a config object', function () {
      var logger = new Logger({
          level: 0
        , introduced: true
        , pattern: 'pew pew'
      });

      expect(logger.level).to.equal(0);
      expect(logger.pattern).to.equal('pew pew');
      expect(logger).to.not.have.property('introduced');
    });

    it('should have the same log methods as levels', function () {
      var logger = new Logger
        , levels = Object.keys(Logger.levels)
        , asserts = 0;

      levels.forEach(function (key) {
        expect(logger).to.respondTo(key);
        ++asserts;
      });

      expect(asserts).to.be.above(2);
    });
  });

  describe('#configure', function () {
    it('no evenironment var should always trigger the callback', function () {
      var logger = new Logger
        , asserts = 0;

      expect(logger.configure).to.be.a('function');
      logger.configure(function () {
        ++asserts;
        expect(this).to.equal(logger);
      });

      expect(asserts).to.equal(1);
    });

    it('should trigger callback for all environments and production', function () {
      var logger = new Logger
        , asserts = 0;

      expect(logger.env).to.be.a('string');
      logger.env = 'production';

      logger.configure(function () {
        ++asserts;
        expect(this).to.equal(logger);
      });

      logger.configure('production', function () {
        ++asserts;
        expect(this).to.equal(logger);
      });

      logger.configure('invalid', function () {
        throw new Error('I should not be called');
      });

      expect(asserts).to.equal(2);
    });

    it('should return a logger instance with no arguments are passed', function () {
      var logger = new Logger
        , configure = logger.configure();

      expect(configure).to.equal(logger);
    });

    it('should return a logger instance', function (){
      var logger = new Logger
        , configure = logger.configure(function () {});

      expect(configure).to.equal(logger);
    });
  });

  describe('#use', function () {
    it('should execute the given function', function () {
      var logger = new Logger({ base:false })
        , transport = fixtures.transport()
        , asserts = 0;

      transport.on('initialize', function () {
        ++asserts;
      });

      logger.use(transport.dummy);
      expect(asserts).to.equal(1);
    });

    it('should executed function should receive arguments', function () {
      var logger = new Logger({ base:false })
        , transport = fixtures.transport()
        , asserts = 0;

      transport.on('initialize', function (self, options) {
        ++asserts;

        expect(self).to.equal(logger);
        expect(options.foo).to.equal('bar');
      });

      logger.use(transport.dummy, { foo:'bar' });
      expect(asserts).to.equal(1);
    });

    it('should add the transport to the transports array', function () {
      var logger = new Logger({ base:false })
        , transport = fixtures.transport()
        , asserts = 0;

      transport.on('initialize', function () {
        ++asserts;
      });

      expect(logger.transports.length).to.equal(0);
      logger.use(transport.dummy);
      expect(logger.transports.length).to.equal(1);
      expect(asserts).to.equal(1);
    });

    it('should create a new instance of the function', function () {
      var logger = new Logger({ base:false })
        , transport = fixtures.transport()
        , asserts = 0;

      transport.on('initialize', function () {
        ++asserts;
      });

      logger.use(transport.dummy);
      expect(logger.transports[0]).to.be.an.instanceof(transport.dummy);
      expect(asserts).to.equal(1);
    });

    it('should only add functions', function () {
      var logger = new Logger({ base:false });

      expect(logger.transports.length).to.equal(0);

      logger.use('string');
      expect(logger.transports.length).to.equal(0);

      logger.use({});
      expect(logger.transports.length).to.equal(0);

      logger.use([]);
      expect(logger.transports.length).to.equal(0);

      logger.use(1337);
      expect(logger.transports.length).to.equal(0);

      logger.use(new Date);
      expect(logger.transports.length).to.equal(0);

      logger.use(/regexp/);
      expect(logger.transports.length).to.equal(0);
    });

    it('should return a logger instance', function () {
      var logger = new Logger({ base:false })
        , use = logger.use(function () {});

      expect(use).to.equal(logger);
    });
  });

  describe('#has', function () {
    it('should return a boolean for failures', function () {
      var logger = new Logger({ base:false });

      expect(logger.has('a')).to.be.a('boolean');
      expect(logger.has('b')).to.eql(false);
    });

    it('should not throw without when called without arguments', function () {
      var logger = new Logger({ base:false });

      expect(logger.has()).to.be.a('boolean');
    });

    it('should return the found instance', function () {
      var logger = new Logger({ base:false })
        , transport = fixtures.transport();

      logger.use(transport.dummy);
      expect(logger.has(transport.dummy)).to.be.an.instanceof(transport.dummy);
    });

    it('should return the found match, if it equals the argument', function () {
      var logger = new Logger({ base:false });

      function Dummy () {
        return true;
      }

      logger.transports.push(new Dummy);
      expect(logger.has(Dummy)).to.not.equal(false);
    });
  });

  describe('#remove', function () {
    it('should call the .destroy method of the instance', function () {
      var logger = new Logger({ base:false })
        , transport = fixtures.transport()
        , asserts = 0;

      transport.on('close', function () {
        ++asserts;
      });

      logger.use(transport.dummy);
      logger.remove(transport.dummy);

      expect(asserts).to.equal(1);
    });

    it('should remove the transport from the transports array', function () {
      var logger = new Logger({ base:false })
        , transport = fixtures.transport()
        , asserts = 0;

      transport.on('close', function () {
        ++asserts;
      });

      logger.use(transport.dummy);
      expect(logger.transports.length).to.equal(1);

      var rm = logger.remove(transport.dummy);
      expect(logger.transports.length).to.equal(0);

      expect(rm).to.equal(logger);
      expect(asserts).to.equal(1);
    });

    it('should return a logger instance when nothing is found', function () {
      var logger = new Logger({ base:false });

      expect(logger.remove()).to.equal(logger);
    });

    it('should only remove the given logger instance', function () {
      var logger = new Logger
        , transport = fixtures.transport()
        , base = require('../transports/stream');

      expect(logger.transports.length).to.equal(1);

      logger.use(transport.dummy);
      expect(logger.transports.length).to.equal(2);

      logger.remove(transport.dummy);
      expect(logger.transports.length).to.equal(1);
      expect(logger.transports.pop()).to.be.an.instanceof(base);
    });
  });

  describe('#stamp', function () {
    it('should not generate a timestamp when disabled', function () {
      var logger = new Logger({ timestamp: false });

      expect(logger.stamp()).to.be.a('string');
      expect(logger.stamp()).to.equal('');
    });

    it('should default to today when called without arguments', function () {
      var logger = new Logger({ pattern: '{FullYear}{Date}'})
        , today = new Date;

      expect(logger.stamp()).to.be.a('string');
      expect(logger.stamp()).to.equal(today.getFullYear() + '' + today.getDate());
    });

    it('should also execute date methods instead of patterns', function () {
      var logger = new Logger({ pattern: '{toLocaleDateString}' })
        , now = new Date;

      expect(logger.stamp(now)).to.equal(now.toLocaleDateString());
    });

    it('should pad the values based on the pattern', function () {
      var logger = new Logger({ pattern: '{Date:10}' })
        , date = new Date(2011, 6, 5);

      expect(logger.stamp(date)).to.equal('0000000005');
    });

    it('should increase month by 1', function () {
      var logger = new Logger({ pattern: '{Month}' })
        , date = new Date(2011, 6, 12);

      expect(logger.stamp(date)).to.equal('7');
    });

    it('should just non template tags', function () {
      var logger = new Logger({ pattern: 'hello <b>world</b> its {FullYear}'})
        , date = new Date;

      expect(logger.stamp(date)).to.equal('hello <b>world</b> its ' + date.getFullYear());
    });
  });

  describe('.notification', function () {
    it('should default to warnings', function () {
      var logger = new Logger;

      expect(logger.notification).to.equal(Logger.levels.warning);
    });

    it('should emit events when the notification log level is used', function () {
      var stream = fixtures.stream()
        , logger = new Logger({ base:false })
        , asserts = 0;

      logger.use(Transport.stream, { stream: stream.dummy });

      logger.on('warning', function (args, stack) {
        expect(args[0]).to.equal('foo bar');
        expect(args[1]).to.equal('ping ping');

        ++asserts;
      });

      logger.warning('foo bar', 'ping ping');
      expect(asserts).to.equal(1);
    });

    it('should only emit logs <= notification level', function () {
      var stream = fixtures.stream()
        , logger = new Logger({ base:false })
        , asserts = 0;

      logger.use(Transport.stream, { stream: stream.dummy });

      logger.on('warning', function () {
        ++asserts;
      });

      logger.on('error', function () {
        ++asserts;
      });

      logger.on('metric', function () {
        throw new Error('Should fail hard, dont run this shit yo');
      });

      logger.warning('is eaual to the notification level');
      logger.metric('is higher then the notification level');
      logger.error('is lower then the notification level');

      expect(asserts).to.equal(2);
    });

    it('the level should configurable', function () {
      var stream = fixtures.stream()
        , logger = new Logger({
              base:false
            , notification: 1
          })
        , asserts = 0;

      logger.use(Transport.stream, { stream: stream.dummy });

      logger.on('critical', function (args, stack) {
        ++asserts;
      });

      logger.on('warning', function (args, stack) {
        throw new Error('I should not run');
      });

      logger.warning('foo bar', 'ping ping');
      logger.critical('i should trigger the shizz');
      expect(asserts).to.equal(1);
    });

    it('should be able to emit notifications without any transports', function () {
      var logger = new Logger({
              base: false
            , notification: 10
          })
        , asserts = 0;

        logger.on('debug', function () {
          ++asserts;
        });

        logger.debug('pew');
        expect(asserts).to.equal(1);
    });

    it('should only emit when there are listeners applied', function () {
      var logger = new Logger({ base:false });

      logger.error('errors are usually thrown by the EventEmitter');
      logger.error('if there are no error listeners so this should not throw');
    });
  });

  describe('#get', function () {
    it('should return the value for the given key', function () {
      var logger = new Logger;

      expect(logger.get('env')).to.equal(logger.env);
      expect(logger.get('pattern')).to.equal(logger.pattern);
    });

    it('should return nothing for unknown keys', function () {
      var logger = new Logger;

      expect(logger.get('trolololol')).to.be.a('undefined');
    });
  });

  describe('#set', function () {
    it('should set values', function () {
      var logger = new Logger;

      logger.set('env', 'testing');
      expect(logger.get('env')).to.equal('testing');
    });

    it('should only set values for existing keys', function () {
      var logger = new Logger;

      logger.set('aaaaa', 12);
      expect(logger.get('aaaaa')).to.be.a('undefined');
    });

    it('should emit an event when a new value is set', function (next) {
      var logger = new Logger;

      logger.on('settings:env', function (value) {
        expect(value).to.equal('testing');
        next();
      });

      logger.set('env', 'testing');
    });

    it('should not emit an event when the value stays the same', function (next) {
      var logger = new Logger;

      logger.on('settings:env', function (value) {
        throw new Error('dafuq, dont emit on the same value');
      });

      logger.set('env', logger.get('env'));
      setTimeout(next, 10);
    });
  });

  describe('#enabled', function () {
    it('should be enabled', function () {
      var logger = new Logger;

      expect(logger.enabled('base')).to.eql(true);
      expect(logger.enabled('timestamp')).to.eql(true);
    });

    it('should not be enabled', function () {
      var logger = new Logger;

      logger.set('timestamp', false);
      logger.set('base', false);

      expect(logger.enabled('base')).to.eql(false);
      expect(logger.enabled('timestamp')).to.eql(false);
    });
  });

  describe('#disabled', function () {
    it('should be not be disabled', function () {
      var logger = new Logger;

      expect(logger.disabled('base')).to.eql(false);
      expect(logger.disabled('timestamp')).to.eql(false);
    });

    it('should be disabled', function () {
      var logger = new Logger;

      logger.set('timestamp', false);
      logger.set('base', false);

      expect(logger.disabled('base')).to.eql(true);
      expect(logger.disabled('timestamp')).to.eql(true);
    });
  });

  describe('#ignore', function () {
    it('should be chainable', function () {
      var logger = new Logger;

      expect(logger.ignore(__filename)).to.equal(logger);
    });

    it('should ignore the current file', function () {
      var logger = new Logger({ notification: 10 })
        , emits = 0;

      logger.on('info', function () {
        emits++;
      });

      // ensure that normal logs work
      logger.info('foo');
      expect(emits).to.equal(1);

      logger.ignore(__filename);
      logger.info('foo');

      // should not increase as this log should be ignored
      expect(emits).to.equal(1);
    });
  });

  describe('#unignore', function () {
    it('should be chainable', function () {
      var logger = new Logger;

      expect(logger.unignore(__filename)).to.equal(logger);
    });

    it('should unignore the current file', function () {
      var logger = new Logger({ notification: 10 })
        , emits = 0;

      logger.on('info', function () {
        emits++;
      });

      // ensure that normal logs work
      logger.info('foo');
      expect(emits).to.equal(1);

      logger.ignore(__filename);
      logger.info('foo');
      expect(emits).to.equal(1);

      // unignore, and it should increase the emit's again
      logger.unignore(__filename);
      logger.info('foo');
      expect(emits).to.equal(2);
    });
  });

  describe('#ignoring', function () {
    it('should not be ignoring a random file', function () {
      var logger = new Logger;

      expect(logger.ignoring('adfaslfkjasd;lfjslf')).to.equal(false);
    });

    it('should be ignoring the current file', function () {
      var logger = new Logger;

      logger.ignore(__filename);
      expect(logger.ignoring(__filename)).to.equal(true);
    });

    it('should not be ignoring the current file', function () {
      var logger = new Logger;

      logger.ignore(__filename);
      expect(logger.ignoring(__filename)).to.equal(true);
      logger.unignore(__filename);
      expect(logger.ignoring(__filename)).to.equal(false);
    });
  });

  describe('#format', function () {
    it('should format strings', function () {
      var logger = new Logger;

      expect(logger.format('foo %s', 'bar')).to.equal('foo bar');
      expect(logger.format('foo %s baz %s', 'bar', 'lol')).to.equal('foo bar baz lol');
      expect(logger.format('foo %s', 1)).to.equal('foo 1');
    });

    it('should format json', function () {
      var logger = new Logger;

      var arr = [1, 2]
        , obj = { foo: 'bar' }
        , nest = { arr: arr };

      expect(logger.format('hi %j', arr)).to.equal('hi ' + JSON.stringify(arr));
      expect(logger.format('hi %j', obj)).to.equal('hi ' + JSON.stringify(obj));
      expect(logger.format('hi %j', nest)).to.equal('hi ' + JSON.stringify(nest));
    });

    it('should format digits', function () {
      var logger = new Logger;

      expect(logger.format('%d + %d = %d', 1,2,3)).to.equal('1 + 2 = 3');
    });

    it('should escape %', function () {
      var logger = new Logger;

      expect(logger.format('wassup %')).to.equal('wassup %');
      expect(logger.format('wassup %%')).to.equal('wassup %%');
    });
  });
});
