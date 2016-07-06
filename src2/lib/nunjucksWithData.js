'use strict';

var nunjucks = require('nunjucks'),
    _ = require('lodash'),
    path = require('path');

function getFirstResultFromList(result) {
    if (!_.isEmpty(result) && !_.isEmpty(result[0])) return result[0];
    else return '';
}

module.exports = function(site, collection, connector) {

    var getBlockOutputsFromCollection = connector.getBlockOutputsFromCollection.bind(null, site, collection);

    var env = nunjucks.configure({ noCache: true });

    env.addFilter('blockNameFromId', function(blockId) {
        return connector.getBlockNameFromId(collection, blockId);
    });

    env.addFilter('blockIdFromName', function(blockName) {
        return connector.getBlockIdFromName(collection, blockName);
    });

    env.addFilter('xslDataPathFromBlockId', function(blockId) {
        return getFirstResultFromList(getBlockOutputsFromCollection('xsl', 'data', blockId));
    });

    env.addFilter('xslEntryPathFromBlockId', function(blockId){
        return getFirstResultFromList(getBlockOutputsFromCollection('xsl', 'entry', blockId));
    });

    env.addFilter('renderXSL', function(blockId, cb) {
        getBlockOutputsFromCollection('xsl', 'block', blockId, function(err, result) {
            return cb(err, getFirstResultFromList(result));
        });

    }, true);

    return env;
};
