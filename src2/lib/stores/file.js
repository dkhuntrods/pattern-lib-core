'use strict';

var Immutable = require('immutable'),
    path = require('path');

module.exports = function(filePath) {

    var fsInfo = path.parse(filePath);
    console.log(fsInfo);

    return {
        name: fsInfo.base,
        dir: fsInfo.dir
    };
}
