'use strict';
var Immutable = require('immutable');

module.exports = function(name, filter, transform){

    return Immutable.Map({
        name: name,
        filter: filter,
        transform: transform
    });
};
