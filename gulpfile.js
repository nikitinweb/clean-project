const gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    imagemin = require('gulp-imagemin');

const html = () => {
        return gulp.src('./src/**/*.html')
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream());
    },

    styles = () => {
        return gulp.src('./src/sass/**/*.sass')
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 5 versions'],
                cascade: false
            }))
            // .pipe(cleanCSS({
            //   level: 2
            // }))
            .pipe(gulp.dest('./build/css'))
            .pipe(browserSync.stream());
    },

    scripts = () => {
        return gulp.src('./src/js/**/*.js')
            .pipe(babel({
                presets: ['@babel/env']
            }))
            // .pipe(uglify())
            .pipe(gulp.dest('./build/js'))
            .pipe(browserSync.stream());

    },


    img = () => {
        return gulp.src('src/img/**/*')
            .pipe(imagemin([
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.jpegtran({
                    progressive: true
                }),
                imagemin.optipng({
                    optimizationLevel: 5
                }),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: true
                    },
                        {
                            cleanupIDs: false
                        }
                    ]
                })
            ]))
            .pipe(gulp.dest('build/img'));
    },


    clean = () => {
        return del(['build/*']);
    },

    watch = () => {
        browserSync.init({
            server: {
                baseDir: "./build/"
            },
            tunnel: true
        });
        gulp.watch('./src/**/*.html', html);
        gulp.watch('./src/sass/**/*.sass', styles);
        gulp.watch('./src/js/**/*.js', scripts);
    };

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('img', img);

gulp.task('watch', watch);
gulp.task('build', gulp.series(clean,
    gulp.parallel(html, styles, scripts)
));

gulp.task('default', gulp.series('build', 'img', 'watch'));