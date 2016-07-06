'use strict';

var output = require('../../../../../../../stores/output');

function filterDataPath(site, collection, file) {
    return file.get('ext') === '.xml';
}

function transformDataPath(site, collection, result, file) {
    return file.get('absolutePath');
}

module.exports = output(filterDataPath, transformDataPath);
