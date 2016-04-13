'use strict';

var convertToMap = require('../transforms/fsObArrayToMap');

module.exports = function(blockList){
    var _map = convertToMap(blockList);
    var _formats;

    return {
        getById(id){
            return _map.get(id);
        },
        getBlocks: function(){
            return _map;
        },
        getBlockIds: function(){
            return _map.keySeq().toList();
        },
        addFileIds: function(fileMap){
            _map = _map.map(function(block, blockName){
                block = block.set('fileIds', fileMap.get(blockName));
                return block;
            });
        },
        getBlocksByIdList: function(blockIdList) {
            return blockIdList.map(function(blockId) {
                return _map.get(blockId);
            });
        }
    };
};
