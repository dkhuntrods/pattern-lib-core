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

// function getBlocksForFileById(fileId, files, blocks) {
//     return getBlocksByIdList(blocks, files.getIn([fileId, 'blockIds']));
// }

function getBlocksByFileIdFromCollection(collection, fileId){
    return getBlocksByIdList(collection.get('blocks'), collection.getIn(['files',fileId, 'blockIds']));
}

// function getBlockSources(state, blockFiles, formatId, sourceId) {
//     return state.getIn([formatId, sourceId])(blockFiles);
// }

function getBlockSourcesFromCollection(site, collection, blockId, statePath) {
    var transform = collection.getIn(['states'].concat(statePath).concat('apply'));
    var blockFiles = getFilesByIdList(collection.get('files'), collection.getIn(['blocks', blockId, 'fileIds']));
    return transform(site, collection, blockFiles);
}

function getFileSourcesById(site, collection, fileId, statePath) {
    var transform = collection.getIn(['states'].concat(statePath).concat('apply'));
    var file = Immutable.List([(collection.getIn(['files', fileId]))]);
    return transform(site, collection, file);
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

function getFileListByFormat(site, collection, statePath){
    var filter = collection.getIn(['states'].concat(statePath).concat(['filter'])).bind(null, site, collection);
    // console.log(filter, collection.get('files').toJS());
    return collection.get('files').filter(filter);
}

module.exports = {
    getFileIdsPerBlock: getFileIdsPerBlock,
    getBlockIdsPerFile: getBlockIdsPerFile,
    getFilesForBlockById: getFilesForBlockById,
    // getBlocksForFileById: getBlocksForFileById,
    // getBlockSources: getBlockSources,
    getBlockSourcesFromCollection: getBlockSourcesFromCollection,
    getBlocksByFileIdFromCollection: getBlocksByFileIdFromCollection,
    addFileIds: addFileIds,
    getBlocksByIdList: getBlocksByIdList,
    addBlockIds: addBlockIds,
    getFilesByIdList: getFilesByIdList,
    getFileListByFormat: getFileListByFormat,
    getFileSourcesById: getFileSourcesById
};
