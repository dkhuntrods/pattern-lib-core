'use strict';

var reducePathsToObject = require('../../transforms/reduce/pathToObject'),
    nodePath = require('path'),
    dir = require('node-dir'),
    Immutable = require('immutable');

module.exports = function(onComplete) {

    var sourcePath = nodePath.join(__dirname, 'sources');

    dir.paths(sourcePath, function(err, paths) {
        if (err) return onComplete(err);
        var results = paths.files.reduce(reducePathsToObject.bind(null, sourcePath), {});

        return onComplete(null, Immutable.fromJS(results));
    });
};
