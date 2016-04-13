'use strict';

var Immutable = require('immutable'),
    path = require('path');

module.exports = function(filePath) {

    var fsInfo = path.parse(filePath);
    // console.log(filePath, fsInfo);

    return Immutable.Map({
        name: fsInfo.base,
        id: filePath,
        dir: fsInfo.dir,
        blocks: Immutable.List()
    });
}
