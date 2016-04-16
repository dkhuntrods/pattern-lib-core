'use strict';

var mapFiles = require('../transforms/map/files'),
    createCollection = require('../stores/collection'),
    connector = require('./connector'),
    fileMap = require('../transforms/map/file'),
    fileFilter = require('../transforms/filters/file').isFileWithPaths,
    fileStore = require('../stores/files'),
    getStates = require('./states'),
    getDefinitions = require('./definitions'),
    async = require('async');

function definitionAsync(definitionId, callback) {
    getDefinitions(function(err, definitions) {
        if (err) return callback(err);
        callback(null, definitions.get(definitionId));
    });
}

function filesAsync(dirPath, callback) {
    mapFiles(dirPath, fileFilter, fileMap, function(err, filePaths) {
        if (err) return callback(err);
        callback(null, fileStore(filePaths));
    });
}

function stateAsync(definitionId, callback) {
    getStates(function(err, states) {
        if (err) return callback(err);
        callback(null, states.get(definitionId));
    });
}

function blocksAsync(dirPath, callback, results) {
    var definition = results.definition;
    var blockFilter, blockMap, blockStore;

    try {
        blockFilter = definition.get('filter');
        blockMap = definition.get('map');
        blockStore = definition.get('store');
    } catch (e) {
        return callback(e);
    }

    mapFiles(dirPath, blockFilter, blockMap, function(err, blockFilePaths) {
        if (err) return callback(err);
        callback(null, blockStore(blockFilePaths));
    });
}

function collectionAsync(callback, results) {
    var blocks = results.blocks,
        files = results.files,
        state = results.state,
        collection;

    try {
        blocks = connector.addFileIds(blocks, files);
        files = connector.addBlockIds(files, blocks);
        collection = createCollection(files, blocks, state);
    } catch (e) {
        return callback(e);
    }
    callback(null, collection);
}

function asyncComplete(onComplete, definitionId, err, results) {
    if (err) return onComplete(new Error('There was a problem generating the file collection for \'' + definitionId + '\'; failed with: \n' + err));
    onComplete(null, results.collection);
}

module.exports = function(dirPath, definitionId, onComplete) {

    async.auto({
        definition: definitionAsync.bind(null, definitionId),
        files: filesAsync.bind(null, dirPath),
        state: stateAsync.bind(null, definitionId),
        blocks: ['definition', blocksAsync.bind(null, dirPath)],
        collection: ['files', 'blocks', 'state', collectionAsync]
    }, asyncComplete.bind(null, onComplete, definitionId));

};
