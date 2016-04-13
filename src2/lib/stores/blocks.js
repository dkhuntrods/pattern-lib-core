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
        getBlockNames: function(){
            return _map.keySeq().toList();
        },
        addFiles: function(fileMap){
            _map = _map.map(function(block, blockName){
                block = block.set('files', fileMap.get(blockName));
                return block;
            });
        }
    };
};
