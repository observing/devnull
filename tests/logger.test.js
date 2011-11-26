/**!
 * dev/null
 * @copyright (c) 2011 Observe.it (observe.it) <arnout@observe.com>
 * MIT Licensed
 */

describe('devnull', function () {
  it('should expose the current version number', function () {
    Logger.version.should.be.a('string')
    Logger.version.should.match(/[0-9]+\.[0-9]+\.[0-9]+/)
  })

  it('should expose the logging methods', function () {
    Logger.methods.should.be.a('object')
    Logger.methods.development.should.be.a('object')
    Logger.methods.production.should.be.a('object')

    var production = Object.keys(Logger.methods.production)
      , development = Object.keys(Logger.methods.development)

    production.forEach(function (key) {
      development.indexOf(key).should.be.above(-1)
    })
  })

  it('should expose the logging levels', function () {

  })

  it('should have the same log levels as methods', function () {

  })
})
