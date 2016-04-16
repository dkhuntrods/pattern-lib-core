'use strict';

var Immutable = require('immutable');

var fileBlockJoinMap = require('../transforms/map/patternFileBlockTuple'),
    fileBlockReduce = require('../transforms/reduce/assignFileIdsToBlockIds'),
    blockFileReduce = require('../transforms/reduce/assignBlockIdsToFileIds');

function getFileIdsPerBlock(files, blocks) {
    var joinMethod = fileBlockJoinMap.bind(null, blocks);
    return Immutable.fromJS(files.toArray()
        .map(joinMethod)
        .reduce(fileBlockReduce, {}));
}

function getBlockIdsPerFile(files, blocks) {
    var joinMethod = fileBlockJoinMap.bind(null, blocks);
    return Immutable.fromJS(files.toArray()
        .map(joinMethod)
        .reduce(blockFileReduce, {}));
}

function getFilesForBlockById(blockId, files, blocks) {
    return getFilesByIdList(files, blocks.getIn([blockId, 'fileIds']));
}

function getBlocksForFileById(fileId, files, blocks) {
    return getBlocksByIdList(blocks, files.getIn([fileId, 'blockIds']));
}

function getBlockSources(state, blockFiles, formatId, sourceId) {
    return state.getIn([formatId, sourceId])(blockFiles);
}

function getBlockSourcesFromCollection(collection, blockId, statePath) {
    var filterMethod = collection.getIn(['states'].concat(statePath));
    var blockFiles = getFilesByIdList(collection.get('files'), collection.getIn(['blocks', blockId, 'fileIds']));
    return filterMethod(blockFiles);
}

function addFileIds(blocks, files) {
    var fileMap = getFileIdsPerBlock(files, blocks);
    return blocks.map(function(block, blockName) {
        block = block.set('fileIds', fileMap.get(blockName));
        return block;
    });
}

function getBlocksByIdList(blocks, blockIdList) {
    return blockIdList.map(function(blockId) {
        return blocks.get(blockId);
    });
}

function addBlockIds(files, blocks) {
    var blockMap = getBlockIdsPerFile(files, blocks);
    return files.map(function(file, fileId) {
        file = file.set('blockIds', blockMap.get(fileId));
        return file;
    });
}

function getFilesByIdList(files, fileIdList) {
    return fileIdList.map(function(fileId) {
        return files.get(fileId);
    });
}

module.exports = {
    getFileIdsPerBlock: getFileIdsPerBlock,
    getBlockIdsPerFile: getBlockIdsPerFile,
    getFilesForBlockById: getFilesForBlockById,
    getBlocksForFileById: getBlocksForFileById,
    getBlockSources: getBlockSources,
    getBlockSourcesFromCollection: getBlockSourcesFromCollection,
    addFileIds: addFileIds,
    getBlocksByIdList: getBlocksByIdList,
    addBlockIds: addBlockIds,
    getFilesByIdList: getFilesByIdList
};
