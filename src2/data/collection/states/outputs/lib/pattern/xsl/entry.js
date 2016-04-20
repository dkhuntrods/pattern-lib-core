'use strict';

var path = require('path');
var output = require('../../../../../../stores/output');

function filter(site, collection, file) {
    return file.get('ext') === '.xsl';
}

function transform(site, collection, result, file) {
    return path.relative(process.cwd(), file.get('absolutePath'));
}

module.exports = output(filter, transform);
