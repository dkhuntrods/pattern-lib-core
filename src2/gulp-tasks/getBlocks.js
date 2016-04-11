'use strict';

var path = require('path'),
    _ = require('lodash'),
    dir = require('node-dir'),
    async = require('async');

var createBlock = require('../lib/stores/block');

function checkFilenameHidden(testPath) {
    var dirTest = '_';
    return _.some(testPath.split(path.sep), function(part) {
        return part.charAt(0) === dirTest;
    });
}

function checkForMdFiles(testPath) {
    var fsInfo = path.parse(testPath);
    // console.log(fsInfo);
    if (fsInfo.ext === '.md') return true;
    return false;
}

function checkIsBlock(dirPath, cb) {
    var hasFiles, hasSubDirs, directAncestorFiles = [],
        isBlock = false;

    dir.paths(dirPath, function(err, paths) {
        if (err) return cb(false);
        hasFiles = paths.files.length > 0;
        hasSubDirs = paths.dirs.length > 0;

        if (hasFiles) {
            if (!hasSubDirs) {
                directAncestorFiles = paths.files;
            } else {
                directAncestorFiles = _.reduce(paths.files, function(result, file, key) {
                    var test = file.replace(dirPath + path.sep, '').split(path.sep);
                    if (test.length === 1) result.push(file);
                    return result;
                }, []);
            }
        }

        directAncestorFiles = _.chain(directAncestorFiles)
            .reject(checkFilenameHidden)
            .filter(checkForMdFiles)
            .value();

        isBlock = directAncestorFiles.length > 0;
        cb(isBlock);
    });
}

module.exports = function(dirPath, onComplete) {

    dir.paths(dirPath, function(err, paths) {
        if (err) return onComplete(err);
        var filePaths = paths.files;
        var dirPaths = paths.dirs;

        async.filter(dirPaths, checkIsBlock, function(_dirPaths){
            async.map(_dirPaths, function(dirPath, cb){
                var block;
                try {
                    block = createBlock(dirPath);
                } catch(e){
                    return cb(e);
                }
                cb(null, block);
            }, function(err, results){
                if (err) return onComplete(err);
                // console.log(results);
                onComplete(null, results);
            });
        });

    });

}
