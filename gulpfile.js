var gulp = require('gulp')

gulp.task('check-style', require('./gulp-tasks/check-style')())

gulp.task('test', require('./gulp-tasks/test')(false))
gulp.task('test-once', require('./gulp-tasks/test')(true))

gulp.task('clean-dist', require('./gulp-tasks/clean-dist')())
gulp.task('copy-assets', ['clean-dist'], require('./gulp-tasks/copy-assets')())
gulp.task('build-dist', ['clean-dist', 'copy-assets'], require('./gulp-tasks/build')(true))

gulp.task('build-dev', ['clean-dist', 'copy-assets'], require('./gulp-tasks/build')(false))
gulp.task('rebuild', require('./gulp-tasks/build')(false))
gulp.task('connect', require('./gulp-tasks/connect')())
gulp.task('watch', ['build-dev', 'connect'], function () {
  var open = require('open')
  open('http://localhost:8080')

  return gulp.watch('app/**/*', ['rebuild'])
})
