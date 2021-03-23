"use strict";

const gulp = require("gulp");

const sass = require("gulp-sass");

function watch() {
  gulp.watch("./css/scss/**/*.scss", buildCSS);
}

function buildCSS() {
  return gulp
    .src("./css/scss/main.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./css"));
}

module.exports.watch = watch;
module.exports.buildCSS = buildCSS;
