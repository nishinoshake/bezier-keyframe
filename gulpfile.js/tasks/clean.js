/* ----------------------------------------------------
 * Clean
 * ------------------------------------------------- */

var gulp = require('gulp');
var del  = require('del');
var root = require('../config').root;

gulp.task('clean', function() {
	return del([root.dest]);
});
