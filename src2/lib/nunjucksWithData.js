'use strict';

var nunjucks = require('nunjucks'),
    path = require('path');

module.exports = function(collection, connector) {

    var env = nunjucks.configure({noCache:true});

    env.addFilter('blockNameFromId', function(blockId){
        return connector.getBlockNameFromId(collection, blockId);
    });

    return env;
};
