// import autoprefixer from "gulp-autoprefixer";

const { src, dest, watch, parallel, series } = require("gulp");

const buildFolder = "build",
    sourceFolder = "src";

const scss = require("gulp-sass")(require("sass")),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify-es").default,
    del = require("del"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer');

const clean = require("gulp-clean");
const fs = require("fs");

const paths = {
    styles: {
        src: "./app/scss/style.scss",
        dest: "./app/css",
        // src: "src/styles/**/*.less",
        // dest: "assets/styles/",
    },
    scripts: {
        src: ["./app/js/main.js"],
        dest: "./app/js",
        // src: "src/scripts/**/*.js",
        // dest: "assets/scripts/",
    },
};

// Если нужно подключить внешний модуль
// 'node_modules/swiper/swiper-bundle.js',
//Если нужно все файлы, но без .min.js,
//чтобы не было безконечного цикла
// 'app/js/*.js',
// '!app/js/main.min.js'
const path = {
    source: {
        html: sourceFolder + "/html/*.html",
        scss: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/main.js",
        img: sourceFolder + "/img/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/**/*.ttf",
    },
    build: {
        html: buildFolder + "/html/",
        styles: buildFolder + "/css/",
        js: buildFolder + "/js/",
        img: buildFolder + "/img/",
        fonts: buildFolder + "/fonts/",
    },
    whatch: {
        html: sourceFolder + "/html/*.html",
        styles: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.img",
        fonts: sourceFolder + "/fonts/**/*.ttf",
    },
};

function browser_sync() {
    browserSync.init({
        server: { baseDir: ["build/html", "html"] },
        files: "*.html",
        online: true,
    });
}

function html() {
    return src(path.source.html)
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
}


function styles() {
    return src(path.source.scss)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(
            scss({
                errLogToConsole: true,
            })
        )
        .on("error", console.error.bind(console))
        // .pipe(autoprefixer())
        .pipe(autoprefixer({ overrideBrowserlist: ['last 10 version'] }))
        .pipe(concat("style.min.css"))
        .pipe(scss({ style: "compressed" }).on("error", scss.logError))
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.styles))
        .pipe(browserSync.stream());
}

function scripts() {
    return (
        src(path.source.js, { sourcemaps: true })
            // .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat("main.min.js"))
            .pipe(sourcemaps.write()) // Inline source maps.
            // For external source map file:
            //.pipe(sourcemaps.write("./maps")) // In this case: lib/maps/bundle.min.js.map
            .pipe(dest(path.build.js))
            .pipe(browserSync.stream())
    );
}

function images() {
    return (
        src(path.source.img)
            // .pipe(newer(path.build.img))
            // .pipe(imagemin([imagemin.jpegtran({ progressive: true })]))
            .pipe(
                imagemin(
                    // imagemin.gifsicle({ interlaced: true }),
                    // imagemin.jpegtran({ progressive: true }),
                    // imagemin.optipng({ optimizationLevel: 7 })
                    {
                        verbose: true ,
                        progressive: true,
                        optimizationLevel: 5,
                    //         quality: 85
                    }
                )
            )
            .pipe(dest(path.build.img))
    );
    // done();
}

// function browsersync() {
//     browserSync.init({
//         server: {
//             baseDir: ["./app/html", "app"],
//         },
//         files: "*.html",
//         // port: 8000
//     });
// }

function watching() {
    watch(paths.styles.src, styles);
    watch(paths.scripts.src, scripts);
    watch(["app/html/**/*.html"]).on("change", browserSync.reload);
    // watch(["./app/scss/style.scss"], styles);
    // watch(["./app/js/main.js"], scripts);
}

// Удаление build
function cleanbuild() {
    return del(buildFolder, { force: true });
    // if (fs.existsSync(buildFolder)) {
    //     return src(buildFolder, { read: false })
    //         .pipe(clean({ force: true }));
    // }
    // done();
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
// var build = gulp.series(clean, gulp.parallel(styles, scripts));
// var build = series(parallel(styles, scripts), browsersync);

exports.browser_sync = browser_sync;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watching = watching;
exports.cleanbuild = cleanbuild;
// exports.browsersync = browsersync;

// exports.default = series(build, watching);
// exports.default = parallel(styles, scripts, browsersync, watching);
