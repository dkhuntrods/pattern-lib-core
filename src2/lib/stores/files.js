'use strict';

var Immutable = require('immutable'),
    _ = require('lodash');


function convertToMap(list){
    return Immutable.Map(_.reduce(list, function(ob, file){
        ob[file.resolvedName] = file;
        return ob;
    }, {}));
}

module.exports = function(fileList){
    var map = convertToMap(fileList);
    return {
        getFileByResolvedName(resolvedFileName){
            return map.get(resolvedFileName);
        }
    };
};
