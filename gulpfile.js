const gulp = require('gulp');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const yargs = require('yargs');
const concat = require('gulp-concat');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

// critical은 ESM 모듈이므로 동적 import 사용
let critical;
async function loadCritical() {
  if (!critical) {
    const criticalModule = await import('critical');
    critical = criticalModule.default || criticalModule;
  }
  return critical;
}

// 환경 설정
const isProduction = yargs.argv.production || process.env.NODE_ENV === 'production';

// 경로 설정
const paths = {
  js: {
    src: [
      'assets/js/**/*.js',
      '!assets/js/**/*.min.js',
      '!assets/js/*-entry.js'
    ],
    minified: [
      'assets/js/**/*.min.js'
    ],
    dest: '_site/assets/js/'
  },
  css: {
    src: [
      'assets/css/**/*.css'
    ],
    dest: '_site/assets/css/'
  },
  html: {
    src: '_site/**/*.html',
    dest: '_site/'
  },
  prism: {
    // Prism.js 번들링 순서 (의존성 순서 중요!)
    src: [
      'assets/js/prism/prism.min.js',
      'assets/js/prism/prism-autoloader.min.js',
      'assets/js/prism/prism-toolbar.min.js',
      'assets/js/prism/prism-copy-to-clipboard.min.js',
      'assets/js/prism/prism-show-language.min.js',
      'assets/js/prism/prism-line-numbers.min.js'
    ],
    // 원본 폴더에 번들 생성 (Jekyll이 _site로 복사)
    dest: 'assets/js/prism/'
  }
};

// Clean task - preserve Jekyll-generated files
function clean() {
  return del([
    '_site/assets/js/**/*.js',
    '!_site/assets/js/search-data.json', // Preserve Jekyll-generated search data
    '_site/assets/css/**/*.css'
  ]);
}

// 템플릿 리터럴 내 불필요한 공백 축소 (HTML/CSS 문자열)
// Terser가 템플릿 리터럴의 줄바꿈을 이스케이프된 \n으로 변환하므로
// 이스케이프된 \n + 주변 공백을 축소하고, CSS 속성 간 불필요 공백도 제거
function collapseTemplateWhitespace() {
  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isNull()) return cb(null, file);
      if (file.isStream()) return cb(new Error('Streams not supported'));

      let content = file.contents.toString();

      // 1) 이스케이프된 줄바꿈(\n) + 주변 공백을 단일 공백으로 축소
      content = content.replace(/\\n\s*/g, ' ');

      // 2) 연속 공백을 단일 공백으로 축소
      content = content.replace(/ {2,}/g, ' ');

      // 3) CSS 셀렉터/속성 주변 불필요 공백 제거
      content = content.replace(/\s*{\s*/g, '{');
      content = content.replace(/\s*}\s*/g, '}');
      content = content.replace(/\s*;\s*/g, ';');
      content = content.replace(/\s*:\s*/g, ':');
      content = content.replace(/\s*,\s*/g, ',');

      // 4) 삼항/조건 연산자의 콜론은 복원 (a?b:c 패턴)
      //    CSS 콜론과 구분: CSS는 property:value 형태, JS는 ?...: 형태
      //    위에서 공백 제거한 것 중 JS 연산자 주변은 terser가 이미 처리했으므로 안전

      file.contents = Buffer.from(content);
      cb(null, file);
    }
  });
}

// JavaScript processing - compress only in production
function processJS() {
  return gulp.src(paths.js.src)
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(gulpIf(isProduction, terser({
      ecma: 2015,
      compress: {
        drop_console: true, // 콘솔 로그 제거 (프로덕션)
        drop_debugger: true,
        unused: true,
        dead_code: true,
        passes: 2
      },
      mangle: true,
      format: {
        comments: false // 주석 제거
      }
    })))
    .pipe(gulpIf(isProduction, collapseTemplateWhitespace()))
    .pipe(gulpIf(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.js.dest));
}

// 이미 minified된 JS 파일 복사 (재처리 없이)
function copyMinifiedJS() {
  return gulp.src(paths.js.minified)
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

// Prism.js 번들링 태스크 - 6개 파일을 하나로 합침
function bundlePrism() {
  console.log('Bundling Prism.js files...');
  return gulp.src(paths.prism.src)
    .pipe(concat('prism.bundle.min.js'))
    .pipe(gulp.dest(paths.prism.dest));
}

// Critical CSS 추출 태스크 - above-the-fold CSS 추출
// common.css + page-specific CSS를 기반으로 각 페이지별 critical CSS 추출
async function extractCritical(done) {
  if (!isProduction) {
    console.log('Development mode: Critical CSS extraction skipped');
    return done();
  }

  console.log('Extracting critical CSS...');
  
  const criticalModule = await loadCritical();
  
  // 각 페이지별 CSS 매핑
  const pages = [
    { path: '_site/index.html', css: ['assets/css/common.css', 'assets/css/home.css'] },
    { path: '_site/blog.html', css: ['assets/css/common.css', 'assets/css/home.css'] }
  ];
  
  const allCriticalCSS = [];
  
  for (const page of pages) {
    if (!fs.existsSync(page.path)) {
      console.log(`Skipping ${page.path} - file not found`);
      continue;
    }
    
    try {
      const { css } = await criticalModule.generate({
        base: '_site/',
        src: page.path.replace('_site/', ''),
        css: page.css,
        width: 1300,
        height: 900,
        extract: false,
        ignore: {
          atrule: ['@font-face'],
          decl: (node, value) => /url\(/.test(value)
        }
      });
      
      if (css) {
        allCriticalCSS.push(css);
      }
    } catch (err) {
      console.error(`Critical CSS error for ${page.path}:`, err.message);
    }
  }
  
  // 중복 제거하고 합치기
  const uniqueCSS = [...new Set(allCriticalCSS.join('\n').split('\n'))].join('\n');
  
  const includesDir = '_includes';
  if (!fs.existsSync(includesDir)) {
    fs.mkdirSync(includesDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(includesDir, 'critical.css'), uniqueCSS);
  console.log('Critical CSS written to _includes/critical.css');
  done();
}

// Build tasks
const buildDev = gulp.series(clean, gulp.parallel(processJS, copyMinifiedJS, processCSS), bundlePrism, processHTML);
const buildProd = gulp.series(clean, gulp.parallel(processJS, copyMinifiedJS, processCSS), bundlePrism, processHTML, extractCritical);

// Export tasks
exports.clean = clean;
exports.processJS = processJS;
exports.copyMinifiedJS = copyMinifiedJS;
exports.processCSS = processCSS;
exports.processHTML = processHTML;
exports.bundlePrism = bundlePrism;
exports.extractCritical = extractCritical;
exports.watch = watch;
exports['build:dev'] = buildDev;
exports['build:prod'] = buildProd;
exports.build = buildProd;
exports.default = buildProd;