const gulp = require('gulp')
const uglify = require('gulp-uglify-es').default
const clean = require('gulp-clean')
const rollup = require('rollup').rollup
const terser = require('rollup-plugin-terser').terser
const rollupTypescript = require('rollup-plugin-typescript')
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
  const bundle = await rollup({
    input: './src/penTool.ts',
    plugins: [
      rollupTypescript(),
      terser()       // 是否压缩
    ],
  });
  bundle.write({
    file: 'index.esm.js',
    format: 'esm',
    name: 'PenTool',
    sourcemap: false
  })
  bundle.write({
    file: 'index.umd.js',
    format: 'umd',
    name: 'PenTool',
    sourcemap: false
  })
}

exports.default = gulp.series(cleanDir, compile)
