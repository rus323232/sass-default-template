"use strict";

const gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      concat      = require('gulp-concat'),
      browserify  = require('browserify'),
      babelify    = require('babelify'),
      source      = require('vinyl-source-stream'),
      cleanCSS    = require('gulp-clean-css'),
      uglify      = require('gulp-uglify'),
      buffer      = require('vinyl-buffer'),
      image       = require('gulp-image'),
      rigger      = require('gulp-rigger'),
      browserSync = require('browser-sync');

gulp.task('html', () => {
    gulp.src('src/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('dist/'))
});

gulp.task('sass', () => {
    return gulp.src(['src/sass/app.scss'])
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('js', () => {
    return browserify({entries: 'src/js/app.js'})
        .transform(babelify, { presets: ['es2015'] })
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('webserver', () => {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false,
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

gulp.task('image', () => {
    gulp.src('src/images/**/*')
        .pipe(image())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});


gulp.task('watch', () => {
    gulp.watch(['src/**/*.html'], ['html']);
    gulp.watch(['src/sass/**/*.scss'], ['sass']);
    gulp.watch(['src/js/**/*.js'], ['js']);
    gulp.watch(['src/images/**/*'], ['image']);
    gulp.watch('dist/**/*', browserSync.reload);
});

gulp.task('build', ['html','js','sass','image', 'fonts']);
gulp.task('default', ['build','webserver','watch']);
