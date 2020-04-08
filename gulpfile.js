const { src, dest, lastRun, series, parallel, watch } = require('gulp');
const server = require('browser-sync').create();
var babel = require("gulp-babel");
var concat = require("gulp-concat");


const del = require('del');

const base_files_dest = 'dist';

const html_files_src = [
  'src/html/**/*.html'
];

const js_files_src = [
  'src/js/constant/actionTypes.js',
  'src/js/constant/config.js',
  'src/js/constant/elements.js',
  'src/js/constant/translation.js',
  'src/js/constant/urls.js',

  'src/js/helper/customEvents-99.1.0.min.js',
  'src/js/helper/dispatcher.js',
  'src/js/helper/cookies.js',
  'src/js/helper/utils.js',

  'src/js/shopping.js',

  'src/js/frontend.js'
];
const js_files_dest = 'dist/frontend/js';

function clean(done) {
  return del([
    'dist'
  ]);
  done();
}

function html(done) {
  return src(html_files_src, { since: lastRun(html) })
    .pipe(dest(base_files_dest))
  done();
}


function js(done) {
  return src(js_files_src)
  .pipe(concat('index.js'))
    .pipe(dest(js_files_dest))
  done();
}


function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: base_files_dest
    }
  });
  done();
}

function watchFiles(done) {
  watch(html_files_src, series(html, reload));
  watch(js_files_src, series(js, reload));
}

exports.default = series(clean, parallel(html, js), serve, watchFiles);
