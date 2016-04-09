'use strict';

var _ = require('lodash');

function createFilterCollection(name) {
    if (!name) throw new Error('\'name\' param required in format filter');
    var _name = name,
        _filters = {};

    return {
        name: _name,
        addFilter: function(type, method) {
            _filters[type] = method;
            return this;
        },
        getFilter: function(type) {
            return _filters[type] || function(fileList) {
                return null;
            };
        },
        getFilters: function(){
            return _.cloneDeep(_filters);
        }
    };
}

module.exports = createFilterCollection;
