'use strict';

var swig = require('swig'),
    path = require('path');

module.exports = function(collection, connector) {
    swig.setDefaults({
        cache: false
    });

    // swig.setFilter('getFormatUrlPathForType', function(blockName, formatName, type, addDefault){
    //     addDefault = (addDefault !== undefined) ? addDefault : true;
    //     var formatUrlPath = addDefault ? getBackupPathByType(formatName):'',
    //         formatType;

    //     formatType = getFormatWithType(blockName, formatName, type);
    //     // console.log(blockName, formatName, type, formatType, formatUrlPath);
    //     if (!formatType) return formatUrlPath;
    //     return formatType.path || formatUrlPath;
    // });
    return swig;
};
