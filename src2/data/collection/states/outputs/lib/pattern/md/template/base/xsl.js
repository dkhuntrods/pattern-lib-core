'use strict';

var path = require('path'),
    matter = require('gray-matter'),
    marked = require('marked');

var connector = require('../../../../../../../connector'),
    output = require('../../../../../../../../stores/output');

function filter(site, collection, file) {
    return file.get('ext') === '.md';
}

function transform(site, collection, result, file) {

    return path.join('src2', 'templates', 'block-template.xsl');

}

module.exports = output(filter, transform);
