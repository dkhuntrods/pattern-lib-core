'use strict';

var convertToMap = require('../transforms/map/fsObArrayToMap');

module.exports = function(blockList){
    return convertToMap(blockList);
};
