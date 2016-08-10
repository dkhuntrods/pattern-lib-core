'use strict';

var path = require('path');

var connector = require(path.resolve('src2/data/collection/connector')),
    output = require(path.resolve('src2/data/stores/output')),
    nunjucksFactory = require(path.resolve('src2/lib/nunjucksWithData'));

var templatePath = path.join('src2', 'templates', 'formats', 'js', 'block.njk');

function getBlockName(collection, file) {
    return connector.getBlockNameByFileIdFromCollection(collection, file.get('id'));
}

function filterJsBlock(site, collection, file) {
    var blockName = getBlockName(collection, file);
    var equalsBlockName = new RegExp(blockName, 'g');

    return /^data\.js$/.test(file.get('name')) ||
        (equalsBlockName.test(file.get('name')) && file.get('ext') === '.js');
}

function transformJsBlock(site, collection, result, file) {
    var nunjucks = nunjucksFactory(site, collection, connector);
    var context = { blockName : getBlockName(collection, file) };
    var documentString = nunjucks.render(templatePath, context);
    return result.push(documentString);
}

module.exports = output(filterJsBlock, transformJsBlock);
