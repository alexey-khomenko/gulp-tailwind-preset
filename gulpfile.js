const {watch, series, parallel, src, dest} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const cssimport = require('postcss-import');
const cssnesting = require('postcss-nesting'); // postcss-nested
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const cssnano = require('cssnano');
const pug = require('gulp-pug');

const OUTPUT = './dest';
const JS_ENTRY = './src/scripts/*';
const JS_FILES = './src/scripts/**/*.js';
const JS_OUTPUT = OUTPUT + '/js';
const CSS_ENTRY = './src/styles/styles.css';
const CSS_FILES = './src/styles/**/*.*css';
const CSS_OUTPUT = OUTPUT + '/css';
const HTML_ENTRY = './src/pug/routes/*.pug';
const HTML_FILES = './src/pug/**/*.pug';
const HTML_DIR = './src/pug/routes';
const ICONS_ENTRY = './src/favicons/*';
const ICONS_FILES = './src/favicons/**/*.*';
const ICONS_OUTPUT = OUTPUT + '/favicons';
const TAILWIND_CONFIG = 'tailwind.config.js';

function stylesDev() {
    const processors = [cssimport, tailwindcss(TAILWIND_CONFIG), cssnesting];

    return src(CSS_ENTRY)
        .pipe(postcss(processors))
        .pipe(dest(CSS_OUTPUT))
        .pipe(browserSync.stream())
        ;
}

function stylesProd() {
    const processors = [cssimport, tailwindcss(TAILWIND_CONFIG), cssnesting, autoprefixer, cssnano];

    return src(CSS_ENTRY)
        .pipe(postcss(processors))
        .pipe(dest(CSS_OUTPUT))
        ;
}

function html() {
    return src(HTML_ENTRY)
        .pipe(pug({
            basedir: HTML_DIR,
            pretty: true
        }))
        .pipe(dest(OUTPUT))
        .pipe(browserSync.stream())
        ;
}

function icons() {
    return src(ICONS_ENTRY)
        .pipe(dest(ICONS_OUTPUT))
        .pipe(browserSync.stream())
        ;
}

function scripts() {
    return src(JS_ENTRY)
        .pipe(dest(JS_OUTPUT))
        .pipe(browserSync.stream())
        ;
}

function clear() {
    return del(OUTPUT + '/*');
}

function watcher() {
    browserSync.init({
        server: OUTPUT
    });

    watch(CSS_FILES, stylesDev);
    watch(HTML_FILES, html);
    watch(ICONS_FILES, icons);
    watch(JS_FILES, scripts);
}

const dev = series(clear, parallel(stylesDev, html, scripts));
const build = series(clear, parallel(stylesProd, html, scripts));

exports.default = build;
exports.dev = series(dev, watcher);