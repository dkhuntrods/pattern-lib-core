'use strict';

var Immutable = require('immutable');

module.exports = function(id, sourceFilter, sourceTransform){

    return {
        id: id,
        apply: function(blockFiles) {
            return Immutable.fromJS(blockFiles
                .filter(sourceFilter)
                .reduce(sourceTransform, Immutable.Map()));
        }
    }
};
