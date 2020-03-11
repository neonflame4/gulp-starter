const { task, watch, src, dest, series } = require("gulp"),
    autoprefixer = require("gulp-autoprefixer")
    clean = require("gulp-clean"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create()
;

const
    SRC_PATH = './src',
    DEST_PATH = './dist'
;


const 
    DIR_INPUT_FONTS = SRC_PATH + '/assets/fonts/**/*.scss',
    DIR_INPUT_HTML =  [SRC_PATH + '/**/*.html', '!'+SRC_PATH+'/assets'],
    DIR_INPUT_IMAGES = SRC_PATH + '/assets/images/**/*',
    DIR_INPUT_JS = SRC_PATH + '/assets/js/**/*',
    DIR_INPUT_SCSS = SRC_PATH + '/assets/scss/**/*.scss'
;

const 
    DIR_OUTPUT_CSS = DEST_PATH + '/assets/css',
    DIR_OUTPUT_FONTS = DEST_PATH + '/assets/fonts',
    DIR_OUTPUT_IMAGES = DEST_PATH + '/assets/images',
    DIR_OUTPUT_JS = DEST_PATH + '/assets/js'
;




task('dest_clean', () => {
    return src(DEST_PATH, {read: false, allowEmpty: true})
        .pipe(clean());
});




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
task('html:copy', () => {
    return src(DIR_INPUT_HTML)
        .pipe(dest(DEST_PATH));
});




/* ****************** JAVASCRIPT TASKS ************* */
task('js:copy', () => {
    return src(DIR_INPUT_JS)
        .pipe(dest(DIR_OUTPUT_JS));
});




/* ****************** IMAGE TASKS ****************** */
task('images:copy', () => {
    return src(DIR_INPUT_IMAGES)
        .pipe(dest(DIR_OUTPUT_IMAGES));
});




/* ****************** FONT TASKS ******************* */
task('fonts:copy', () => {
    return src(DIR_INPUT_FONTS)
        .pipe(dest(DIR_OUTPUT_FONTS));
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
    series('dest_clean')();

    watch( DIR_INPUT_SCSS )
        .on('ready', series('scss'))
        .on('change', series('scss', browserSync.reload));

    watch( DIR_INPUT_HTML )
        .on('ready', series('html:copy'))
        .on('change', series('html:copy', browserSync.reload));

    watch( DIR_INPUT_JS )
        .on('ready', series('js:copy'))
        .on('change', series('js:copy', browserSync.reload));

    watch( DIR_INPUT_IMAGES )
        .on('ready', series('images:copy'))
        .on('change', series('images:copy'));

    series('fonts:copy','serve')();
});

task('build', series('dest_clean','html:copy','scss','js:copy','images:copy','fonts:copy'));
