'use strict';

var Immutable = require('immutable');

module.exports = function convertToMap(list){
    return Immutable.Map(list.reduce(function(ob, map){
        ob[map.get('id')] = map;
        return ob;
    }, {}));
}
