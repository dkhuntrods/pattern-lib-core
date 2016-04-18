'use strict';

var path = require('path');
var camelCase = require('../../../../../../../transforms/map/camelCase'),
    output = require('../../../../../../../stores/output');

function filter(site, collection, file) {
    return /^_([\w-]+)-renderer\.js$/.test(file.get('name')) || file.get('ext') === '.js';
}

function transform(site, collection, result, file) {
    return result.withMutations(function(result) {
        return result.set('test', file.get('name'));
    });
}

module.exports = output(filter, transform);
