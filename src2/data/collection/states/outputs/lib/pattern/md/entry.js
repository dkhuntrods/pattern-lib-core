'use strict';

var path = require('path');

var output = require('../../../../../../stores/output');

function filterMdEntry(site, collection, file) {

    return file.get('ext') === '.md';
}

function transformMdToHTML(site, collection, result, file) {

    return result.withMutations(function(result) {
        return result.set('path', path.join(file.get('dir'), file.get('name').replace('.md', '.html')));
    });
}

module.exports = output(filterMdEntry, transformMdToHTML);
