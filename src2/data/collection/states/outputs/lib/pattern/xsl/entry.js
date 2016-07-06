'use strict';

var path = require('path');
var output = require('../../../../../../stores/output');

function filterXslEntry(site, collection, file) {
    return file.get('ext') === '.xsl';
}

function transformXslEntry(site, collection, result, file) {
    return path.relative(process.cwd(), file.get('absolutePath'));
}

module.exports = output(filterXslEntry, transformXslEntry);
