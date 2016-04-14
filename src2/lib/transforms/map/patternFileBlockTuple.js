'use strict';

var path = require('path');


module.exports = function getFileBlock(blocks, file) {
    var filePath = file.get('id'),
        testPath,
        dir = filePath.split(path.sep);

    dir.pop();

    while (dir.length) {
        testPath = dir.join(path.sep);
        var block = blocks.get(testPath);
        if (block) return [filePath, block];
        dir.pop();
    }

    return [filePath, null];

};
