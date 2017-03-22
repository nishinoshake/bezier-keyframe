/* ----------------------------------------------------
 * SASS
 *
 * http://sass-lang.com/
 * ------------------------------------------------- */

var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var sass         = require('gulp-sass');
var cssnano      = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var sourcemap    = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');
var root         = require('../config').root;
var config       = require('../config').tasks.sass;

gulp.task('sass', function (callback) {
	return gulp.src(config.src, {base: config.base})
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemap.init())
		.pipe(sass(config.option))
		.pipe(autoprefixer(config.autoprefixer))
		.pipe(cssnano())
		.pipe(sourcemap.write('.'))
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.stream());
});
