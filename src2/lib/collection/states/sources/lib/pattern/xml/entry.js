'use strict';

var path = require('path');

var source = require('../../../../../../transforms/map/source');

function filter(site, collection, file) {
    return file.get('ext') === '.xml';
}

function transform(site, collection, result, file) {

    return result.withMutations(function(result) {
        return result.set('path', file.get('path'))
            .set('templatePath', path.join('src', 'templates', 'block-template.xml'));
    });
}

module.exports = source(filter, transform);
