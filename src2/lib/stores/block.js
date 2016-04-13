'use strict';

var Immutable = require('immutable'),
    path = require('path');

module.exports = function(dirPath) {

    var fsInfo = path.parse(dirPath);
    // console.log(fsInfo);
    return Immutable.Map({
        name: fsInfo.base,
        id: dirPath,
        dir: fsInfo.dir,
        files: Immutable.List()
    });
};
