'use strict';

var path = require('path'),
    matter = require('gray-matter'),
    marked = require('marked'),
    _ = require('lodash');

var connector = require('../../../../../../connector'),
    output = require('../../../../../../../stores/output');

function filter(site, collection, file) {
    return file.get('ext') === '.md';
}

function getTemplateContext(site, collection, file) {
    var block = connector.getBlocksByFileIdFromCollection(collection, file.get('id')).get(0),
        frontMatter = matter.read(file.get('path')),
        content = frontMatter.content ? marked(frontMatter.content) : '',

        data = (frontMatter.data && frontMatter.data.data) ? [].concat(frontMatter.data.data) : [],
        page = frontMatter.data && frontMatter.data.page || {},
        requires = (frontMatter.data && frontMatter.data.requires) ? [].concat(frontMatter.data.requires) : [],

        dataWithBlockId = {};
        dataWithBlockId[block.get('id')] = data;

        requires = requires.map(connector.getBlockIdFromName.bind(null, collection));

    return {
        page: {
            title: page.title || block.get('name'),
            urlPath: path.join(file.get('path').replace('.md', '.html')),
            blockIds: file.get('blockIds').toArray(),
            content: content
        },
        contextData: [dataWithBlockId],
        site: {
            title: site.get('title'),
            themes: site.get('themes').toJS(),
            blockIds: collection.get('blocks').keySeq().toJS()
        },
        requires: requires
    };
}

function transform(site, collection, result, file) {
    return getTemplateContext(site, collection, file);
}

module.exports = output(filter, transform);
module.exports.getTemplateContext = getTemplateContext;
