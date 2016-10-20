var gulp = require('gulp')
var concat = require('gulp-concat')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var connect = require('gulp-connect')
const babel = require('gulp-babel');

gulp.task('js_dependencies', function() {
    gulp.src([
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/d3/d3.min.js',
        'node_modules/d4/d4.min.js',
        'node_modules/d3-tip/index.js',
        'node_modules/d3-jetpack/d3-jetpack.js',
        'node_modules/ng-lodash/build/ng-lodash.min.js',
        'node_modules/tether/dist/js/tether.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'src/local_libs/widget.dist.js',
        'src/static/js/**/visualizations/*.js'
    ]).pipe(gulp.dest('dist/js/libs'));
});

gulp.task('css_dependencies', function() {
   gulp.src([
       'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
       'node_modules/tether/dist/css/tether.min.css'
   ]).pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
    gulp.src(['src/static/js/**/module.js', 'src/static/js/**/dataviz/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('sass', function() {
    gulp.src('src/static/sass/project.scss')
     .pipe(sass().on('error', sass.logError))
     .pipe(gulp.dest('./dist/css'));
});

gulp.task('pdfs', function() {
    gulp.src('../connect-pdf-scripts/pdfs/*.pdf')
        .pipe(gulp.dest('./src/data/pdfs'))
});

gulp.task('serve', ['build'], function () {
  // will server on localhost:8080 or 0.0.0.0:8080
    connect.server({
         root: 'dist/'
     });
    gulp.watch(['src/**/*.*'],  ['build']);
});

gulp.task('build', ['js', 'js_dependencies', 'css_dependencies', 'sass'], function() {
    gulp.src('src/static/images/logo.svg').pipe(gulp.dest('dist/images/'));
    gulp.src(['src/data/*.json', 'src/data/*.geojson', 'src/data/treatment_all.csv']).pipe(gulp.dest('dist/data/'));
    gulp.src(['src/data/pdfs/*']).pipe(gulp.dest('dist/data/pdfs'));
    gulp.src(['src/index.html']).pipe(gulp.dest('dist/'));
    gulp.src(['src/static/partials/**/*.html']).pipe(gulp.dest('dist/partials'));
});

gulp.task('default', ['serve']);

