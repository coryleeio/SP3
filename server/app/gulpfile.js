var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
var sass       = require('gulp-ruby-sass');
var ejs        = require('gulp-ejs');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('develop', function () {
  nodemon({script: './app.js', ext: 'js hjs json', legacyWatch: true });
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/templates/**/*', ['render-templates']);
  gulp.watch('./src/js/**/*.js', ['browserify']);
});

gulp.task('sass', function() {
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'))
    .on('error', function (err) {
      console.log(err.message);
    })
  ;
});

gulp.task('browserify', function() {
  browserify('./src/js/main.js')
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('render-templates', function() {
    gulp.src("./src/templates/*.ejs")
        .pipe(ejs({
            masterServerHost: process.env.MASTER_SERVER_HOST,
            masterServerPort: process.env.MASTER_SERVER_PORT,
            host: process.env.HOST,
            port: process.env.PORT
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('default', [ 'sass', 'render-templates', 'browserify','develop']);
gulp.task('build', ['sass', 'render-templates', 'browserify']);
