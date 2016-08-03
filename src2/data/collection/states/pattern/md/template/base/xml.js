'use strict';

var path = require('path');

var output = require(path.resolve('src2/data/stores/output'));

function filterBaseXml(site, collection, file) {
    return file.get('ext') === '.md';
}

function transformBaseXml(site, collection, result, file) {
    return result.push(path.join('src2', 'templates', 'formats', 'xslt', 'block-template.xml'));
}

module.exports = output(filterBaseXml, transformBaseXml);
