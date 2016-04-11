'use strict';

var Immutable = require('immutable'),
    path = require('path');

module.exports = function(filePath) {

    var fsInfo = path.parse(filePath);
    // console.log(filePath, fsInfo);

    return {
        name: fsInfo.base,
        resolvedName: filePath,
        dir: fsInfo.dir
    };
}
