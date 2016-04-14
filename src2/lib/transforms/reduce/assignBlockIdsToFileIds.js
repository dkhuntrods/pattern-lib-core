'use strict';

function assignBlockIdsToFileIds(ob, value){
    var block = value[1];
    var fileId = value[0];
    var blockId = (block && block.get('id')) || 'none';
    ob[fileId] = (ob[fileId] || []);
    ob[fileId].push(blockId);
    return ob;
}

module.exports = assignBlockIdsToFileIds;
