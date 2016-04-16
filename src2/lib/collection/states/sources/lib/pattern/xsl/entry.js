'use strict';

var path = require('path');

var source = require('../../../../../../transforms/map/source'),
    connector = require('../../../../../connector');

function filter(site, collection, file) {
    return file.get('ext') === '.xsl';
}

function getLibXSLTContext(site, file, block, collection) {
    return {
        page: {
            title: block.get('name'),
            urlPath: path.join(file.get('dir'), file.get('name').replace('.xsl', '.html')),
            blockIds: file.get('blockIds').toArray(),
            contents: file.get('contents')
        },
        data: { title: 'one', content: 'Some nice things' },
        site: {
            title: site.get('title'),
            themes: site.get('themes').toJS(),
            blockIds: collection.get('blocks').keySeq().toJS()
        }
    };
}

function transform(site, collection, result, file) {
    var blocks = connector.getBlocksByFileIdFromCollection(collection, file.get('id'));
    var context = getLibXSLTContext(site, file, blocks.get(0), collection);

    return result.withMutations(function(result) {
        return result.set('path', file.get('path'))
            .set('templatePath', path.join('src', 'templates', 'block-template.xsl'))
            .set('context', context);
    });
}

module.exports = source(filter, transform);
