'use strict';

var nunjucks = require('nunjucks'),
    _ = require('lodash'),
    path = require('path');

function getFirstResultFromList(result) {
    if (!_.isEmpty(result) && !_.isEmpty(result[0])) return result[0];
    else return '';
}

module.exports = function(site, collection, connector) {

    var getOutputsByBlockId = connector.getOutputsByBlockIdFromCollection.bind(null, site, collection),
        getBlockNameByBlockId = connector.getBlockNameByBlockIdFromCollection.bind(null, collection),
        getBlockIdByBlockName = connector.getBlockIdByBlockNameFromCollection.bind(null, collection);

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

    env.addFilter('xslEntryPathFromBlockId', function(blockId){
        return getFirstResultFromList(getOutputsByBlockId('xsl', 'entry', blockId));
    });

    env.addFilter('renderXSL', function(blockId, cb) {
        getOutputsByBlockId('xsl', 'block', blockId, function(err, result) {
            return cb(err, getFirstResultFromList(result));
        });

    }, true);

    return env;
};
