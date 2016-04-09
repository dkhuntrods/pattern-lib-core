'use strict';

var _ = require('lodash'),
    createFilterCollection = require('./filters');

function jsRendererFileTest(blockName) {
    return function(file) {
        var fileName = file.getInfo().name,
            rendererTest = /^_([\w-]+)-renderer\.js$/;
        return rendererTest.test(fileName);
    };
}

function jsFileTest(blockName) {
    return function(file) {
        return blockName + '.js' === file.getInfo().name;
    };
}

function jsDataTest(blockName) {
    return function(file) {
        var fileName = file.getInfo().name;
        return fileName === 'data.js' || fileName === 'data.json';
    };
}



function jsEntryListFilter(blockName) {

    return function(fileList) {
        if (_.isEmpty(fileList)) return null;
        var hasRenderer = jsRendererFileTest(blockName),
            hasJs = jsFileTest(blockName),
            file;

        file = _.find(fileList, hasRenderer);
        if (!file) {
            file = _.find(fileList, hasJs);
        }
        return file;
    };
}

function jsDataListFilter(blockName) {
    return function(fileList) {
        if (_.isEmpty(fileList)) return null;
        return _.find(fileList, jsDataTest(blockName));
    };
}




function xslEntryFileTest(blockName) {
    return function(file) {
        var fileName = file.getInfo().name;
        return blockName + '.xsl' === fileName;
    };
}

function xslDataTest(blockName) {
    return function(file) {
        var fileName = file.getInfo().name;
        return blockName + '.xml' === fileName;
    };
}

function xslEntryListFilter(blockName) {
    return function(fileList) {
        if (_.isEmpty(fileList)) return null;
        return _.find(fileList, xslEntryFileTest(blockName));
    };
}

function xslDataListFilter(blockName) {
    return function(fileList) {
        if (_.isEmpty(fileList)) return null;
        return _.find(fileList, xslDataTest(blockName));
    };
}


module.exports = function(blockName) {
    var _formatFilters = {};

    function addFormatFilter(name) {
        _formatFilters[name] = createFilterCollection(name);
        return _formatFilters[name];
    }

    addFormatFilter('js')
        .addFilter('entry', jsEntryListFilter(blockName))
        .addFilter('data', jsDataListFilter(blockName));

    addFormatFilter('xsl')
        .addFilter('entry', xslEntryListFilter(blockName))
        .addFilter('data', xslDataListFilter(blockName));

    return {
        getFormatFilters: function getFormatFilter(name) {
            return _formatFilters[name].getFilters();
        },
        getFormatFilterWithType: function(name, type) {
            return _formatFilters[name].getFilter(type);
        },
        getAllFormatFilters: function (){
            return _.cloneDeep(_formatFilters);
        }
    };
};
