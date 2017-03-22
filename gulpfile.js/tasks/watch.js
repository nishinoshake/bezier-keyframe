/* ----------------------------------------------------
 * Watch
 * ------------------------------------------------- */

var gulp        = require('gulp');
var watch       = require('gulp-watch');
var sourcemap   = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var tasks       = require('../config').tasks;
var actions     = require('../config').actions;

gulp.task('watch', function() {
	return actions.forEach(function(action) {
		watch(tasks[action].src, function() {
			gulp.start(action);
		});
	});
});
