'use strict';

var _ = require('lodash');

function createTransformCollection(name) {
    if (!name) throw new Error('\'name\' param required in format transform');
    var _name = name,
        _transforms = {};

    return {
        name: _name,
        addTransform: function(type, method) {
            _transforms[type] = method;
            return this;
        },
        getTransform: function(type) {
            return _.cloneDeep(_transforms[type]);
        },
        getTransforms: function(){
            return _.cloneDeep(_transforms);
        }
    };
}

module.exports = createTransformCollection;
