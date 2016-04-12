'use strict';

var path = require('path'),
    Immutable = require('immutable');


function getFileBlock(blocks) {
    return function(file) {
        var filePath = file.get('resolvedName'),
            testPath,
            dir = filePath.split(path.sep);

        dir.pop();

        while (dir.length) {
            testPath = dir.join(path.sep);
            var block = blocks.getBlockByResolvedName(testPath);
            if (block) return [filePath, block];
            dir.pop();
        }

        return [filePath, null];
    }
}

function assignFilesToBlocks(ob, value) {
    var block = value[1];
    var filePath = value[0];
    var blockId = (block && block.get('resolvedName')) || 'none';
    ob[blockId] = (ob[blockId] || []);
    ob[blockId].push(filePath);
    return ob;
}

function assignBlocksToFiles(ob, value){
    var block = value[1];
    var filePath = value[0];
    var blockId = (block && block.get('resolvedName')) || 'none';
    ob[filePath] = (ob[filePath] || []);
    ob[filePath].push(blockId);
    return ob;
}

module.exports = function(files, blocks) {

    var fileBlocks = files.getFiles().toArray()
        .map(getFileBlock(blocks));

    return Immutable.Map({
        filesPerBlock: fileBlocks.reduce(assignFilesToBlocks, {}),
        blocksPerFile: fileBlocks.reduce(assignBlocksToFiles, {})
    });
};
