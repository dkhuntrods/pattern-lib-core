'use strict';

var dir = require('node-dir');

var createBlock = require('../lib/stores/block');

function createBlockFromPath(dirPath){
    try {
        return createBlock(dirPath);
    } catch(e){
        return null;
    }
}

module.exports = function(dirPath, blockDefinition, onComplete) {

    dir.paths(dirPath, true, function(err, paths) {
        if (err) return onComplete(err);

        var results = paths
            .filter(blockDefinition(paths))
            .map(createBlockFromPath);

        return onComplete(null, results);
    });
}
