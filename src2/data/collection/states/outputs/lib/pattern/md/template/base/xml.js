'use strict';

var path = require('path'),
    matter = require('gray-matter'),
    marked = require('marked');

var connector = require('../../../../../../../connector'),
    output = require('../../../../../../../../stores/output');

function filterBaseXml(site, collection, file) {
    return file.get('ext') === '.md';
}

function transformBaseXml(site, collection, result, file) {

    return path.join('src2', 'templates', 'block-template.xml');

}

module.exports = output(filterBaseXml, transformBaseXml);
