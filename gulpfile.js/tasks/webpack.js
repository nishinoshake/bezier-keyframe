/* ----------------------------------------------------
 * Webpack
 * ------------------------------------------------- */

var gulp        = require('gulp');
var cache       = require('gulp-cached');
var	plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
var webpack     = require('webpack-stream');
var browserSync = require('browser-sync');
var root        = require('../config').root;
var config      = require('../config').tasks.webpack;

gulp.task('webpack', function(callback) {
	return gulp.src(config.src, {base: root.src})
		.pipe(cache('webpack'))
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(webpack(require(config.configPath)))
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.stream());
});
