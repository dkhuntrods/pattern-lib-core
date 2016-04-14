'use strict';

var Immutable = require('immutable');

module.exports = function(files, blocks, states){
    return Immutable.Map({
        files: files,
        blocks: blocks,
        states: states
    });
};
