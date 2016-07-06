'use strict';

var path = require('path');

var output = require(path.resolve('src2/data/stores/output'));

function filterBaseXsl(site, collection, file) {
    return file.get('ext') === '.md';
}

function transformBaseXsl(site, collection, result, file) {

    return path.join('src2', 'templates', 'block-template.xsl');

}

module.exports = output(filterBaseXsl, transformBaseXsl);
