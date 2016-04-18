'use strict';

var output = require('../../../../../../stores/output');

function filter(site, collection, file) {
    return file.get('ext') === '.xml';
}

function transform(site, collection, result, file) {

    return result.withMutations(function(result) {
        return result.set('path', file.get('path'));
    });
}

module.exports = output(filter, transform);
