const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
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
      '!assets/js/prism/**/*.min.js', // Prism minified 파일 제외
      '!assets/js/**/*.min.js' // 모든 .min.js 파일 제외
    ],
    dest: '_site/assets/js/'
  },
  css: {
    src: [
      'assets/css/**/*.css',
      '!assets/css/**/*.min.css' // 모든 .min.css 파일 제외
    ],
    dest: '_site/assets/css/'
  },
  html: {
    src: '_site/**/*.html',
    dest: '_site/'
  }
};

// Clean task
function clean() {
  return del([
    '_site/assets/js/',
    '_site/assets/css/'
  ]);
}

// JavaScript processing - compress only in production
function processJS() {
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
    .pipe(gulpIf(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.js.dest));
}

// CSS processing - compress only in production
function processCSS() {
  return gulp.src(paths.css.src)
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(gulpIf(isProduction, cleanCSS({
      compatibility: 'ie8',
      level: 2
    })))
    .pipe(gulpIf(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.css.dest));
}

// HTML processing - compress only in production
function processHTML() {
    if (!isProduction) {
        console.log('Development mode: HTML processing skipped');
        return Promise.resolve();
    }

    console.log('Production mode: Minifying HTML...');
    return gulp.src(['_site/**/*.html', '!_site/assets/**', '!_site/debug/**'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('_site'));
}

// Watch task
function watch() {
  gulp.watch(paths.js.src, processJS);
  gulp.watch(paths.css.src, processCSS);
  gulp.watch(paths.html.src, processHTML);
}

// Build tasks
const buildDev = gulp.series(clean, gulp.parallel(processJS, processCSS), processHTML);
const buildProd = gulp.series(clean, gulp.parallel(processJS, processCSS), processHTML);

// Export tasks
exports.clean = clean;
exports.processJS = processJS;
exports.processCSS = processCSS;
exports.processHTML = processHTML;
exports.watch = watch;
exports['build:dev'] = buildDev;
exports['build:prod'] = buildProd;
exports.build = buildProd;
exports.default = buildProd;