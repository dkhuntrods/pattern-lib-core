'use strict';

var _ = require('lodash'),
    path = require('path'),
    createFile = require('./file');

module.exports = function() {

    var files = {};

    function getFile(name) {
        return files[name];
    }

    function getFiles(names) {
        var filelist = (names.length) ? _.map(names, getFile) : files;

        return _.reduce(filelist, function(arr, file) {
            arr.push(file.getInfo());
            return arr;
        }, []);
    }

    function addFile(name, resolvedname) {
        files[name] = createFile(name, resolvedname);
        return files[name];
    }

    return {
        name: 'pages',
        addFile: function(name, resolvedname) {
            var block = getFile(name) || addFile(name, resolvedname);
            return block;
        },
        getFile: function(name) {
            return getFile(name);
        },
        getAllPages: function( /* (optional) Array of names */ ) {
            var args = Array.prototype.slice.call(arguments);
            return getFiles(args);
        },
        getAllFormatEntriesWithType: function(){
            return 'files';
        },
        getAllFormatsWithType: function(formatType){
            return 'files';
        }
    };
};
