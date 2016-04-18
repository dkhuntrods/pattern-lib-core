'use strict';

var fs = require('fs');

function isFile(testPath){
    return fs.statSync(testPath).isFile();
}

function isFileWithPaths(paths, testPath){
    return isFile(testPath);
}

module.exports.isFile = isFile;
module.exports.isFileWithPaths = isFileWithPaths;
