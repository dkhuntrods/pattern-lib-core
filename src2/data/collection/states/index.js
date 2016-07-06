'use strict';

var filesToOutputs = require('../../transforms/filesToOutputs'),
    nodePath = require('path'),
    dir = require('node-dir');

module.exports = function(onComplete) {

    var sourcePath = nodePath.join(__dirname);
    filesToOutputs = filesToOutputs.bind(null, onComplete, sourcePath);

    dir.paths(sourcePath, filesToOutputs);
};
