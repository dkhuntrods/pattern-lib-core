'use strict';

module.exports = function() {

    return {

        getFilesForBlockById: function(blockId, files, blocks){
            return this.getFilesByIdList(files, blocks.getIn([blockId,'fileIds']));
        },
        getBlocksForFileById: function(fileId, files, blocks) {
            return this.getBlocksByIdList(blocks, files.getIn([fileId,'blockIds']));
        },
        getBlockSources: function(state, blockFiles, formatId, sourceId){
            return state.getIn([formatId, sourceId, 'apply'])(blockFiles);
        },
        addFileIds: function(blocks, fileMap){
            return blocks.map(function(block, blockName){
                block = block.set('fileIds', fileMap.get(blockName));
                return block;
            });
        },
        getBlocksByIdList: function(blocks, blockIdList) {
            return blockIdList.map(function(blockId) {
                return blocks.get(blockId);
            });
        },
        addBlockIds: function(files, blockMap){
            return files.map(function(file, fileId){
                file = file.set('blockIds', blockMap.get(fileId));
                return file;
            });
        },
        getFilesByIdList: function(files, fileIdList) {
            return fileIdList.map(function(fileId) {
                return files.get(fileId);
            });
        }
    }
}
