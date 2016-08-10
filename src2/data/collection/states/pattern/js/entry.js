'use strict';

var path = require('path');

var connector = require(path.resolve('src2/data/collection/connector')),
    output = require(path.resolve('src2/data/stores/output')),
    nunjucksFactory = require(path.resolve('src2/lib/nunjucksWithData'));

var templatePath = path.join('src2', 'templates', 'formats', 'js', 'entry.njk');

function getBlockName(collection, file) {
    return connector.getBlockNameByFileIdFromCollection(collection, file.get('id'));
}

function fileIsRenderer(file) {
    return /^data\.js$/.test(file.get('name'));
}

function fileIsBlockJs(blockName, file) {
    var equalsBlockName = new RegExp(blockName, 'g');
    return equalsBlockName.test(file.get('name')) && file.get('ext') === '.js';
}

function filterJsBlock(site, collection, file) {

    var block = connector.getBlockByFileIdFromCollection(collection, file.get('id'));
    var blockName = getBlockName(collection, file);
    var fileIds = block.get('fileIds');
    var files = connector.getFilesByFileIdList(collection.get('files'), fileIds);

    if (fileIsRenderer(file)) return true; // If this file is renderer, return true

    var rendererFile = files.filter(fileIsRenderer).first(); // If there exists a file renderer (but isn't this file) return false
    if (rendererFile) return false;

    if (fileIsBlockJs(blockName, file)) return true; // Otherwise, in the absense of renderer, check if this is vanilla js

    return false;
}

function transformJsBlock(site, collection, result, file) {
    var nunjucks = nunjucksFactory(site, collection, connector);
    var blockName = getBlockName(collection, file);
    var reference = blockName;
    var context = { reference : reference, jsSrcPath: path.join('/js', blockName) + '.js' };
    var documentString = nunjucks.render(templatePath, context);
    return result.push(documentString);
}

module.exports = output(filterJsBlock, transformJsBlock);
