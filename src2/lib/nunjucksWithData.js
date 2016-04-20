'use strict';

var nunjucks = require('nunjucks'),
    path = require('path');

module.exports = function(site, collection, connector) {

    var getBlockOutputsFromCollection = connector.getBlockOutputsFromCollection.bind(null, site, collection);

    var env = nunjucks.configure({ noCache: true });

    env.addFilter('blockNameFromId', function(blockId) {
        return connector.getBlockNameFromId(collection, blockId);
    });

    env.addFilter('xmlDataPathFromBlockId', function(blockId) {
        // console.log('>',getBlockOutputsFromCollection('xml','data','path', blockId));
        // return 'n';
        return getBlockOutputsFromCollection('xml', 'data', 'path', blockId);
    });

    return env;
};
