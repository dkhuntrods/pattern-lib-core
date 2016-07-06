'use strict';

var path = require('path');

var output = require(path.resolve('src2/data/stores/output'));

function filterMdEntry(site, collection, file) {

    return file.get('ext') === '.md';
}

function transformMdToHTML(site, collection, result, file) {
    return result.push(path.join(file.get('dir'), file.get('name').replace('.md', '.html')));
}

module.exports = output(filterMdEntry, transformMdToHTML);
