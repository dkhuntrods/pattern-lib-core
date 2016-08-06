'use strict';

var Immutable = require('immutable'),
    path = require('path');

var patternBlockMap = require(path.resolve('src2/data/transforms/map/block')),
    patternBlockFilter = require(path.resolve('src2/data/transforms/filters/patternBlock')),
    createBlockStore = require(path.resolve('src2/data/stores/blocks'));

module.exports = Immutable.Map({
    id: 'pattern',
    map: patternBlockMap,
    filter: patternBlockFilter,
    store: createBlockStore
});
