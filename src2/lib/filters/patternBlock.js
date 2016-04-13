'use strict';

var path = require('path'),
    _ = require('lodash'),
    isFile = require('./file').isFile;

function checkFilenameHidden(testPath) {
    var dirTest = '_';
    return _.some(testPath.split(path.sep), function(part) {
        return part.charAt(0) === dirTest;
    });
}

function checkForMdFiles(testPath) {
    var fsInfo = path.parse(testPath);
    // console.log(fsInfo);
    if (fsInfo.ext === '.md') return true;
    return false;
}

function getReduceByPath(testPath) {
    return function reduceByPath(result, file) {
        var test = file.replace(testPath + path.sep, '').split(path.sep);
        // console.log('test:', testPath, test);
        if (test.length === 1) result.push(file);
        return result;
    };
}


function isPatternBlock(paths, testPath) {

    var validBlockFiles = [];

    if (isFile(testPath)) return false;
    if (checkFilenameHidden(testPath)) return false;

    validBlockFiles = _.chain(paths)
        .reduce(getReduceByPath(testPath), [])
        .reject(checkFilenameHidden)
        .filter(checkForMdFiles)
        .value();

    return validBlockFiles.length > 0;
};

module.exports = isPatternBlock;
