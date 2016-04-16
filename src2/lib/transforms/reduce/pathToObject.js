'use strict';

var nodePath = require('path');

function assignPaths(result, seg, index, paths, source) {
    result[seg] = result[seg] || {};
    if ((index + 1) === paths.length) {
        result[seg] = source;
    } else {
        result[seg] = assignPaths(result[seg], paths[index + 1], index + 1, paths, source);
    }
    return result;
}

function pathToObject(sourcePath, result, path) {
    var segments = path.replace(sourcePath, '') // remove directory above current file
        .replace(/^\/|\/$/g, '') // remove leading& trailing slashes
        .replace('.js', '') // remove file extension
        .split(nodePath.sep);

    return assignPaths({}, segments[0], 0, segments, require(path));

}

module.exports = pathToObject;
