var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
var sass       = require('gulp-ruby-sass');

gulp.task('develop', function () {
  nodemon({script: './app.js', ext: 'js ejs json', legacyWatch: true });
});

gulp.task('default', ['develop']);