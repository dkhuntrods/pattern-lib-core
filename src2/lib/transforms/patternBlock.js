'use strict';

var createBlock = require('../stores/block');

function createBlockFromPath(dirPath){
    try {
        return createBlock(dirPath);
    } catch(e){
        return null;
    }
}

module.exports = createBlockFromPath;
