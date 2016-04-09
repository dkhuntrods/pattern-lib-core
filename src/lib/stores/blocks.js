'use strict';

var _ = require('lodash'),
    path = require('path');

var createBlock = require('./block');

module.exports = function() {
    var blocks = {};

    function getBlock(name) {
        return blocks[name];
    }

    function getBlockListFromArgs(names) {
        return (names && names.length) ? _.map(names, getBlock) : blocks;
    }

    function getBlockNameListFromArgs(names) {
        return (names && names.length) ? names : blocks.map(function(block) {
            return block.name;
        });
    }

    function getBlocks(names) {
        var blocklist = getBlockListFromArgs(names);

        return _.reduce(blocklist, function(arr, block, index) {
            try {
                var info = block.getInfo();
                if (info && !_.isEmpty(info)) arr.push(info);
                return arr;
            } catch (e) {
                throw new Error('Block named \'' + names[index] + '\' could not be found');
            }
        }, []);
    }

    function getBlockListRequires(names) {
        var initialList = getBlockNameListFromArgs(names);
        var blocklist = getBlockListFromArgs(names);

        return _.difference(_.reduce(blocklist, function(depsList, block, index) {
            try {
                depsList = _.union(depsList, block.getDependencies());
                return depsList;
            } catch (e) {
                throw new Error('Block named \'' + names[index] + '\' could not be found');
            }
        }, []), initialList);
    }

    function getAllFormatsWithType(formatType, names) {
        var blocklist = getBlockListFromArgs(names);

        return _.reduce(blocklist, function(arr, block, index) {
            try {
                var format = block.getFormat(formatType);
                if (format && !_.isEmpty(format)) arr.push(format);
                return arr;
            } catch (e) {
                throw new Error('Format with type \''+formatType+ '\' for \'' + block.name + '\' could not be found');
            }

        }, []);
    }

    function addBlock(name, resolvedname) {
        blocks[name] = createBlock(name, resolvedname);
        return blocks[name];
    }

    return {
        name: 'blocks',
        addBlock: function(name, resolvedname) {
            var block = getBlock(name) || addBlock(name, resolvedname);
            block.clearData();
            return block;
        },
        getBlock: function(name) {
            return getBlock(name);
        },
        getAllBlocks: function( /* (optional) Array of names */ ) {
            var args = Array.prototype.slice.call(arguments);
            return getBlocks(args[0]);
        },
        getAllRequires: function( /* (optional) Array of names */ ) {
            var args = Array.prototype.slice.call(arguments);
            return getBlockListRequires(args[0]);
        },
        getAllFormatEntriesWithType: function(formatType /*, (optional) Array of names */ ) {
            var args = Array.prototype.slice.call(arguments);
            formatType = args[0];
            return getAllFormatsWithType(formatType, args[1]).reduce(function(arr, format) {
                if (format && !_.isEmpty(format.entry)){
                    arr.push(format.entry);
                }
                return arr;
            }, []);
        },
        getAllFormatsWithType: function(formatType){
            return getAllFormatsWithType(formatType, null);
        }
    };
};
