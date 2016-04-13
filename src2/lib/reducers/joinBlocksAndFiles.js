'use strict';

var Immutable = require('immutable');

function assignFilesToBlocks(ob, value) {
    var block = value[1];
    var filePath = value[0];
    var blockId = (block && block.get('id')) || 'none';
    ob[blockId] = (ob[blockId] || []);
    ob[blockId].push(filePath);
    return ob;
}

function assignBlocksToFiles(ob, value){
    var block = value[1];
    var filePath = value[0];
    var blockId = (block && block.get('id')) || 'none';
    ob[filePath] = (ob[filePath] || []);
    ob[filePath].push(blockId);
    return ob;
}

module.exports = function(files, blocks, joinMethod) {

    var fileBlocks = files.getFiles().toArray()
        .map(joinMethod(blocks));

    return Immutable.fromJS({
        filesPerBlock: fileBlocks.reduce(assignFilesToBlocks, {}),
        blocksPerFile: fileBlocks.reduce(assignBlocksToFiles, {})
    });
};
