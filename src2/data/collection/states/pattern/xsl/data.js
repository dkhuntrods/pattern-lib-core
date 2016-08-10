'use strict';

var path = require('path');
var output = require(path.resolve('src2/data/stores/output'));

function filterDataPath(site, collection, file) {
    return (/^data\.xml$/.test(file.get('name')) && file.get('ext') === '.xml');
}

function transformDataPath(site, collection, result, file) {
    return result.push(file.get('absolutePath'));
}

module.exports = output(filterDataPath, transformDataPath);
