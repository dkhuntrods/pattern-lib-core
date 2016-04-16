'use strict';

var pathToObject = require('../../transforms/reduce/pathToObject'),
    nodePath = require('path'),
    dir = require('node-dir'),
    Immutable = require('immutable');

module.exports = function(onComplete) {

    var sourcePath = nodePath.join(__dirname, 'src');

    dir.paths(sourcePath, function(err, paths) {
        if (err) return onComplete(err);
        var results = paths.files.reduce(pathToObject.bind(null, sourcePath), {});

        return onComplete(null, Immutable.fromJS(results));
    });
};
