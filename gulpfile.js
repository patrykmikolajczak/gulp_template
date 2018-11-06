'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    scss = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync').create();

var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        other: 'dist/'
    },
    source: {
        pug: 'src/pug/*.pug',
        js: 'src/js/**/*.js',
        scss: 'src/scss/',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        other: 'src/*.*'
    },
    watch: {
        pug: 'src/pug/**/*.*',
        js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        other: 'src/*.*'
    }
};

gulp.task('pug:build', function () {
    gulp.src(path.source.pug)
        .pipe(pug({ pretty: true, locals: { metrika: false } }))
        .pipe(gulp.dest(path.dist.html));
});

gulp.task('js:build', function () {
    gulp.src(path.source.js)
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('scss:build', function () {
    gulp.src(path.source.scss+'*.scss')
        .pipe(scss({
      includePaths: ['node_modules/bootstrap/scss/']
    }).on('error', scss.logError))
        .pipe(prefixer('last 2 versions'))
        .pipe(gulp.dest(path.dist.css))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.dist.css+'min/'));
});

gulp.task('image:build', function () {
    gulp.src(path.source.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img));
});

gulp.task('fonts:build', function() {
    gulp.src(path.source.fonts)
        .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('other:build', function() {
    gulp.src(path.source.other)
        .pipe(gulp.dest(path.dist.other));
});


gulp.task('clean', function (cb) {
    rimraf('./dist', cb);
});

gulp.task('build', [
    'js:build',
    'scss:build',
    'fonts:build',
    'image:build',
    'pug:build',
    'other:build'
]);

gulp.task('watch', function(){
    watch([path.watch.pug], function(event, cb) {
        gulp.start('pug:build');
    });
    watch([path.watch.scss], function(event, cb) {
        gulp.start('scss:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    // watch([path.watch.libs], function(event, cb) {
    //     gulp.start('libs:build');
    // });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    // watch([path.watch.data], function(event, cb) {
    //     gulp.start('data:build');
    // });
});

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
});

gulp.task('default', ['build', 'watch']);
