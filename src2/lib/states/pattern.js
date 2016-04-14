'use strict';

var path = require('path');

var source = require('../transforms/source');

var Immutable = require('immutable');

function libJsEntryFilter(file){
    return file.get('ext') === '.js';
}

function libJsEntryTransform(ob, file) {
    ob = ob.set('path', path.join(path.sep, 'js', file.get('name')));
    return ob;
}


module.exports = function() {
    var libJsEntrySource = source(libJsEntryFilter, libJsEntryTransform);

    return Immutable.fromJS({
        'lib': {
            'js':{
                'entry': libJsEntrySource
            }
        }
    });
}
