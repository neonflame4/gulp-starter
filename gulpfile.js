const { task, watch, src, dest, series } = require("gulp"),
    autoprefixer = require("autoprefixer")
    clean = require("gulp-clean"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps")
;

const SRC_PATH = './src',
      DEST_PATH = './dist';

const DIR_INPUT_SCSS = SRC_PATH + '/scss/**/*.scss';
      

const DIR_OUTPUT_CSS = DEST_PATH + '/css';


task('scss:clean', () => {
    return src(DEST_PATH + "/**/*.*", {read: false})
        .pipe(clean());
});
    
task('scss:compile', () => {
    return src(DIR_INPUT_SCSS)
        .pipe(sourcemaps.init())
        .pipe(sass({
                outputStyle: 'expanded',
                sourceMap: true
            })
            .on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest(DIR_OUTPUT_CSS));
});

task('scss', series('scss:clean', 'scss:compile'));







task('watch', (cb) => {
    series('scss');
    watch( DIR_INPUT_SCSS )
        .on('change', series('scss'))
        .on('ready', series('scss'));
});


task('build', series('scss'));