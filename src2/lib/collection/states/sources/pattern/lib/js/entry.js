'use strict';

var path = require('path');

var source = require('../../../../../../transforms/map/source');

function filter(file){
    return file.get('ext') === '.js';
}

function transform(ob, file) {
    ob = ob.set('path', path.join(path.sep, 'js', file.get('name')));
    return ob;
}

module.exports = source(filter, transform);
