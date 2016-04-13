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

module.exports = function(joinMethod) {

    return {
        getFileIdsPerBlock: function(files, blocks) {
            var _joinMethod = joinMethod.bind(null, blocks);
            return Immutable.fromJS(files.toArray()
                .map(_joinMethod)
                .reduce(assignFilesToBlocks, {}));
        },
        getBlockIdsPerFile: function(files, blocks) {
            var _joinMethod = joinMethod.bind(null, blocks);
            return Immutable.fromJS(files.toArray()
                .map(_joinMethod)
                .reduce(assignBlocksToFiles, {}));
        }
    }
};
