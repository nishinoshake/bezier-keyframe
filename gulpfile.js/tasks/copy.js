/* ----------------------------------------------------
 * Copy
 * ------------------------------------------------- */

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var root        = require('../config').root;
var config      = require('../config').tasks.copy;

gulp.task('copy', function() {
	return gulp.src(config.src, {base: root.src})
		.pipe(gulp.dest(root.dest))
		.pipe(browserSync.stream());
});
