'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var fs = require('fs');
var path = require('path');

gulp.task('sass', function () {
    gulp.src('./src/scss/index.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/scss/*.scss', ['sass']);
});

gulp.task('build', function(){
    var root = './src/components/';
    var res = {};
    getFolders(root).forEach(function(folderName){
        res[folderName] = {
            items: []
        };

        getFiles(path.join(root, folderName)).forEach(function(file){
           res[folderName].items.push({
              markup: fs.readFileSync(path.join(root, folderName, file)).toString()
           });
        });
    });

    gulp.src('./index.jade')
        .pipe(jade({
            locals: {
                data: res,
                escapeHTML: function(string){
                    var entityMap = {
                        "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': '&quot;',
                            "'": '&#39;',
                            "/": '&#x2F;'
                    };
                    return String(string).replace(/[&<>"'\/]/g, function (s) {
                        return entityMap[s];
                    });
                }
            }
        }))
        .pipe(gulp.dest('./'));
});

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function getFiles(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isFile();
        });
}