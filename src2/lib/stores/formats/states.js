'use strict';

var Immutable = require('immutable'),
    _ = require('lodash');

module.exports = function(name){
    var _sources = Immutable.Map();

    return {
        name: name,
        addSource: function(name, source){
            _sources = _sources.set(name, source);
            return this;
        },
        getSource: function(name){
            return _sources.get(name);
        },
        apply: function(files){

        }
    };
};
