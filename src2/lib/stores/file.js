'use strict';

var Immutable = require('immutable'),
    path = require('path'),
    fs = require('fs');

module.exports = function(filePath) {

    filePath = path.relative(process.cwd(), filePath);
    var fsInfo = path.parse(filePath);

    return Immutable.Map({
        name: fsInfo.base,
        path: filePath,
        absolutePath: path.join(process.cwd(), filePath),
        id: filePath,
        dir: fsInfo.dir,
        blockIds: Immutable.List(),
        ext: fsInfo.ext,
        content: fs.readFileSync(filePath, 'utf8')
    });
};
