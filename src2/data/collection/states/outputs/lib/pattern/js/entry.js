'use strict';

var path = require('path');
var camelCase = require('../../../../../../transforms/map/camelCase'),
    output = require('../../../../../../stores/output');

function filter(site, collection, file) {
    return /^_([\w-]+)-renderer\.js$/.test(file.get('name')) || file.get('ext') === '.js';
}

function transform(site, collection, result, file) {
    return result.withMutations(function(result) {
        return result.set('path', path.join(path.sep, 'js', file.get('name')))
            .set('reference', camelCase(file.get('name').replace('.js', '')));
    });
}

module.exports = output(filter, transform);
