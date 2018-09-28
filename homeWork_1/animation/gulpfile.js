var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    cssnano      = require('gulp-cssnano'),
    del          = require('del'), 
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){ 
    return gulp.src('app/scss/**/*.scss') 
        .pipe(sass().on('error', sass.logError))
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(gulp.dest('app/css')) 
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

gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
});



gulp.task('clean', function() {
    return del.sync('dist');
});


gulp.task('build', ['clean', 'sass'], function() {

    var buildCss = gulp.src([ 'app/css/**/*'])
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))

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