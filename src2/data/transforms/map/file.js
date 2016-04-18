'use strict';

var createFile = require('../../stores/file');

function createFileFromPath(filePath){
    try {
        return createFile(filePath);
    } catch(e){
        return null;
    }
}

module.exports = createFileFromPath;
