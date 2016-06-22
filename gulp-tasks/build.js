var gulp = require('gulp')
var gulpif = require('gulp-if')
var lazypipe = require('lazypipe')
var wiredep = require('gulp-wiredep')

module.exports = function (isDistBuild) {
  var useref = require('gulp-useref')
  var uglify = require('gulp-uglify')
  var csso = require('gulp-csso')
  var connect = require('gulp-connect')

  return function () {
    return gulp.src('app/index.html')
      .pipe(wiredep())
      .pipe(useref({
        searchPath: 'app',
        additionalStreams: [templateCacheStream()]
      },
        compileSass(),
        compileScripts(),
        reorderScripts()
      ))
      .pipe(gulpif('*.js', gulpif(isDistBuild, uglify())))
      .pipe(gulpif('*.css', gulpif(isDistBuild, csso())))
      .pipe(gulpif(!isDistBuild, connect.reload()))
      .pipe(gulp.dest('dist'))
  }
}

function templateCacheStream () {
  var templateCache = require('gulp-angular-templatecache')

  return gulp.src(['app/**/*.html', '!app/*.html'])
    .pipe(templateCache({standalone: true}))
}

function compileSass () {
  var sass = require('gulp-sass')
  var autoprefixer = require('gulp-autoprefixer')

  return lazypipe()
    .pipe(function () { return gulpif('*.scss', wiredep()) })
    .pipe(function () { return gulpif('*.scss', sass()) })
    .pipe(function () { return gulpif('*.scss', autoprefixer()) })
}

function compileScripts () {
  var ngAnnotate = require('gulp-ng-annotate')

  return lazypipe()
    .pipe(function () { return gulpif('**/*.js', ngAnnotate()) })
}

function reorderScripts () {
  var order = require('gulp-order')

  return lazypipe()
    .pipe(function () {
      return gulpif('**/*.js', order([
        'templates.js',
        'app.js',
        '**/*.js'
      ]))
    })
}
