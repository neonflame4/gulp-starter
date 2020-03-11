const { task, watch, src, dest, series } = require("gulp"),
    autoprefixer = require("gulp-autoprefixer")
    clean = require("gulp-clean"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create()
;

const SRC_PATH = './src',
      DEST_PATH = './dist';

const DIR_INPUT_SCSS = SRC_PATH + '/assets/scss/**/*.scss';
const DIR_INPUT_HTML =  [SRC_PATH + '/**/*.html', '!'+SRC_PATH+'/assets'];
      

const DIR_OUTPUT_CSS = DEST_PATH + '/assets/css';



/* ****************** SCSS TASKS ******************* */
task('scss:clean', () => {
    return src(DIR_OUTPUT_CSS, {read: false, allowEmpty: true})
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
        .pipe(autoprefixer({
            overrideBrowserslist: ['cover 99.5% in US']
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest(DIR_OUTPUT_CSS));
});

task('scss', series('scss:clean', 'scss:compile'));




/* ****************** HTML TASKS ******************* */
task('html:clean', () => {
    return src(DIR_INPUT_HTML, {read: false, allowEmpty: true})
        .pipe(clean());
});

task('html:copy', () => {
    return src(DIR_INPUT_HTML)
        .pipe(dest(DEST_PATH));
});




/* ****************** BUILD TASKS ****************** */
task('serve', (cb) => {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    cb();
});

task('watch', (cb) => {
    watch( DIR_INPUT_SCSS )
        .on('ready', series('scss'))
        .on('change', series('scss', browserSync.reload));

    watch( DIR_INPUT_HTML )
        .on('ready', series('html:clean','html:copy'))
        .on('change', series('html:copy', browserSync.reload));

    series('serve')();
});

task('build', series('html:copy','scss'));