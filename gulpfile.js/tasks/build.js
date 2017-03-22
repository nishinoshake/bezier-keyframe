/* ----------------------------------------------------
 * Build
 * ------------------------------------------------- */

var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');
var actions      = require('../config').actions;

gulp.task('build', gulpSequence('clean', actions));
