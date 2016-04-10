'use strict';

var path = require('path'),
    dir = require('node-dir'),
    async = require('async');

    var createFile = require('../lib/stores/file');

module.exports = function(dirPath) {
    return function(onComplete) {
        dir.paths(dirPath, function(err, paths) {
            if (err) return onComplete(err);
            var filePaths = paths.files;

            // console.log(filePaths);
            filePaths = filePaths.map(function(filePath) {
                return createFile(filePath);
            });
            console.log(filePaths);

            onComplete();
        });

    };
}
