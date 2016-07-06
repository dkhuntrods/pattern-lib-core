'use strict';

var path = require('path');
var output = require(path.resolve('src2/data/stores/output'));

function filterXslEntry(site, collection, file) {
    return file.get('ext') === '.xsl';
}

function transformXslEntry(site, collection, result, file) {
    return result.push(path.relative(process.cwd(), file.get('absolutePath')));
}

module.exports = output(filterXslEntry, transformXslEntry);
