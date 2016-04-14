'use strict';

var convertToMap = require('../transforms/map/fsObArrayToMap');


module.exports = function(fileList){
    return convertToMap(fileList);
};
