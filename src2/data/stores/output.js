'use strict';

var Immutable = require('immutable'),
    async = require('async');

var asyncFilterLength = 4,
    asyncReduceLength = 5;

function getResult(result) {
    if (Immutable.Iterable.isIterable(result)) return result.toJS();
    else return result;
}

function applySync(sourceFilter, sourceTransform, site, collection, fileList) {
    var result = fileList
        .filter(sourceFilter.bind(null, site, collection))
        .reduce(sourceTransform.bind(null, site, collection), Immutable.List());
    return getResult(result);
}

function applyAsyncBoth(sourceFilter, sourceTransform, site, collection, fileList, onComplete) {
    return async.filter(fileList.toArray(), sourceFilter.bind(null, site, collection), function(results) {
        return async.reduce(results, Immutable.List(), sourceTransform.bind(null, site, collection), function(err, result) {
            return onComplete(err, getResult(result));
        });
    });
}

function applyAsyncTransform(sourceFilter, sourceTransform, site, collection, fileList, onComplete) {
    return async.reduce(fileList.filter(sourceFilter.bind(null, site, collection)).toArray(), Immutable.List(), sourceTransform.bind(null, site, collection), function(err, result) {
        return onComplete(err, getResult(result));
    });
}

function applyAsyncFilter(sourceFilter, sourceTransform, site, collection, fileList, onComplete) {
    return async.filter(fileList.toArray(), sourceFilter.bind(null, site, collection), function(results) {
        var result = results.reduce(sourceTransform.bind(null, site, collection), Immutable.List());
        return onComplete(null, getResult(result));
    });
}

var transformMethods = [applySync, applyAsyncBoth, applyAsyncTransform, applyAsyncFilter];

function getTransformType(sourceFilter, sourceTransform, onComplete) {

    var list = [];
    var type = 0;
    var hasTopLevelCallback = (typeof onComplete === 'function');
    var hasFilterCallback = (sourceFilter.length === asyncFilterLength);
    var hasTransformCallback = (sourceTransform.length === asyncReduceLength);

    var hasTransformCallbacks = hasFilterCallback || hasTransformCallback;

    if (hasTransformCallbacks && !hasTopLevelCallback) {
        if (hasFilterCallback) list.push('filter method: \'' + sourceFilter.name + '\'');
        if (hasTransformCallback) list.push('transform method: \'' + sourceTransform.name + '\'');

        throw new Error('\nOutput transform: the transform requested (' + list.join(', ') + ') requires a callback method, but a callback method was not supplied\nCheck calls to \'getOutputsByFileAbsolutePathFromCollection\' and \'getBlockOutputsFromCollection\'');
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

function applyTransforms(sourceFilter, sourceTransform, site, collection, fileList, onComplete) {

    var transformMethod = getTransformMethod(sourceFilter, sourceTransform, onComplete);
    return transformMethod(sourceFilter, sourceTransform, site, collection, fileList, onComplete);
}

module.exports = function(sourceFilter, sourceTransform) {

    return Immutable.Map({
        apply: applyTransforms.bind(null, sourceFilter, sourceTransform),
        filter: sourceFilter,
        transform: sourceTransform
    });
};
