/*globals it:true, describe:true, Transport:true, fixtures:true, Logger:true, expect:true */
/**!
 * dev/null
 * @copyright (c) 2013 Observe.it (http://observe.it) <opensource@observe.it>
 * MIT Licensed
 */
var Stream = require('../transports').stream;

describe('streamer.transport', function () {
  'use strict';

  it('should be an transport instance', function () {
    var streamy = new Stream();

    expect(streamy).to.be.an.instanceof(Transport);
  });

  it('should have streamer as name', function () {
    var streamy = new Stream();

    expect(streamy.name).to.be.a('string');
    expect(streamy.name).to.equal('streamer');
  });

  it('should have all required functions', function () {
    var streamy = new Stream();

    expect(streamy).to.respondTo('write');
    expect(streamy).to.respondTo('close');
  });

  it('should work with different streams', function () {
    var writeStream = require('fs').createWriteStream('stream.log')
      , streamy = new Stream(null, {
            stream: writeStream
        });

    expect(streamy.stream).to.equal(writeStream);
  });

  it('should default to stdout', function () {
    var streamy = new Stream();

    expect(streamy.stream).to.equal(process.stdout);
  });

  describe("#write", function () {
    it('should trigger the write method of a stream', function () {
      var stream = fixtures.stream()
        , logger = new Logger({ base: false })
        , asserts = 0;

      logger.use(Stream, { stream: stream.dummy });
      stream.on('write', function (str) {
        ++asserts;
      });

      logger.log('testing testing');
      expect(asserts).to.equal(1);
    });

    it('should write to writable streams', function () {
      var stream = fixtures.stream()
        , logger = new Logger({ base: false })
        , asserts = 0;

      stream.dummy.writable = false;

      logger.use(Stream, { stream: stream.dummy });
      stream.on('write', function (str) {
        ++asserts;
      });

      logger.log('testing testing');
      expect(asserts).to.equal(0);
    });
  });

  describe('#close', function () {
    it('should trigger the end method of a stream', function () {
      var stream = fixtures.stream()
        , logger = new Logger({ base: false })
        , asserts = 0;

      logger.use(Stream, { stream: stream.dummy });
      stream.on('end', function (str) {
        ++asserts;
      });

      logger.remove(Stream);
      expect(asserts).to.equal(1);
    });
  });
});
