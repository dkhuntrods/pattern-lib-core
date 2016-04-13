'use strict';

var convertToMap = require('../transforms/fsObArrayToMap');


module.exports = function(fileList){
    var _map = convertToMap(fileList);
    return {
        getById: function(id){
            return _map.get(id);
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
