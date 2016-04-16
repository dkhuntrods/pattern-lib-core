'use strict';

var Immutable = require('immutable'),
    path = require('path'),
    fs = require('fs');

module.exports = function(filePath) {

    var fsInfo = path.parse(filePath);

    return Immutable.Map({
        name: fsInfo.base,
        path: filePath,
        id: filePath,
        dir: fsInfo.dir,
        blockIds: Immutable.List(),
        ext: fsInfo.ext,
        contents: fs.readFileSync(filePath, 'utf8')
    });
};
