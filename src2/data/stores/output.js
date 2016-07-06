'use strict';

var Immutable = require('immutable'),
    async = require('async');

function getResult(result) {
    if (Immutable.Iterable.isIterable(result)) return result.toJS();
    else return result;
}

function applySync(sourceFilter, sourceTransform, site, collection, blockFiles) {
    var result = blockFiles
        .filter(sourceFilter.bind(null, site, collection))
        .reduce(sourceTransform.bind(null, site, collection), Immutable.List());
    return getResult(result);
}

function applyAsyncBoth(sourceFilter, sourceTransform, site, collection, blockFiles, onComplete) {
    return async.filter(blockFiles.toArray(), sourceFilter.bind(null, site, collection), function(results) {
        return async.reduce(results, Immutable.List(), sourceTransform.bind(null, site, collection), function(err, result) {
            return onComplete(err, getResult(result));
        });
    });
}

function applyAsyncTransform(sourceFilter, sourceTransform, site, collection, blockFiles, onComplete) {
    return async.reduce(blockFiles.filter(sourceFilter.bind(null, site, collection)).toArray(), Immutable.List(), sourceTransform.bind(null, site, collection), function(err, result) {
        return onComplete(err, getResult(result));
    });
}

function applyAsyncFilter(sourceFilter, sourceTransform, site, collection, blockFiles, onComplete) {
    return async.filter(blockFiles.toArray(), sourceFilter.bind(null, site, collection), function(results) {
        var result = results.reduce(sourceTransform.bind(null, site, collection), Immutable.List());
        return onComplete(null, getResult(result));
    });
}

var transformMethods = [applySync, applyAsyncBoth, applyAsyncTransform, applyAsyncFilter];

function getTransformType(sourceFilter, sourceTransform, onComplete) {

    var list = [];
    var type = 0;
    var hasTopLevelCallback = (typeof onComplete === 'function');
    var hasFilterCallback = (sourceFilter.length === 4);
    var hasTransformCallback = (sourceTransform.length === 5);

    var hasTransformCallbacks = hasFilterCallback || hasTransformCallback;

    if (hasTransformCallbacks && !hasTopLevelCallback) {
        if (hasFilterCallback) list.push('filter method: \'' + sourceFilter.name + '\'');
        if (hasTransformCallback) list.push('transform method: \'' + sourceTransform.name + '\'');

        throw new Error('\nOutput transform: the transform requested (' + list.join(', ') + ') requires a callback method, but a callback method was not supplied\nCheck calls to \'getFileOutputsByAbsolutePath\' and \'getBlockOutputsFromCollection\'');
    }

    if (hasTopLevelCallback && hasTransformCallbacks) {
        if (hasFilterCallback && hasTransformCallback) type = 1;
        if (!hasFilterCallback && hasTransformCallback) type = 2;
        else if (hasFilterCallback && !hasTransformCallback) type = 3;
    }

    return type;
}

function getTransformMethod(sourceFilter, sourceTransform, onComplete) {
    var type = getTransformType(sourceFilter, sourceTransform, onComplete);
    return transformMethods[type];
}

function applyTransforms(sourceFilter, sourceTransform, site, collection, blockFiles, onComplete) {

    var transformMethod = getTransformMethod(sourceFilter, sourceTransform, onComplete);
    return transformMethod(sourceFilter, sourceTransform, site, collection, blockFiles, onComplete);
}

module.exports = function(sourceFilter, sourceTransform) {

    return Immutable.Map({
        apply: applyTransforms.bind(null, sourceFilter, sourceTransform),
        filter: sourceFilter,
        transform: sourceTransform
    });
};
