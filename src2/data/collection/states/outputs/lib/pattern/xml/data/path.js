'use strict';

var output = require('../../../../../../../stores/output');

function filter(site, collection, file) {
    return file.get('ext') === '.xml';
}

function transform(site, collection, result, file) {
    return file.get('absolutePath');
}

module.exports = output(filter, transform);
