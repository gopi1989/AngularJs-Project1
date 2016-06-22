var del = require('del')

module.exports = function () {
  return function () {
    return del('dist')
  }
}
