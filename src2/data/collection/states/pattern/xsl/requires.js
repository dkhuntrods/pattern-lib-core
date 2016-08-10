'use strict';

var path = require('path'),
    matter = require('gray-matter');

var connector = require(path.resolve('src2/data/collection/connector')),
    output = require(path.resolve('src2/data/stores/output'));

function filterXSLRequires(site, collection, file) {
    return file.get('ext') === '.md';
}

function getXSLRequires(site, collection, file) {
    var frontMatter = matter.read(file.get('path')),
        requires = (frontMatter.data && frontMatter.data.requires) ? [].concat(frontMatter.data.requires) : [];

    requires = requires.map(connector.getBlockIdByBlockNameFromCollection.bind(null, collection));

    return requires;
}

function transformXSLRequires(site, collection, result, file) {
    return result.push(getXSLRequires(site, collection, file));
}

module.exports = output(filterXSLRequires, transformXSLRequires);

