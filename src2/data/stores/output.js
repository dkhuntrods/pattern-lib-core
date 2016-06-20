'use strict';

var Immutable = require('immutable'),
    async = require('async');

function applyFiltersSync(sourceFilter, sourceTransform, site, collection, blockFiles) {
    var result = blockFiles
        .filter(sourceFilter.bind(null, site, collection))
        .reduce(sourceTransform.bind(null, site, collection), Immutable.Map());
    if (Immutable.Iterable.isIterable(result)) return result.toJS();
    else return result;
}

function applyFiltersAsync(sourceFilter, sourceTransform, site, collection, blockFiles, onComplete) {
    var result = blockFiles
        .filter(sourceFilter.bind(null, site, collection))
        .reduce(sourceTransform.bind(null, site, collection), Immutable.Map());
    if (Immutable.Iterable.isIterable(result)) return result.toJS();
    else return result;
}

module.exports = function(sourceFilter, sourceTransform) {
    console.log('length', sourceFilter.length);
    console.log('length', sourceTransform.length);
    // if sourcefilter.length === 4, onComplete handler provided,
    // wrap filter in async

    var applyMethod = applyFiltersSync.bind(null, sourceFilter, sourceTransform, onComplete);

    return Immutable.Map({
        apply: applyMethod,
        filter: sourceFilter,
        transform: sourceTransform
    });
};
