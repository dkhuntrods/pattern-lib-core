'use strict';

var Immutable = require('immutable');

var fileBlockJoinMap = require('../transforms/map/patternFileBlockTuple'),
    fileBlockReduce = require('../transforms/reduce/assignFileIdsToBlockIds'),
    blockFileReduce = require('../transforms/reduce/assignBlockIdsToFileIds');

function getCollectionPath(collection, path, name) {
    name = name || 'transform';
    var transform = collection.getIn(path);
    if (!transform) throw new Error('\nNo ' + name + ' found for path \'' + path.join(', ') +
        '\'\nIf state, check that a file lives at this location within \'src/data/collection/states/outputs/lib/*\'');
    return transform;
}

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
    return getBlocksByIdList(collection.get('blocks'), getCollectionPath(collection, ['files', fileId, 'blockIds']));
}

// function getBlockOutputs(state, blockFiles, formatId, sourceId) {
//     return state.getIn([formatId, sourceId])(blockFiles);
// }

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
        statePath = ['states'].concat(args, 'filter'),
        filterFunc = getCollectionPath(collection, statePath);

    var filter = filterFunc.bind(null, site, collection);
    // console.log(filter, collection.get('files').toJS());
    return collection.get('files').filter(filter).keySeq().toArray();
}

function getBlockNameFromId(collection, blockId) {
    return getCollectionPath(collection, ['blocks', blockId, 'name']);
}


function getBlockIdFromName(collection, blockName) {
    return collection.get('blocks').filter(function(block) {
        return block.get('name') === blockName;
    }).first().get('id');
}


function getBlockOutputsFromCollection( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), blockId, onComplete */ ) {
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

    var transform = getCollectionPath(collection, statePath);

    var filesIds = getCollectionPath(collection, ['blocks', blockId, 'fileIds'], 'fileIds');

    var blockFiles = getFilesByIdList(collection.get('files'), filesIds);
    return transform(site, collection, blockFiles, onComplete);
}

function getOutputsFromCollectionByFormat(/* site, collection, statePathSeg, (...statePathSeg, statePathSeg), onComplete */ ) {
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

    var transform = getCollectionPath(collection, statePath);

    var blockFiles = collection.get('files');
    console.log(blockFiles.size);

    return transform(site, collection, blockFiles, onComplete);
}

function getFileOutputsByAbsolutePath( /* site, collection, statePathSeg, (...statePathSeg, statePathSeg), filePath, onComplete */ ) {
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

    var transform = getCollectionPath(collection, statePath);

    var file = collection.get('files').filter(function(file) {
        return file.get('absolutePath') === filePath;
    });

    return transform(site, collection, file, onComplete);
}


module.exports = {
    getFileIdsPerBlock: getFileIdsPerBlock,
    getBlockIdsPerFile: getBlockIdsPerFile,
    getBlockNameFromId: getBlockNameFromId,
    getBlockIdFromName: getBlockIdFromName,
    getFilesForBlockById: getFilesForBlockById,
    // getBlocksForFileById: getBlocksForFileById,
    // getBlockOutputs: getBlockOutputs,

    addFileIds: addFileIds,
    getBlocksByIdList: getBlocksByIdList,
    addBlockIds: addBlockIds,
    getFilesByIdList: getFilesByIdList,
    getFileIdListByFormat: getFileIdListByFormat,

    getFileOutputsByAbsolutePath: getFileOutputsByAbsolutePath,
    getBlockOutputsFromCollection: getBlockOutputsFromCollection,
    getBlocksByFileIdFromCollection: getBlocksByFileIdFromCollection,
    getOutputsFromCollectionByFormat: getOutputsFromCollectionByFormat,
};
