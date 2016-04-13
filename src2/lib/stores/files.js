'use strict';

var convertToMap = require('../transforms/fsObArrayToMap');


module.exports = function(fileList){
    return convertToMap(fileList);
};
