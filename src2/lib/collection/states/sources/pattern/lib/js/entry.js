'use strict';

var path = require('path');

var source = require('../../../../../../transforms/map/source');

function filter(site, collection, file) {
    return /^_([\w-]+)-renderer\.js$/.test(file.get('name')) || file.get('ext') === '.js';
}

function transform(site, collection, result, file) {
    return result.withMutations(function(result) {
        return result.set('path', path.join(path.sep, 'js', file.get('name')))
            .set('reference', file.get('name').replace('.js'));
    });
}

module.exports = source(filter, transform);
