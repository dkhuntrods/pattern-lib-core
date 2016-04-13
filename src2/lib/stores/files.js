'use strict';

var Immutable = require('immutable'),
convertToMap = require('../transforms/fsObArrayToMap');


module.exports = function(fileList){
    var _map = convertToMap(fileList);
    return {
        getById: function(id){
            return _map.get(id);
        },
        getFiles: function(){
            return _map;
        },
        addBlockIds: function(blockMap){
            _map = _map.map(function(file, fileId){
                file = file.set('blockIds', blockMap.get(fileId));
                return file;
            });
        },
        getFilesByIdList: function(fileIdList) {
            return fileIdList.map(function(fileId) {
                return _map.get(fileId);
            });
        }
    };
};
