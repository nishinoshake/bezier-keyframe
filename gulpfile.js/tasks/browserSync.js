/* ----------------------------------------------------
 * BrowserSync
 *
 * https://www.browsersync.io/
 * ------------------------------------------------- */

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var root        = require('../config').root;
var config      = require('../config').tasks.browserSync;

gulp.task('browserSync', function() {
	browserSync.init(config.option);
});
