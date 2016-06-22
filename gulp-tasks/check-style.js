var gulp = require('gulp')
var standard = require('gulp-standard')

var lintFiles = [
  './app/**/*.js',
  './test/**/*.js',
  './gulp-tasks/**/*.js',
  './gulpfile.js'
]

module.exports = function () {
  return function () {
    return gulp.src(lintFiles)
      .pipe(standard())
      .pipe(standard.reporter('default', {breakOnError: true}))
  }
}
