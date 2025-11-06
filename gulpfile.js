const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const yargs = require('yargs');

// 환경 설정
const isProduction = yargs.argv.production || process.env.NODE_ENV === 'production';

// 경로 설정
const paths = {
  js: {
    src: [
      'assets/js/**/*.js',
      '!assets/js/min/**/*.js', // 이미 minify된 파일 제외
      '!assets/js/prism/**/*.min.js', // Prism minified 파일 제외
      '!assets/js/**/*.min.js' // 모든 .min.js 파일 제외
    ],
    dest: 'assets/js/min/'
  },
  css: {
    src: [
      'assets/css/**/*.css',
      '!assets/css/min/**/*.css', // 이미 minify된 파일 제외
      '!assets/css/**/*.min.css' // 모든 .min.css 파일 제외
    ],
    dest: 'assets/css/min/'
  }
};

// Clean task
function clean() {
  return del([
    'assets/js/min/',
    'assets/css/min/'
  ]);
}

// JavaScript minification
function minifyJS() {
  return gulp.src(paths.js.src)
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(gulpIf(isProduction, uglify({
      compress: {
        drop_console: true, // 콘솔 로그 제거 (프로덕션)
        drop_debugger: true,
        unused: true,
        dead_code: true
      },
      mangle: true,
      output: {
        comments: false // 주석 제거
      }
    })))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulpIf(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.js.dest));
}

// CSS minification
function minifyCSS() {
  return gulp.src(paths.css.src)
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(gulpIf(isProduction, cleanCSS({
      compatibility: 'ie8',
      level: 2
    })))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulpIf(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.css.dest));
}

// Watch task
function watch() {
  gulp.watch(paths.js.src, minifyJS);
  gulp.watch(paths.css.src, minifyCSS);
}

// Build tasks
const buildDev = gulp.series(clean, gulp.parallel(minifyJS, minifyCSS));
const buildProd = gulp.series(clean, gulp.parallel(minifyJS, minifyCSS));

// Export tasks
exports.clean = clean;
exports.minifyJS = minifyJS;
exports.minifyCSS = minifyCSS;
exports.watch = watch;
exports['build:dev'] = buildDev;
exports['build:prod'] = buildProd;
exports.build = buildProd;
exports.default = buildProd;