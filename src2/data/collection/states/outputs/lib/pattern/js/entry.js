'use strict';

var path = require('path');
var camelCase = require('../../../../../../transforms/map/camelCase'),
    connector = require(path.resolve('src2/data/collection/connector')),
    output = require('../../../../../../stores/output');

function filterJsEntry(site, collection, file) {
    var blocks = connector.getBlocksByFileIdFromCollection(collection, file.get('id'));
    var blockName = blocks.first().get('name');
    var equalsBlockName = new RegExp(blockName, 'g');

    return /^_([\w-]+)-renderer\.js$/.test(file.get('name')) ||
        (equalsBlockName.test(file.get('name')) && file.get('ext') === '.js');
}

function transformJsEntry(site, collection, result, file) {
    return result.withMutations(function(result) {
        return result.set('path', path.join(path.sep, 'js', file.get('name')))
            .set('reference', camelCase(file.get('name').replace('.js', '')));
    });
}

module.exports = output(filterJsEntry, transformJsEntry);
