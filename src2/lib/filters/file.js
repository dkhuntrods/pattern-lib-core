'use strict';

var path = require('path'),
    fs = require('fs');

function isFile(testPath){
    return fs.statSync(testPath).isFile();
}

module.exports.isFile = isFile;
module.exports.getIsFileWithPaths = function(paths){
    return isFile;
}
