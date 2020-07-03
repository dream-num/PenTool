const gulp = require('gulp')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const rollup = require('rollup')
const rollupTypescript = require('rollup-plugin-typescript')
const babel = require('rollup-plugin-babel')
const sourcemaps = require('gulp-sourcemaps')
const uglifyOptions = {
  compress: {
    drop_console: true
  }
}

function cleanDir() {
  return gulp.src("dist", { allowEmpty: true })
    .pipe(clean());
}
async function compile() {
  const bundle = await rollup.rollup({
    input: './src/penTool.ts',
    plugins: [
      rollupTypescript(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          ["latest", {
            "es2015": {
              "modules": false
            }
          }]
        ]
      })
    ]
  });
  return bundle.write({
    file: './dist/penTool.all.js',
    format: 'umd',
    name: 'Pen',
    sourcemap: true
  });
}

function minify() {
  return gulp.src('dist/*.js')
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify(uglifyOptions))
    .pipe(gulp.dest('dist/'))
}

exports.default = gulp.series(cleanDir, compile, minify)
