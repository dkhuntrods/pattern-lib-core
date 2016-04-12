'use strict';

var path = require('path'),
    dir = require('node-dir'),
    async = require('async');

var createFile = require('../lib/stores/file');

function _fileDefinition(filePath, cb){
    return cb(true);
}

module.exports = function(dirPath, fileDefinition, onComplete) {
    fileDefinition = fileDefinition || _fileDefinition;
    dir.paths(dirPath, function(err, paths) {
        if (err) return onComplete(err);
        var filePaths = paths.files;

        async.filter(filePaths, fileDefinition, function(filePaths){
            async.map(filePaths, function(dirPath, cb){
                var file;
                try {
                    file = createFile(dirPath);
                } catch(e){
                    return cb(e);
                }
                cb(null, file);
            }, function(err, results){
                if (err) return onComplete(err);
                // console.log(results);
                onComplete(null, results);
            });
        });
    });

};
