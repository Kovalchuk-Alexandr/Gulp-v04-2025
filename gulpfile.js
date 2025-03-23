// import autoprefixer from "gulp-autoprefixer";

const { src, dest, watch, parallel, series } = require("gulp");

const buildFolder = "./docs",
    sourceFolder = "./src";

const scss = require("gulp-sass")(require("sass")),
    fileInclude = require("gulp-file-include"),
    scssGlob = require("gulp-sass-glob"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify-es").default,
    webpack = require("webpack-stream"),
    del = require("del"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    autoprefixer = require("gulp-autoprefixer"),
    imagemin = require("gulp-imagemin"),
    imageminWebp = require("imagemin-webp"),
    newer = require("gulp-newer"),
    rename = require("gulp-rename"),
    fonter = require("gulp-fonter-fix"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2");


const clean = require("gulp-clean");
const fs = require("fs");

// Если нужно подключить внешний модуль
// 'node_modules/swiper/swiper-bundle.js',
//Если нужно все файлы, но без .min.js,
//чтобы не было безконечного цикла
// 'app/js/*.js',
// '!app/js/main.min.js'
const path = {
    source: {
        html: sourceFolder + "/html/*.html",
        scss: sourceFolder + "/scss/main.scss",
        js: sourceFolder + "/js/*.js",
        img: [
            sourceFolder + "/img/**/*.{svg,gif,ico,webp}",
            "!" + sourceFolder + "/img/**/*.{jpg,png}",
            // sourceFolder + "/img/favicons/*.{jpg,png,svg,gif,ico,webp}",
        ],
        imgFavicons: sourceFolder + "/img/favicons/*.{jpg,png,svg,gif,ico,webp}",
        imgWebp: [
            sourceFolder + "/img/**/*.{jpg,png}",
            "!" + sourceFolder + "/img/favicons/*"
        ],
        fonts: sourceFolder + "/fonts/**/",
    },
    build: {
        html: buildFolder ,
        styles: buildFolder + "/css/",
        js: buildFolder + "/js/",
        img: buildFolder + "/img/",
        fonts: buildFolder + "/fonts/",
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        styles: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/**/*",
    },
};

const cb = () => {};

function browser_sync(done) {
    browserSync.init({
        server: { baseDir: [buildFolder] },
        // server: { baseDir: ["build/html", "build", buildFolder] },
        files: "*.html",
        online: true,
        port: 3000,
    });
    done();
}

const fileIncludeSetting = {
    prefix: "@@",
    basepath: "@file",
};

/* ***************  HTML  ************************* */
function html() {
    return src(path.source.html)
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
}

/* ***************  Styles  ************************ */
function styles() {
    return (
        src(path.source.scss)
            // .pipe(sass({ silenceDeprecations: ["legacy-js-api"] }))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(scssGlob())
            .pipe(
                scss({
                    errLogToConsole: true,
                })
            )
            .on("error", console.error.bind(console))
            // .pipe(autoprefixer())
            .pipe(autoprefixer({ overrideBrowserlist: ["last 10 version"] }))
            .pipe(concat("style.min.css"))
            .pipe(scss({ style: "compressed" }).on("error", scss.logError))
            // .pipe(scss({ outputStyle: "compressed" })) // до 6 версии
            .pipe(sourcemaps.write())
            .pipe(dest(path.build.styles))
            .pipe(browserSync.stream())
    );
}

/* ***************  Scripts  ************************ */
function scripts() {
    return (
        src([
            path.source.js,
            // './src/lib/scrollreveal.js'
        ],
            { sourcemaps: true })
            // .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat("main.min.js"))
            .pipe(sourcemaps.write()) // Inline source maps.
            // For external source map file:
            //.pipe(sourcemaps.write("./maps")) // In this case: lib/maps/bundle.min.js.map
            .pipe(webpack(require("./webpack.config.js")))
            .pipe(dest(path.build.js))
            .pipe(browserSync.stream())
    );
}

/* ***************  Imagess  ************************ */
function images(done) {
    src(path.source.imgFavicons, { encoding: false })
        .pipe(newer(path.build.img))
        .pipe(
            imagemin({
                verbose: true,
                progressive: true,
                optimizationLevel: 5,
                quality: 85,
            })
        )
        .pipe(dest(path.build.img + "/favicons/"))
        .pipe(src(path.source.imgWebp, { encoding: false }))
        .pipe(newer(path.build.img))
        // .pipe(imagemin([imagemin.jpegtran({ progressive: true })]))
        .pipe(
            imagemin([
                imageminWebp({
                    quality: 85,
                }),
            ])
        )
        .pipe(rename({ extname: ".webp" }))
        .pipe(dest(path.build.img))
        .pipe(src(path.source.img, { encoding: false }))
        .pipe(
            imagemin(
                {
                    verbose: true,
                    progressive: true,
                    optimizationLevel: 5,
                    quality: 85,
                }
            )
        )
        .pipe(dest(path.build.img))
    done();
}

/* ***************  Fonts  ************************ */
const copyWoff = () => {
    return src(path.source.fonts + "*.{woff,woff2}")
        .pipe(dest(path.build.fonts))
};

const otf2ttf = () => {
    return src(sourceFolder + "/fonts/**/*.otf", { encoding: false })
        .pipe(
            fonter({
                formats: ["ttf"],
            })
        )
        .pipe(dest(sourceFolder + "/fonts/"));
};

const ttfToWoff = () => {
    src(path.source.fonts + "*.ttf", {
      encoding: false, // Important!
      removeBOM: false
    })
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
        .pipe(dest(sourceFolder + "/fonts/"));
    return src(path.source.fonts + "*.ttf", { encoding: false })
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
        .pipe(dest(sourceFolder + "/fonts/"));
};

const fontsStyle = (done) => {
    // Файл стилей подключения шрифтов
    let fontsFile = `${sourceFolder}/scss/base/_fontsAutoGen.scss`;
    // Проверяем существуют ли файлы шрифтов
    fs.readdir(`${buildFolder}/fonts/`, function(err, fontsFiles) {
        if (fontsFiles) {
            // Проверяем существует ли файл стилей для подключения шрифтов
            // Если файла нет, создаем его
            fs.writeFile(fontsFile, "", cb);
            let newFileOnly;
            for (var i = 0; i < fontsFiles.length; i++) {
                // Записываем подключения шрифтов в файл стилей
                let fontFileName = fontsFiles[i].split(".")[0];
                if (newFileOnly !== fontFileName) {
                    let fontName = fontFileName.split("-")[0]
                        ? fontFileName.split("-")[0]
                        : fontFileName;
                    let fontStyle =
                        fontFileName
                            .toLowerCase()
                            .search("italic") != -1
                            ? "italic"
                            : "normal";
                    let fontWeight = fontFileName.split("-")[1]
                        ? fontFileName.split("-")[1]
                        : fontFileName;
                    if (fontWeight.toLowerCase() === "thin") {
                        fontWeight = 100;
                    } else if (fontWeight.toLowerCase() === "extralight") {
                        fontWeight = 200;
                    } else if (fontWeight.toLowerCase() === "light") {
                        fontWeight = 300;
                    } else if (fontWeight.toLowerCase() === "medium") {
                        fontWeight = 500;
                    } else if (fontWeight.toLowerCase() === "semibold") {
                        fontWeight = 600;
                    } else if (fontWeight.toLowerCase() === "bold") {
                        fontWeight = 700;
                    } else if (fontWeight.toLowerCase() === "extrabold" ||
                        fontWeight.toLowerCase() === "heavy") {
                        fontWeight = 800;
                    } else if (fontWeight.toLowerCase() === "black") {
                        fontWeight = 900;
                    } else {
                        fontWeight = 400;
                    }
                    fs.appendFile(
                        fontsFile,
                        `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`,
                        cb
                    );
                    newFileOnly = fontFileName;
                }
            }
        }
    });
    done();
    // return gulp.src(sourceFolder);
    // function cb() {}
};



const fonts = series(otf2ttf, ttfToWoff, copyWoff, fontsStyle);


function watching() {
    // watch(path.watch.html, html)
    watch(path.watch.fonts, series(otf2ttf, ttfToWoff, copyWoff, fontsStyle));
    watch(path.watch.styles, styles)
    watch(path.watch.js, scripts)
    watch(path.watch.html, html).on("change", browserSync.reload);
    watch(path.watch.img, images);
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

const build = series(cleanbuild, parallel(styles, scripts, images), html, otf2ttf, ttfToWoff, copyWoff, fontsStyle);
// const watch = gulp.series(build, watching, browser_sync);

/* Exports Tasks */
exports.browser_sync = browser_sync;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.watching = watching;
exports.cleanbuild = cleanbuild;
exports.fonts = fonts;
exports.otf2ttf = otf2ttf;
exports.ttfToWoff = ttfToWoff;
exports.fontsStyle = fontsStyle;
exports.default = series(build, parallel(browser_sync, watching)) ;

// exports.default = parallel(styles, scripts, browsersync, watching);
