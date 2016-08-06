'use strict';

var reducePathsToObject = require('./reduce/pathToObject'),
    Immutable = require('immutable');

module.exports = function(onComplete, sourcePath, err, paths) {
    if (err) return onComplete(err);
    var results = paths.files
        .filter(function(filePath) {
            return ((
                /.tern-port/.test(filePath) ||
                /index.js/.test(filePath)
                ) === false);
        })
        .reduce(reducePathsToObject.bind(null, sourcePath), {});

    return onComplete(null, Immutable.fromJS(results));
}
