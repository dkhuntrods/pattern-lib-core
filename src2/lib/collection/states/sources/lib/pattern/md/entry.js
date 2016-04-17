'use strict';

var path = require('path'),
    matter = require('gray-matter'),
    marked = require('marked');

var connector = require('../../../../../connector'),
    source = require('../../../../../../transforms/map/source');

function filter(site, collection, file) {
    return file.get('ext') === '.md';
}

function getLibXSLTContext(site, collection, file) {
    var block = connector.getBlocksByFileIdFromCollection(collection, file.get('id')).get(0),
        frontMatter = matter.read(file.get('path')),
        content = frontMatter.content ? marked(frontMatter.content) : '',

        data = frontMatter.data && frontMatter.data.data || {},
        page = frontMatter.data && frontMatter.data.page || {},
        requires = frontMatter.data && frontMatter.data.requires || [];

    return {
        page: {
            title: page.title || block.get('name'),
            urlPath: path.join(file.get('path').replace('.md', '.html')),
            blockIds: file.get('blockIds').toArray(),
            content: content
        },
        data: data,
        site: {
            title: site.get('title'),
            themes: site.get('themes').toJS(),
            blockIds: collection.get('blocks').keySeq().toJS()
        },
        requires: requires
    };
}

function transform(site, collection, result, file) {

    return result.withMutations(function(result) {
        return result.set('path', path.join(file.get('dir'), file.get('name').replace('.md', '.html')))
            .set('xslTemplatePath', path.join('src', 'templates', 'block-template.xsl'))
            .set('xmlTemplatePath', path.join('src', 'templates', 'block-template.xml'))
            .set('context', getLibXSLTContext(site, collection, file));
    });
}

module.exports = source(filter, transform);
