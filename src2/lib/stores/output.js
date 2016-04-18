'use strict';

var Immutable = require('immutable');

module.exports = function(sourceFilter, sourceTransform) {

    return Immutable.Map({
        apply: function(site, collection, blockFiles) {
            return blockFiles
                .filter(sourceFilter.bind(null, site, collection))
                .reduce(sourceTransform.bind(null, site, collection), Immutable.Map()).toJS();
        },
        filter: sourceFilter,
        transform:sourceTransform
    });
};
