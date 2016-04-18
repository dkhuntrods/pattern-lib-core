'use strict';

var Immutable = require('immutable');

module.exports = function(sourceFilter, sourceTransform) {

    return Immutable.Map({
        apply: function(site, collection, blockFiles) {
            var result = blockFiles
                .filter(sourceFilter.bind(null, site, collection))
                .reduce(sourceTransform.bind(null, site, collection), Immutable.Map());
            if (Immutable.Iterable.isIterable(result)) return result.toJS();
            else return result;
        },
        filter: sourceFilter,
        transform:sourceTransform
    });
};
