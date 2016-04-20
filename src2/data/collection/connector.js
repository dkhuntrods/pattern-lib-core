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

function getBlocksByFileIdFromCollection(collection, fileId) {
    return getBlocksByIdList(collection.get('blocks'), collection.getIn(['files', fileId, 'blockIds']));
}

// function getBlockOutputs(state, blockFiles, formatId, sourceId) {
//     return state.getIn([formatId, sourceId])(blockFiles);
// }

function getBlockOutputsFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), blockId */ ) {
    var args = Array.prototype.slice.call(arguments),
        blockId = args.pop(),
        site = args.shift(),
        collection = args.shift(),
        statePath = ['states'].concat(args, 'apply');

    // console.log(blockId, statePath);
    var transform = collection.getIn(statePath);
    // console.log('   ', transform);
    var blockFiles = getFilesByIdList(collection.get('files'), collection.getIn(['blocks', blockId, 'fileIds']));
    return transform(site, collection, blockFiles);
}

// function getFileOutputsById(site, collection, statePath, fileId) {
//     var transform = collection.getIn(['states'].concat(statePath).concat('apply'));
//     var file = Immutable.List([(collection.getIn(['files', fileId]))]);
//     return transform(site, collection, file);
// }

function getFileOutputsByAbsolutePath( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), filePath */ ) {
    var args = Array.prototype.slice.call(arguments),
        filePath = args.pop(),
        site = args.shift(),
        collection = args.shift(),
        statePath = ['states'].concat(args, 'apply');

    var transform = collection.getIn(statePath);
    var file = collection.get('files').filter(function(file) {
        return file.get('absolutePath') === filePath;
    });
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

function getFileIdListByFormat( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg) */ ) {
    var args = Array.prototype.slice.call(arguments),
        site = args.shift(),
        collection = args.shift(),
        statePath = ['states'].concat(args, 'filter');

    var filter = collection.getIn(statePath).bind(null, site, collection);
    // console.log(filter, collection.get('files').toJS());
    return collection.get('files').filter(filter).keySeq().toArray();
}

function getBlockNameFromId(collection, blockId) {
    return collection.getIn(['blocks', blockId, 'name']);
}

module.exports = {
    getFileIdsPerBlock: getFileIdsPerBlock,
    getBlockIdsPerFile: getBlockIdsPerFile,
    getBlockNameFromId: getBlockNameFromId,
    getFilesForBlockById: getFilesForBlockById,
    // getBlocksForFileById: getBlocksForFileById,
    // getBlockOutputs: getBlockOutputs,
    getBlockOutputsFromCollection: getBlockOutputsFromCollection,
    getBlocksByFileIdFromCollection: getBlocksByFileIdFromCollection,
    addFileIds: addFileIds,
    getBlocksByIdList: getBlocksByIdList,
    addBlockIds: addBlockIds,
    getFilesByIdList: getFilesByIdList,
    getFileIdListByFormat: getFileIdListByFormat,
    // getFileOutputsById: getFileOutputsById,
    getFileOutputsByAbsolutePath: getFileOutputsByAbsolutePath
};
