var karma = require('karma')
var path = require('path')

module.exports = function (singleRun) {
  return function (done) {
    new karma.Server({
      configFile: path.resolve('test/karma.conf.js'),
      singleRun: singleRun
    }, done).start()
  }
}
