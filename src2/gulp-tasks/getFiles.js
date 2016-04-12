'use strict';

var dir = require('node-dir');

var createFile = require('../lib/stores/file');

function createFileFromPath(filePath){
    try {
        return createFile(filePath);
    } catch(e){
        return null;
    }
}

module.exports = function(dirPath, fileDefinition, onComplete) {

    dir.paths(dirPath, true, function(err, paths) {
        if (err) return onComplete(err);

        var results = paths
            .filter(fileDefinition(paths))
            .map(createFileFromPath);

        return onComplete(null, results);
    });

};
