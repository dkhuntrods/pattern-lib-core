'use strict';

var path = require('path');

var output = require('../../../../../../stores/output');

function filter(site, collection, file) {
    return file.get('ext') === '.md';
}

function transform(site, collection, result, file) {

    return result.withMutations(function(result) {
        return result.set('path', path.join(file.get('dir'), file.get('name').replace('.md', '.html')));
    });
}

module.exports = output(filter, transform);
