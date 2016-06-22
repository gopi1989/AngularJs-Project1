var connect = require('gulp-connect')

module.exports = function () {
  return function () {
    connect.server({
      root: 'dist',
      livereload: true
    })
  }
}
