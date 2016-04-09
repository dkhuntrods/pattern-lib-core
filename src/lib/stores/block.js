'use strict';

var _ = require('lodash'),
    path = require('path');

var createFile = require('./file'),
    // createFormat = require('./format'),
    createFormatFilters = require('./formatFilters'),
    createFormatTransforms = require('./formatTransforms');


function getFiles(ob, file, key) {
    ob[key] = file.getInfo();
    return ob;
}

function getFormats(blockName) {
    var _formatFilters = createFormatFilters(blockName),
        _formatTransforms = createFormatTransforms(blockName);

    return function(formatType) {
        return function(files) {

            var filters = _formatFilters.getFormatFilters(formatType);
            var transforms = _formatTransforms.getFormatTransforms(formatType);

            var formats = Object.keys(filters).reduce(function(ob, key) {
                var result = filters[key](files);
                if (result) {
                    result = transforms[key](result);
                    if (result && !_.isEmpty(result)) ob[key] = result;
                }
                return ob;
            }, {});
            return !_.isEmpty(formats) ? formats : null;
        };
    };

}

function createBlock(name, resolvedname) {
    var _name = name,
        _resolvedname = resolvedname,
        _files = {},
        _meta = {},
        _dependencies = [],
        _data = [],
        _urlPath = path.join(resolvedname, name + '.html'),
        // _formatFilters = createFormatFilters(name),
        // _formatTransforms = createFormatTransforms(name),
        _formats = getFormats(name);


    var block = {
        name: _name,
        addFile: function(name, resolvedname) {
            var file = this.getFile(name);
            if (!file) {
                file = createFile(name, resolvedname);
                _files[name] = file;
            }

            return file;
        },
        addDependencies: function(dependencies) {
            if (!dependencies) return this;
            _dependencies = _.union(_dependencies, [].concat(dependencies));
            return this;
        },
        addMeta: function(meta) {
            if (!meta) return this;
            _meta = _.assign({}, _meta, meta);
            return this;
        },
        addData: function(data) {
            if (!data) return this;
            _data = _.union(_data, [].concat(data));
            return this;
        },
        setUrlPath: function(urlPath) {
            _urlPath = urlPath;
            return this;
        },
        getFile: function(name) {
            return _files[name];
        },
        getDependencies: function() {
            return _.cloneDeep(_dependencies);
        },
        getInfo: function() {
            return {
                name: _name,
                resolvedname: _resolvedname,
                urlPath: _urlPath,
                files: _.reduce(_files, getFiles, {}),
                requires: this.getDependencies(),
                meta: this.getMeta(),
                data: this.getData()
            };
        },
        getMeta: function() {
            return _.cloneDeep({}, _meta);
        },
        getData: function() {
            if (_data && _data.length) return [].concat(_data);
            return _.cloneDeep({}, _data);
        },

        getFormat: function(formatType) {

            var getFormatsFromFiles = _formats(formatType);

            return getFormatsFromFiles(_files);
            // var formats = Object.keys(filters).reduce(function(ob, key) {
            //     var result = filters[key](_files);
            //     if (result) {
            //         result = transforms[key](result);
            //         if (result && !_.isEmpty(result)) ob[key] = result;
            //     }
            //     return ob;
            // }, {});
            // return !_.isEmpty(formats) ? formats : null;
        },
        generateFormats: function() {

        },
        clearData: function() {
            _data = [];
        }
    };
    return block;
}

module.exports = createBlock;
