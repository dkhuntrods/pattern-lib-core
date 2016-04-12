'use strict';

var dir = require('node-dir'),
    async = require('async');

var createBlock = require('../lib/stores/block');


module.exports = function(dirPath, blockDefinition, onComplete) {

    dir.paths(dirPath, function(err, paths) {
        if (err) return onComplete(err);
        var filePaths = paths.files;
        var dirPaths = paths.dirs;

        async.filter(dirPaths, blockDefinition, function(_dirPaths){
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
