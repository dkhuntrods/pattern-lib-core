'use strict';

var dir = require('node-dir');

module.exports = function(dirPath, filterMethod, mapMethod, onComplete) {

    dir.paths(dirPath, true, function(err, paths) {
        if (err) return onComplete(err);

        var _filter = filterMethod.bind(undefined, paths);

        var results = paths
            .filter(_filter)
            .map(mapMethod);

        return onComplete(null, results);
    });
}
