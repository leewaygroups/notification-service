var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    coveralls = require('gulp-coveralls'),
    plumber = require('gulp-plumber');

//Scripts Task
//Uglify
gulp.task('scripts', function () {
    gulp.src(['data-structures/**/*.js', '!data-structures/**/*tests.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

//Tests task
gulp.task('tests', function (cb) {
    var mochaErr;

    gulp.src('test/index.js')
        .pipe(plumber())
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', function (err) {
            mochaErr = err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
});

//Watch task
gulp.task('watch', function () {
    gulp.watch('notification-service/lib/**/*.js', ['tests']);
    gulp.watch('notification-service/public/**/*.js', ['tests']);
    gulp.watch('notification-service/routes/**/*.js', ['tests']);
    gulp.watch('server.js', ['tests']);
});

gulp.task('default', ['tests', 'watch']);