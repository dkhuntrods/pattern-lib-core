'use strict';

var Immutable = require('immutable'),
    _ = require('lodash');


function convertToMap(list){
    return Immutable.Map(list.reduce(function(ob, map){
        ob[map.get('resolvedName')] = map;
        return ob;
    }, {}));
}

module.exports = function(blockList){
    var _map = convertToMap(blockList),
        _files;
    return {
        getBlockByResolvedName(resolvedBlockName){
            return _map.get(resolvedBlockName);
        },
        updateBlocks(updater){
            // console.log('setting files', files);
            _map = _map.map(updater);

            // console.log(keys.toJS());
            // _map = _map.update(function(blockName, block){
            //     console.log('\nbn:', blockName, 'bl', block);
            //     // return block.set('files', Immutable.List(['ff_file.js']));
            // });
        },
        getBlocks: function(){
            return _map;
        },
        getBlockNames: function(){
            return _map.keySeq().toList();
        }
    };
};
