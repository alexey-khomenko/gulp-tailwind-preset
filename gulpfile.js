const {watch, series, parallel, src, dest} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const cssimport = require('postcss-import');
const cssnesting = require('postcss-nesting'); // postcss-nested
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const pug = require('gulp-pug');

const OUTPUT = './dest';
const CSS_ENTRY = './src/styles/styles.css';
const CSS_FILES = './src/styles/**/*.*css';
const HTML_ENTRY = './src/pug/routes/*.pug';
const HTML_FILES = './src/pug/**/*.pug';
const HTML_DIR = './src/pug/routes';
const TAILWIND_CONFIG = 'tailwind.config.js';

function stylesDev() {
    const processors = [cssimport, tailwindcss(TAILWIND_CONFIG), cssnesting];

    return src(CSS_ENTRY)
        .pipe(postcss(processors))
        .pipe(dest(OUTPUT))
        .pipe(browserSync.stream())
        ;
}

function stylesProd() {
    const processors = [cssimport, tailwindcss(TAILWIND_CONFIG), cssnesting, autoprefixer];

    return src(CSS_ENTRY)
        .pipe(postcss(processors))
        .pipe(dest(OUTPUT))
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

function clear() {
    return del(OUTPUT + '/*');
}

function watcher() {
    browserSync.init({
        server: OUTPUT
    });

    watch(CSS_FILES, stylesDev);
    watch(HTML_FILES, html);
}

const dev = series(clear, parallel(stylesDev, html));
const build = series(clear, parallel(stylesProd, html));

exports.default = build;
exports.dev = series(dev, watcher);