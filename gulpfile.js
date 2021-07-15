'use strict';

const gulp = require('gulp');
const prefixer = require('gulp-autoprefixer');
const gulpScss = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const browsersync = require('browser-sync').create();

var path = {
    dist: {
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        other: 'dist/'
    },
    source: {
        js: 'src/js/**/*.js',
        scss: 'src/scss/',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        other: 'src/*.*'
    },
    watch: {
        js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        other: 'src/*.*'
    }
};


function js() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        path.source.js
    ])
        .pipe(gulp.dest(path.dist.js))
        .pipe(browsersync.stream())
};

function scss() {
    return gulp.src(path.source.scss)
        .pipe(gulpScss({
            includePaths: ['node_modules/bootstrap/scss/']
        }).on('error', gulpScss.logError))
        .pipe(prefixer('last 2 versions'))
        .pipe(gulp.dest(path.dist.css))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.dist.css))
        .pipe(gulp.src(path.source.scss+'*.css'))
        .pipe(gulp.dest(path.dist.css))
        .pipe(browsersync.stream())
};

function image() {
    return gulp.src(path.source.img)
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            })
        ]))
        .pipe(gulp.dest(path.dist.img))
        .pipe(browsersync.stream())
};

function fonts() {
    return gulp.src(path.source.fonts)
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(browsersync.stream())
};

function other() {
    return gulp.src(path.source.other)
        .pipe(gulp.dest(path.dist.other))
        .pipe(browsersync.stream())
};

function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: './dist/',
      },
      port: 3000,
    });
    done();
}

function watchFiles() {
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img, image);
    gulp.watch(path.watch.fonts, fonts);
    gulp.watch(path.watch.other, other);
}

const build = gulp.series(
    js,
    scss,
    fonts,
    image,
    other
);

const serve = gulp.series(build, gulp.parallel(watchFiles, browserSync));

exports.image = image;
exports.serve = serve;
exports.build = build;
exports.default = serve;
