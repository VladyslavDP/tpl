var gulp           = require('gulp'),
    inject         = require('gulp-inject'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync').create(),
    useref         = require('gulp-useref'),
    uglify         = require('gulp-uglify'),
    gulpIf         = require('gulp-if'),
    cssnano        = require('gulp-cssnano'),
    imagemin       = require('gulp-imagemin'),
    cache          = require('gulp-cache'),
    del            = require('del'),
    runSequence    = require('run-sequence'),
    browserify     = require('gulp-browserify'),
    plumber        = require('gulp-plumber'),
    gcmq           = require('gulp-group-css-media-queries'),
    babel          = require('gulp-babel');


var path = {
    build:{
        root: "build",
        img: "build/img",
        fonts: "build/fonts"
    },
    src:{
        root: "src",
        css: "src/css",
        js:{
            lib:{
                bundle: "src/js/bundle",
                script: "src/js/*.js"
            },
            alljs: "src/js/**/*.js"
        },
        scss:{
            styles: "src/scss/styles.scss",
            allscss: "src/scss/**/*.scss"
        }
    },
    allhtml: "src/*.html",
    allimgs: "src/img/**/*.+(png|jpg|jpeg|gif|svg)",
    allfonts: "src/fonts/**/*",
};

gulp.task('sass', function() {
    return gulp.src(path.src.scss.styles) // Gets all files ending with .scss in app/scss
        .pipe(plumber())
        .pipe(sass())
        .pipe(gcmq())
        .pipe(gulp.dest(path.src.css))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: path.src.root
        },
    })
});

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch(path.src.scss.allscss, ['sass']);
    gulp.watch(path.allhtml, browserSync.reload);
    gulp.watch(path.src.js.alljs, browserSync.reload);
    gulp.watch(path.src.js.lib.script , ['scripts']);

});

gulp.task('useref', function(){
    return gulp.src(path.allhtml)
        .pipe(plumber())
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest(path.build.root))
});

gulp.task('images', function(){
    return gulp.src(path.allimgs)
    // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest(path.build.img))
});

gulp.task('fonts', function() {
    return gulp.src(path.allfonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('clean:build', function() {
    return del.sync('build');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('scripts', function() {
    gulp.src(path.src.js.lib.script)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(browserify({
            // insertGlobals : true,
            // debug : !gulp.env.production
        }))
        .pipe(gulp.dest(path.src.js.lib.bundle))
});

gulp.task('build', function (callback) {
    runSequence('clean:build',
        ['sass', 'useref', 'scripts', 'images', 'fonts'],
        callback
    )
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
});

// gulp.task('default', ['sass', 'browserSync', 'scripts', 'watch']);
