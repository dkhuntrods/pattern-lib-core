'use strict';


function assignFileIdsToBlockIds(ob, value) {
    var block = value[1];
    var fileId = value[0];
    var blockId = (block && block.get('id')) || 'none';
    ob[blockId] = (ob[blockId] || []);
    ob[blockId].push(fileId);
    return ob;
}

module.exports = assignFileIdsToBlockIds;
