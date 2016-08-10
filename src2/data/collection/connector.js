'use strict';

var Immutable = require('immutable');

var fileBlockJoinMap = require('../transforms/map/patternFileBlockTuple'),
    fileBlockReduce = require('../transforms/reduce/assignFileIdsToBlockIds'),
    blockFileReduce = require('../transforms/reduce/assignBlockIdsToFileIds');



function getStorePath(store, path, name) {
    name = name || 'transform';
    var result = store.getIn(path);
    if (!result) throw new Error('\nNo ' + name + ' found for path \'' + path.join(', ') +
        '\'\nIf state, check that a file lives at this location within \'src/data/collection/states/*\'');
    return result;
}

function getArgs(args, defaultTailLength, statePathSeg ) {
    statePathSeg = statePathSeg || 'apply';
    var head = args.splice(0, 2),
        tail = [],
        endCount = typeof args[args.length - 1] === 'function' ? defaultTailLength + 1 : defaultTailLength;

    tail = args.splice(-endCount, endCount);

    head.push(['states'].concat(args, statePathSeg));
    return head.concat(tail);
}



function addFileIds(blocks, files) {
    var fileMap = getFileIdsPerBlock(files, blocks);
    return blocks.map(function(block, blockName) {
        block = block.set('fileIds', fileMap.get(blockName));
        return block;
    });
}

function addBlockIds(files, blocks) {
    var blockMap = getBlockIdsPerFile(files, blocks);
    return files.map(function(file, fileId) {
        file = file.set('blockIds', blockMap.get(fileId));
        return file;
    });
}




function getBlocksByFileId(blocks, files, fileId) {
    return getBlocksByBlockIdList(blocks, getStorePath(files, [fileId, 'blockIds'], 'fileId'));
}

function getBlocksByFileIdFromCollection(collection, fileId) {
    return getBlocksByFileId(collection.get('blocks'), collection.get('files'), fileId);
}

function getBlocksByBlockIdList(blocks, blockIdList) {
    return blockIdList.map(function(blockId) {
        return blocks.get(blockId);
    });
}

function getBlockIdsPerFile(files, blocks) {
    var joinMethod = fileBlockJoinMap.bind(null, blocks);
    return Immutable.fromJS(files.toArray()
        .map(joinMethod)
        .reduce(blockFileReduce, {}));
}

function getFilesByAbsolutePath(files, filePath) {
    return files.filter(function(file) {
        return file.get('absolutePath') === filePath;
    });
}

function getFilesByAbsoluteFilePathFromCollection(collection, filePath) {
    return getFilesByAbsolutePath(collection.get('files'), filePath);
}

function getFilesByFileIdList(files, fileIdList) {
    return fileIdList.map(function(fileId) {
        return files.get(fileId);
    });
}

function getFileIdsPerBlock(files, blocks) {
    var joinMethod = fileBlockJoinMap.bind(null, blocks);
    return Immutable.fromJS(files.toArray()
        .map(joinMethod)
        .reduce(fileBlockReduce, {}));
}

function getFileIdListByFormatFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg) */ ) {
    var newArgs = getArgs(Array.prototype.slice.call(arguments), 0, 'filter'),
        collection = newArgs[1],
        filterFunc = getStorePath(collection, newArgs[3]);

    var filter = filterFunc.bind(null, newArgs[0], collection);
    return collection.get('files').filter(filter).keySeq().toArray();
}

function getBlockNameByBlockIdFromCollection(collection, blockId) {
    return getStorePath(collection, ['blocks', blockId, 'name']);
}

function getBlockIdByBlockNameFromCollection(collection, blockName) {
    var blocks = collection.get('blocks').filter(function(block) {
        return block.get('name') === blockName;
    });
    return blocks.size > 0 ? blocks.first().get('id') : null;
}

function getBlockNameByFileIdFromCollection(collection, fileId) {
    var blocks = getBlocksByFileIdFromCollection(collection, fileId);
    return blocks.first().get('name');
}

function getBlockIdByFileIdFromCollection(collection, fileId) {
    var blocks = getBlocksByFileIdFromCollection(collection, fileId);
    return blocks.first().get('id');
}

function getBlockByFileIdFromCollection(collection, fileId) {
    var blocks = getBlocksByFileIdFromCollection(collection, fileId);
    return blocks.first();
}

function _getOutputsByBlockIdFromCollection(site, collection, statePath, blockId, onComplete) {
    if (!blockId) throw new Error('\nNo blockId found for path \'' + statePath.join(', ') +
        '\'\nCheck that the correct id has been passed within the .njk template files');
    var transform = getStorePath(collection, statePath);
    var fileIds = getStorePath(collection, ['blocks', blockId, 'fileIds'], 'fileIds');
    var blockFiles = getFilesByFileIdList(collection.get('files'), fileIds);
    return transform(site, collection, blockFiles, onComplete);
}

function getOutputsByBlockIdFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), blockId, onComplete */ ) {
    var newArgs = getArgs(Array.prototype.slice.call(arguments), 1);
    return _getOutputsByBlockIdFromCollection.apply(null, newArgs);
}

function _getOutputsByFormatFromCollection(site, collection, statePath, onComplete) {
    var transform = getStorePath(collection, statePath);
    var blockFiles = collection.get('files');
    return transform(site, collection, blockFiles, onComplete);
}

function getOutputsByFormatFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), onComplete */ ) {
    var newArgs = getArgs(Array.prototype.slice.call(arguments), 0);
    return _getOutputsByFormatFromCollection.apply( null, newArgs);
}

function _getOutputsByFileAbsolutePathFromCollection(site, collection, statePath, filePath, onComplete) {
    var transform = getStorePath(collection, statePath);
    var blockFiles = getFilesByAbsoluteFilePathFromCollection(collection, filePath);
    return transform(site, collection, blockFiles, onComplete);
}

function getOutputsByFileAbsolutePathFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), filePath, onComplete */ ) {
    var newArgs = getArgs(Array.prototype.slice.call(arguments), 1);
    return _getOutputsByFileAbsolutePathFromCollection.apply( null, newArgs);
}



module.exports = {
    addBlockIds: addBlockIds,
    addFileIds: addFileIds,

    getBlocksByBlockIdList: getBlocksByBlockIdList,
    getFilesByFileIdList: getFilesByFileIdList,

    getFileIdsPerBlock: getFileIdsPerBlock,
    getBlockIdsPerFile: getBlockIdsPerFile,

    getBlockNameByBlockIdFromCollection: getBlockNameByBlockIdFromCollection,
    getBlockIdByBlockNameFromCollection: getBlockIdByBlockNameFromCollection,

    getBlockByFileIdFromCollection: getBlockByFileIdFromCollection,
    getBlockNameByFileIdFromCollection: getBlockNameByFileIdFromCollection,
    getBlockIdByFileIdFromCollection: getBlockIdByFileIdFromCollection,

    getFileIdListByFormatFromCollection: getFileIdListByFormatFromCollection,
    getBlocksByFileIdFromCollection: getBlocksByFileIdFromCollection,

    getOutputsByFileAbsolutePathFromCollection: getOutputsByFileAbsolutePathFromCollection,
    getOutputsByBlockIdFromCollection: getOutputsByBlockIdFromCollection,
    getOutputsByFormatFromCollection: getOutputsByFormatFromCollection,
};
