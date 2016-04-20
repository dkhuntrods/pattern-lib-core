'use strict';

var nunjucks = require('nunjucks'),
    _ = require('lodash'),
    path = require('path');

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
        var result = getBlockOutputsFromCollection('xsl', 'data', blockId);
        if (!_.isEmpty(result)) return result;
        else return '';
    });

    env.addFilter('xslEntryPathFromBlockId', function(blockId){
        var result = getBlockOutputsFromCollection('xsl', 'entry', blockId);
        if (!_.isEmpty(result)) return result;
        else return '';
    });

    return env;
};
