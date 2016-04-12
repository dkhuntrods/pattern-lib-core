'use strict';

var convertToMap = require('../transformers/fsObArrayToMap');

module.exports = function(blockList){
    var _map = convertToMap(blockList);

    return {
        getBlockByResolvedName(resolvedBlockName){
            return _map.get(resolvedBlockName);
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
