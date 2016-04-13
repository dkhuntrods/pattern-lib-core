'use strict';

var convertToMap = require('../transforms/fsObArrayToMap');

module.exports = function(blockList){
    return convertToMap(blockList);
};
