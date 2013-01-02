/*globals it:true, describe:true, Transport:true, fixtures:true, Logger:true, expect:true */
/**!
 * dev/null
 * @copyright (c) 2013 Observe.it (http://observe.it) <opensource@observe.it>
 * MIT Licensed
 */
var MongoDB = require('../transports').mongodb
  , mongodb = require('mongodb')
  , url = fixtures.mongodb;

describe('mongodb.transport', function () {
  'use strict';

  it('should be an transport instance', function () {
    var mongo = new MongoDB;

    expect(mongo).to.be.an.instanceof(Transport);
  });

  it('should have mongodb as name', function () {
    var mongo = new MongoDB;

    expect(mongo.name).to.be.a('string');
    expect(mongo.name).to.equal('mongodb');
  });

  it('should have defaults', function () {
    var mongo = new MongoDB;

    expect(mongo.collection).to.be.a('string');
    expect(mongo.save).to.be.a('boolean');
    expect(mongo.reconnect).to.be.a('boolean');
    expect(mongo.pool).to.be.a('number');
    expect(mongo.url).to.be.a('string');
  });

  it('should have all required functions', function () {
    var mongo = new MongoDB;

    expect(mongo).to.respondTo('collect');
    expect(mongo).to.respondTo('open');
    expect(mongo).to.respondTo('allocate');
    expect(mongo).to.respondTo('write');
    expect(mongo).to.respondTo('close');
  });

  describe('#allocate', function () {
    it('should connect to mongodb', function (next) {
      var mongo = new MongoDB({ url: url });

      mongo.allocate('log', function (err, db) {
        mongo.close();

        expect(!err).to.equal(true);
        next();
      });
    });

    it('should have the correct arguments', function (next) {
      var mongo = new MongoDB({ url: url });

      mongo.allocate('log', function (err, db) {
        mongo.close();

        expect(!err).to.equal(true);
        expect(!!db).to.equal(true);
        expect(!!this).to.equal(true);

        next();
      });
    });
  });

  describe('#write', function () {
    it('should not emit failures when writing', function (next) {
      var logger = new Logger({ base: false });

      logger.use(MongoDB, { url: url });

      logger.on('transport:error', function () {
        logger.remove(MongoDB);
        throw new Error('I should not fail');
      });

      logger.on('transport:failure', function () {
        logger.remove(MongoDB);
        throw new Error('I should not fail');
      });

      logger.on('transport:write', function () {
        logger.remove(MongoDB);
        next();
      });

      logger.log('hello world');
    });

    it('should send the correct data', function (next) {
      var logger = new Logger({ base: false });

      logger.use(MongoDB, { url: url });

      logger.on('transport:error', function () {
        logger.remove(MongoDB);
        throw new Error('should not have errors');
      });

      logger.on('transport:failure', function () {
        logger.remove(MongoDB);
        throw new Error('should not have errors');
      });

      logger.on('transport:write', function (log) {
        logger.remove(MongoDB);

        expect(log.type).equal('log');
        expect(log).to.have.property('stamp');
        expect(log.level).to.equal(Logger.levels[log.type]);
        expect(Array.isArray(log.args)).to.equal(true);

        next();
      });

      logger.log('hello world');
    });
  });

  describe('#close', function () {
    it('should close and clean up the connection', function (next) {
      var logger = new Logger({ base: false });

      logger.use(MongoDB, { url: url });

      logger.on('transport:error', function () {
        logger.remove(MongoDB);
        throw new Error('should not have errors');
      });

      logger.on('transport:failure', function () {
        logger.remove(MongoDB);
        throw new Error('should not have fail');
      });

      logger.on('transport:write', function () {
        var instance = logger.transports[0];
        logger.remove(MongoDB);

        expect(!instance.stream).to.equal(true);
        next();
      });

      logger.log('hello world');
    });
  });
});
