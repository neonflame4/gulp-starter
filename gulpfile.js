const { task, watch, src, dest, series, parallel } = require("gulp"),
    autoprefixer = require("gulp-autoprefixer")
    clean = require("gulp-clean"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    minify = require("gulp-minify"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create()
;


let isBuild = false;
const
    SRC_PATH = './src',
    DIST_PATH = './dist',
    PUBLIC_PATH = './public'
;


const 
    DIR_INPUT_FONTS = SRC_PATH + '/assets/fonts/**/*.scss',
    DIR_INPUT_HTML =  [SRC_PATH + '/**/*.{htm,html,xhtml,php}', '!'+SRC_PATH+'/assets'],
    DIR_INPUT_HTML_A =  SRC_PATH + '/**/*.{htm,html,xhtml,php}',
    DIR_INPUT_IMAGES = SRC_PATH + '/assets/images/**/*',
    DIR_INPUT_JS = [SRC_PATH + '/assets/js/**/*', '!' + SRC_PATH + '/assets/js/vendor/**/*.js'],
    DIR_INPUT_VENDOR_JS = SRC_PATH + '/assets/js/vendor/**/*.js',
    DIR_INPUT_SCSS = SRC_PATH + '/assets/scss/**/*.scss'
;

const 
    DIR_OUTPUT_CSS = function(){ return getOutputPath() + '/assets/css'},
    DIR_OUTPUT_FONTS = function(){ return getOutputPath() + '/assets/fonts'},
    DIR_OUTPUT_IMAGES = function(){ return getOutputPath() + '/assets/images'},
    DIR_OUTPUT_JS = function(){ return getOutputPath() + '/assets/js'}
;

function getOutputPath() {
    return isBuild ? DIST_PATH : PUBLIC_PATH;
}


task('dest_clean', () => {
    return src(getOutputPath(), {read: false, allowEmpty: true})
        .pipe(clean());
});




/* ****************** SCSS TASKS ******************* */
task('scss:clean', () => {
    return src(DIR_OUTPUT_CSS(), {read: false, allowEmpty: true})
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
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(browserSync.stream())
        .pipe(dest(DIR_OUTPUT_CSS()));
});

task('scss:build', () => {
    return src(DIR_INPUT_SCSS)
        .pipe(sass({
                outputStyle: 'compressed',
                sourceMap: true
            })
            .on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['cover 99.5% in US']
        }))
        .pipe(concat('styles.css'))
        .pipe(dest(DIR_OUTPUT_CSS()));
});

task('scss', series('scss:clean', 'scss:compile'));




/* ****************** HTML TASKS ******************* */
task('html:copy', () => {
    return src(DIR_INPUT_HTML)
        .pipe(dest(getOutputPath()));
});

task('html:generate', () => {
    return src(DIR_INPUT_HTML_A)
        .pipe(panini({
            root: 'templates/pages/',
            layouts: 'templates/layouts/',
            partials: 'templates/partials/'
        }))
        .pipe(dest(getOutputPath()));
});




/* ****************** JAVASCRIPT TASKS ************* */
task('js:vendor', () => {
    return src(DIR_INPUT_VENDOR_JS)
        .pipe(dest(DIR_OUTPUT_JS()));
});

task('js:compile', () => {
    return src(DIR_INPUT_JS)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest(DIR_OUTPUT_JS()));
});

task('js:build', () => {
    return src(DIR_INPUT_JS)
        .pipe(concat('bundle.js'))
        .pipe(minify())
        .pipe(dest(DIR_OUTPUT_JS()));
});

task('js', () => {
    parallel('js:compile','js:vendor');
});




/* ****************** IMAGE TASKS ****************** */
task('images:copy', () => {
    return src(DIR_INPUT_IMAGES)
        .pipe(dest(DIR_OUTPUT_IMAGES()));
});




/* ****************** FONT TASKS ******************* */
task('fonts:copy', () => {
    return src(DIR_INPUT_FONTS)
        .pipe(dest(DIR_OUTPUT_FONTS()));
});




/* ****************** BUILD TASKS ****************** */
task('serve', (cb) => {
    browserSync.init({
        server: {
            baseDir: "./public/",
            injectChanges: true
        }
    });
    cb();
});

task('watch', (c1) => {
    series('dest_clean')();

    watch( DIR_INPUT_SCSS )
        .on('ready', series('scss:compile'))
        .on('change', series('scss:compile'));

    watch( DIR_INPUT_HTML )
        .on('ready', series('html:generate'))
        .on('change', series('html:generate', panini.refresh(), browserSync.reload));

    watch( DIR_INPUT_JS )
        .on('ready', series('js'))
        .on('change', series('js', browserSync.reload));

    watch( DIR_INPUT_IMAGES )
        .on('ready', series('images:copy'))
        .on('change', series('images:copy'));

    series('fonts:copy','serve')();
});

task('build', c1 => {
    isBuild = true;
    
    series('dest_clean', c2 => {
        parallel('html:copy','scss:build','js:build','images:copy','fonts:copy')();
        c2();
    })();
    
    c1();
});
