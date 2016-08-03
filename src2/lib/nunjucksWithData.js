'use strict';

var nunjucks = require('nunjucks'),
    _ = require('lodash'),
    Immutable = require('immutable');

function getFirstResultFromList(result) {
    if (!_.isEmpty(result) && !_.isEmpty(result[0])) return result[0];
    else return '';
}

module.exports = function(site, collection, connector) {

    var getOutputsByBlockId = connector.getOutputsByBlockIdFromCollection.bind(null, site, collection),
        getBlockNameByBlockId = connector.getBlockNameByBlockIdFromCollection.bind(null, collection),
        getBlockIdByBlockName = connector.getBlockIdByBlockNameFromCollection.bind(null, collection);

    var formatList = site.get('formats');

    var formatMap = Immutable.Map(formatList.reduce(function(memo, format) {
        memo[format.get('key')] = format;
        return memo;
    }, {}));

    var env = nunjucks.configure({ noCache: true });

    env.addFilter('blockNameFromId', function(blockId) {
        return getBlockNameByBlockId(blockId);
    });

    env.addFilter('blockIdFromName', function(blockName) {
        return getBlockIdByBlockName(blockName);
    });

    env.addFilter('xslDataPathFromBlockId', function(blockId) {
        return getFirstResultFromList(getOutputsByBlockId('xsl', 'data', blockId));
    });

    env.addFilter('xslEntryPathFromBlockId', function(blockId) {
        return getFirstResultFromList(getOutputsByBlockId('xsl', 'entry', blockId));
    });

    env.addFilter('getFormats', function(blockId) {
        return formatList.map(function(format) {
            return {
                key: format.get('key'),
                name: format.get('name')
            };
        }).toJS();
    });

    env.addFilter('renderFormatForBlockId', function(blockId, format, cb) {
        // console.log(format);
        var args = formatMap.getIn([format, 'state']).toJS();
        args = args.concat(blockId, function(err, result) {
            return cb(err, getFirstResultFromList(result));
        });
        var result = getOutputsByBlockId.apply(null, args);

        if (result) {
            setImmediate(function(){
                cb(null, getFirstResultFromList(result));
                cb = function(e, r){}; // prevent method being called twice by accident
            });
        }

    }, true);

    return env;
};
