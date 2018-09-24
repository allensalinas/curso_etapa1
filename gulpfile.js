var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');

gulp.task('default', function() {
  // place code for your default task here
  // return gulp.src(['./css/styles.css', './css/detail.css', './normalize.css'])
  // .pipe(concat('all.min.css'))
  // .pipe(gulp.dest('./css/'));
});

gulp.task('styles', function () {
  return gulp.src(['./css/styles.css', './css/detail.css', './normalize.css'])
  .pipe(concat('all.min.css'))
  // .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(cleanCSS({compatibility: 'ie8', debug: true}, (details) => {
    console.log(`${details.name}: ${details.stats.originalSize}`);
    console.log(`${details.name}: ${details.stats.minifiedSize}`);
  }))
  .pipe(gulp.dest('./css/'));
});

gulp.task('compress', function() {
  gulp.src(['lib/*.js', 'lib/*.mjs'])
    .pipe(minify())
    .pipe(gulp.dest('js'))
});