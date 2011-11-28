/**!
 * dev/null
 * @copyright (c) 2011 observe.it (observe.it) <arnout@observe.com>
 * mit licensed
 */

var MongoDB = require('../transports').mongodb
  , mongodb = require('mongodb')
  , should = require('should')
  , url = fixtures.mongodb

describe('mongodb.transport', function () {
  it('should be an transport instance', function () {
    var mongo = new MongoDB

    mongo.should.be.an.instanceof(Transport)
  })

  it('should have mongodb as name', function () {
    var mongo = new MongoDB

    mongo.name.should.be.a('string')
    mongo.name.should.equal('mongodb')
  })

  it('should have defaults', function () {
    var mongo = new MongoDB

    mongo.collection.should.be.a('string')
    mongo.save.should.be.a('boolean')
    mongo.reconnect.should.be.a('boolean')
    mongo.pool.should.be.a('number')
    mongo.url.should.be.a('string')
  })

  it('should have all required functions', function () {
    var mongo = new MongoDB

    mongo.should.respondTo('collect')
    mongo.should.respondTo('open')
    mongo.should.respondTo('allocate')

    mongo.should.respondTo('write')
    mongo.should.respondTo('close')
  })

  describe('#allocate', function () {
    it('should connect to mongodb', function (next) {
      var mongo = new MongoDB({ url: url })

      mongo.allocate('log', function (err, db) {
        mongo.close()

        should.not.exist(err)

        next()
      })
    })

    it('should have the correct arguments', function (next) {
      var mongo = new MongoDB({ url: url })

      mongo.allocate('log', function (err, db) {
        mongo.close()

        should.not.exist(err)
        should.exist(db)
        should.exist(this)

        next()
      })
    })
  })
})
