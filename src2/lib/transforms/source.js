'use strict';

var Immutable = require('immutable');

module.exports = function(sourceFilter, sourceTransform){

    return function(blockFiles) {
        return Immutable.fromJS(blockFiles
            .filter(sourceFilter)
            .reduce(sourceTransform, Immutable.Map()));
    };
};
