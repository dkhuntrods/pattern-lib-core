'use strict';

var swig = require('swig'),
path = require('path');

function getBackupInfo(ext) {
    return {
        relativePath: 'src/templates/default' + ext
    };
}
function getBackupPathByType(type) {
    return 'src/templates/default.' + type;
}


module.exports = function(blockStore, pageStore) {
    swig.setDefaults({
        cache: false
    });


    function getFormatWithType(blockName, formatName, type) {
        var format, block;
        type = type || 'entry';
        block = blockStore.getBlock(blockName);
        if (!block) return null;
        format = block.getFormat(formatName);
        if (!format) return null;
        // console.log(blockName, formatName, formatType, formatUrlPath);
        return format[type] || null;
    }

    swig.setFilter('getFormatUrlPathForType', function(blockName, formatName, type, addDefault){
        addDefault = (addDefault !== undefined) ? addDefault : true;
        var formatUrlPath = addDefault ? getBackupPathByType(formatName):'',
            formatType;

        formatType = getFormatWithType(blockName, formatName, type);
        // console.log(blockName, formatName, type, formatType, formatUrlPath);
        if (!formatType) return formatUrlPath;
        return formatType.path || formatUrlPath;
    });

    swig.setFilter('getFormatReferenceForType', function(blockName, formatName, type){
        var formatReferenceForType = '', formatType;

        formatType = getFormatWithType(blockName, formatName, type);
        // console.log(blockName, formatName, formatType);
        if (!formatType) return formatReferenceForType;
        return formatType.reference || formatReferenceForType;
    });

    return swig;
};
