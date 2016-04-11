'use strict';

var Immutable = require('immutable'),
    path = require('path');

module.exports = function(dirPath) {

    var fsInfo = path.parse(dirPath);
    // console.log(fsInfo);

    return {
        name: fsInfo.base,
        resolvedName: dirPath,
        dir: fsInfo.dir
    };
};
