'use strict';

var Immutable = require('immutable'),
    _ = require('lodash');


function convertToMap(list){
    return Immutable.Map(list.reduce(function(ob, file){
        ob[file.resolvedName] = file;
        return ob;
    }, {}));
}

module.exports = function(blockList){
    var map = convertToMap(blockList);
    return {
        getBlockByResolvedName(resolvedBlockName){
            return map.get(resolvedBlockName);
        }
    };
};
