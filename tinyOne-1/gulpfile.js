var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    cssnano      = require('gulp-cssnano'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'), 
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    wait         = require('gulp-wait');
    

gulp.task('sass', function(){ 
    return gulp.src('app/scss/**/*.scss') 
        .pipe(wait(500))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(gulp.dest('app/css')) 
        .pipe(browserSync.reload({stream: true})) 
});

// gulp.task('sass', function () {
//     return gulp.src('/**/*.scss')
//       .pipe(wait(500))
//     //   .pipe( sass().on( 'error', notify.onError(
//     //           {
//     //             message: "<%= error.message %>",
//     //             title  : "Sass Error!"
//     //           } ) )
//     //       )//Код вывод ошибок для натифи
//       .pipe(sourcemaps.init())
//       .pipe(postcss(plugins))
//       .pipe(sourcemaps.write('./'))
// });

gulp.task('scripts', function(){ 
    return gulp.src(['app/js/**/*.js', '!app/js/scripts.js']) 
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('browser-sync', function() {
    browserSync({ 
        server: { 
            baseDir: 'app'
        },
        notify: false 
    });
});



gulp.task('watch', ['browser-sync', 'sass','scripts'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', ['scripts']);
});


gulp.task('clean', function() {
    return del.sync('dist');
});



gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ 'app/css/**/*'])
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/scripts.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))

    var buildLibs = gulp.src('app/libs/**/*')
    .pipe(uglify())
    .pipe(gulp.dest('dist/libs'))

    var buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('browser-build', function() {
    browserSync({ 
        server: { 
            baseDir: 'dist'
        },
        notify: false 
    });
});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);