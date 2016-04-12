'use strict';

var convertToMap = require('../transformers/fsObArrayToMap');


module.exports = function(fileList){
    var _map = convertToMap(fileList);
    return {
        getFileByResolvedName: function(resolvedFileName){
            return _map.get(resolvedFileName);
        },
        getFiles: function(){
            return _map;
        },
        addBlocks: function(blockMap){
            _map = _map.map(function(file, fileName){
                file = file.set('blocks', blockMap.get(fileName));
                return file;
            });
        }
    };
};
