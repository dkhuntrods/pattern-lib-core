'use strict';

var filewalker = require('filewalker'),
    path = require('path'),
    matter = require('gray-matter'),
    marked = require('marked'),
    _ = require('lodash'),
    gutil = require('gulp-util'),
    dir = require('node-dir'),
    fs = require('fs'),
    async = require('async'),
    util = require('util');


function getBlockData(blockPath) {
    var blockData = {};
    blockData.blockName = path.parse(blockPath).name;
    blockData.resolvedBlockName = blockPath;
    return blockData;
}

function getFileData(filePath) {
    var fsInfo = path.parse(filePath);
    var relativePath = path.relative(process.cwd(), filePath);
    var frontMatter = matter.read(filePath);
    var fileData = {};

    fileData.fsInfo = {
        name: fsInfo.base,
        resolvedName: filePath,
        dir: fsInfo.dir,
        absolutePath: filePath,
        relativePath: relativePath,
    };

    if (frontMatter.data) {
        if (frontMatter.data.page) {
            fileData.meta = frontMatter.data.page;
        }
        if (frontMatter.data.data) {
            fileData.data = frontMatter.data.data;
        }
        if (frontMatter.data.requires) {
            fileData.requires = frontMatter.data.requires;
        }
    }

    if (frontMatter.content) {
        if (fsInfo.ext === '.md') {
            fileData.content = marked(frontMatter.content);
        } else {
            fileData.content = frontMatter.content;
        }

    }
    return fileData;
}

function getBlockFileProcess(block, options) {
    return function processFile(filePath, fileCallback) {
        var fileData = getFileData(filePath),
            file = block.addFile(fileData.fsInfo.name, fileData.fsInfo.resolvedName);

        if (options.generateFileUrl) {
            file.setUrlPath(options.generateFileUrl(fileData.fsInfo.name, fileData.fsInfo.resolvedName))
        }

        file.addMeta(fileData.meta);
        file.addData(fileData.data);
        file.addContent(fileData.content);

        block.addMeta(fileData.meta);
        block.addData(fileData.data);
        block.addDependencies(fileData.requires);

        fileCallback();
    }
}

function getFileProcess(pageData, options) {
    return function processFile(filePath, fileCallback) {
        var fileData = getFileData(filePath),
            file = pageData.addFile(fileData.fsInfo.name, fileData.fsInfo.resolvedName);

        if (options.generateFileUrl) {
            file.setUrlPath(options.generateFileUrl(fileData.fsInfo.name, fileData.fsInfo.resolvedName))
        }
        // console.log('[fileInfo]', fileData.data);
        file.addMeta(fileData.meta);
        file.addData(fileData.data);
        file.addContent(fileData.content);

        fileCallback();
    }
}

function getFileIterator(fileFilter, processFile, processFileComplete, generateUrl) {

    return function(err, files) {
        if (err) return processFileComplete(err);
        files = files.filter(fileFilter);
        async.each(files, processFile, processFileComplete);
    }
}

function getBlockSubdirProcess(dataStore, options) {
    return function processSubdir(blockPath, subdirCallback) {
        var blockData = getBlockData(blockPath),
            block = dataStore.addBlock(blockData.blockName, blockData.resolvedBlockName),
            processFile = getBlockFileProcess(block, options),
            processFileComplete = function(err) {
                if (err) return subdirCallback(err);
                subdirCallback();
            };

        if (options.generateBlockUrl) {
            block.setUrlPath(options.generateBlockUrl(blockData.blockName, blockData.resolvedBlockName))
        }

        dir.files(blockPath, getFileIterator(options.filterFile, processFile, processFileComplete));
    }
}

function getProcessSubdirComplete(dataStore, callback) {
    return function processSubdirComplete(err) {
        if (err) return callback(err);
        // console.log('\n__________________');
        // console.log(util.inspect(dataStore.getAllData(), {
        //     showHidden: false,
        //     depth: null
        // }));
        // console.log('\n__________________');
        callback();
    }
}

function getSubDirIterator(processSubdir, processSubdirComplete, options) {

    return function subdirIterator(err, subdirs) {
        if (err) return processSubdirComplete(err);

        async.filter(subdirs, options.filterDir, function(results) {
            async.each(results, processSubdir, processSubdirComplete);
        });

    }
}

function getBlockInfo(fileSrc, dataStore, options) {

    return function(callback) {
        var processSubdir = getBlockSubdirProcess(dataStore, options),
            processSubdirComplete = getProcessSubdirComplete(dataStore, callback);

        dir.subdirs(fileSrc, getSubDirIterator(processSubdir, processSubdirComplete, options));
    };
}

function getFileInfo(fileSrc, dataStore, options) {
    return function(callback) {
        var processFile = getFileProcess(dataStore, options),
            processFileComplete = getProcessSubdirComplete(dataStore, callback);

        dir.files(fileSrc, getFileIterator(options.filterFile, processFile, processFileComplete));
    };
}

module.exports = {
    getBlockInfo: getBlockInfo,
    getFileInfo: getFileInfo
}