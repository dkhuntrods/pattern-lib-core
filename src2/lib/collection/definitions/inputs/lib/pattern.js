'use strict';

var Immutable = require('immutable');

var patternBlockMap = require('../../../../transforms/map/block'),
    patternBlockFilter = require('../../../../transforms/filters/patternBlock'),
    createBlockStore = require('../../../../stores/blocks');

module.exports = Immutable.Map({
    id: 'pattern',
    map: patternBlockMap,
    filter: patternBlockFilter,
    store: createBlockStore
});
