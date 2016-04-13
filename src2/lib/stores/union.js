'use strict';

module.exports = function(files, blocks, formats) {
    var _blocks = blocks,
        _files = files,
        _formats = formats;

    return {
        getFilesForBlockById: function(blockId){
            return _files.getFilesByIdList(_blocks.getById(blockId).get('fileIds'));
        },
        getBlocksForFileById: function(fileId) {
            return _blocks.getBlocksByIdList(_files.getById(fileId).get('blockIds'));
        }
    }
}
