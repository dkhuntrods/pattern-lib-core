'use strict';

var Immutable = require('immutable'),
    _ = require('lodash');

module.exports = function(name){
    var _sources = Immutable.Map();

    return {
        name: name,
        addSource: function(name, method){
            _sources = _sources.set(name, method);
            return this;
        },
        getSource: function(name){
            return _sources.get(name);
        },
        apply: function(files){

        }
    };
};
