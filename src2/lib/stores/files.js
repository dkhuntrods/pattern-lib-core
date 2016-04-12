'use strict';

var Immutable = require('immutable'),
    _ = require('lodash');


function convertToMap(list){
    return Immutable.Map(_.reduce(list, function(ob, map){
        ob[map.get('resolvedName')] = map;
        return ob;
    }, {}));
}

module.exports = function(fileList){
    var _map = convertToMap(fileList);
    return {
        getFileByResolvedName: function(resolvedFileName){
            return _map.get(resolvedFileName);
        },
        getFiles: function(){
            return _map;
        }
    };
};
