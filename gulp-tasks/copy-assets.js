var gulp = require('gulp')
var es = require('event-stream')

module.exports = function () {
  return function () {
    return es.merge([
      gulp.src(['app/styles/fonts/**/*.*', 'app/images/**/*.*', 'app/favicon.ico', 'app/robots.txt', 'app/404.html', 'app/config/*'], {base: 'app'}).pipe(gulp.dest('dist')),
      gulp.src('bower_components/datatables.net-dt/images/**/*.*', {base: 'bower_components/datatables.net-dt'}).pipe(gulp.dest('dist')),
      gulp.src('bower_components/bootstrap-sass-official/assets/fonts/**/*.*', {base: 'bower_components/bootstrap-sass-official/assets'}).pipe(gulp.dest('dist/styles'))
    ])
  }
}
