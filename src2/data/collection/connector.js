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

// function getFilesForBlockById(blockId, files, blocks) {
//     return getFilesByFileIdList(files, blocks.getIn([blockId, 'fileIds']));
// }

function getFileIdsPerBlock(files, blocks) {
    var joinMethod = fileBlockJoinMap.bind(null, blocks);
    return Immutable.fromJS(files.toArray()
        .map(joinMethod)
        .reduce(fileBlockReduce, {}));
}

// function getBlocksForFileById(fileId, files, blocks) {
//     return getBlocksByBlockIdList(blocks, files.getIn([fileId, 'blockIds']));
// }



// function getBlockOutputs(state, blockFiles, formatId, sourceId) {
//     return state.getIn([formatId, sourceId])(blockFiles);
// }

function getFileIdListByFormatFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg) */ ) {
    var args = Array.prototype.slice.call(arguments),
        site = args.shift(),
        collection = args.shift(),
        statePath = ['states'].concat(args, 'filter'),
        filterFunc = getStorePath(collection, statePath);

    var filter = filterFunc.bind(null, site, collection);
    // console.log(filter, collection.get('files').toJS());
    return collection.get('files').filter(filter).keySeq().toArray();
}

function getBlockNameByBlockIdFromCollection(collection, blockId) {
    return getStorePath(collection, ['blocks', blockId, 'name']);
}


function getBlockIdByBlockNameFromCollection(collection, blockName) {
    return collection.get('blocks').filter(function(block) {
        return block.get('name') === blockName;
    }).first().get('id');
}


function getOutputsByBlockIdFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), blockId, onComplete */ ) {
    var args = Array.prototype.slice.call(arguments),
        onComplete, blockId,
        statePath,
        site = args.shift(),
        collection = args.shift(),
        finalArg = args.pop();

    if (typeof finalArg === 'function') {
        onComplete = finalArg;
        blockId = args.pop();
    } else {
        blockId = finalArg;
    }

    statePath = ['states'].concat(args, 'apply');

    var transform = getStorePath(collection, statePath);
    var fileIds = getStorePath(collection, ['blocks', blockId, 'fileIds'], 'fileIds');
    var blockFiles = getFilesByFileIdList(collection.get('files'), fileIds);
    return transform(site, collection, blockFiles, onComplete);
}

function getOutputsByFormatFromCollection(/* site, collection, statePathSeg, (...statePathSeg, statePathSeg), onComplete */ ) {
    var args = Array.prototype.slice.call(arguments),
        onComplete,
        statePath,
        site = args.shift(),
        collection = args.shift(),
        finalArg = args.pop();

    if (typeof finalArg === 'function') {
        onComplete = finalArg;
    } else {
        args.push(finalArg);
    }

    statePath = ['states'].concat(args, 'apply');

    var transform = getStorePath(collection, statePath);
    var blockFiles = collection.get('files');
    return transform(site, collection, blockFiles, onComplete);
}

function getOutputsByFileAbsolutePathFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), filePath, onComplete */ ) {
    var args = Array.prototype.slice.call(arguments),
        filePath, onComplete,
        statePath,
        site = args.shift(),
        collection = args.shift(),
        finalArg = args.pop();

    if (typeof finalArg === 'function') {
        onComplete = finalArg;
        filePath = args.pop();
    } else {
        filePath = finalArg;
    }

    statePath = ['states'].concat(args, 'apply');

    var transform = getStorePath(collection, statePath);
    var blockFiles = getFilesByAbsoluteFilePathFromCollection(collection, filePath);
    return transform(site, collection, blockFiles, onComplete);
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
    // getFilesForBlockById: getFilesForBlockById,
    // getBlocksForFileById: getBlocksForFileById,
    // getBlockOutputs: getBlockOutputs,



    getFileIdListByFormatFromCollection: getFileIdListByFormatFromCollection,
    getBlocksByFileIdFromCollection: getBlocksByFileIdFromCollection,

    getOutputsByFileAbsolutePathFromCollection: getOutputsByFileAbsolutePathFromCollection,
    getOutputsByBlockIdFromCollection: getOutputsByBlockIdFromCollection,
    getOutputsByFormatFromCollection: getOutputsByFormatFromCollection,
};
