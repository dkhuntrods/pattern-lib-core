'use strict';

var Immutable = require('immutable');

module.exports = function(sourceFilter, sourceTransform){

    return function(site, collection, blockFiles) {
        return Immutable.fromJS(blockFiles
            .filter(sourceFilter.bind(null, site, collection))
            .reduce(sourceTransform.bind(null, site, collection), Immutable.Map()));
    };
};
