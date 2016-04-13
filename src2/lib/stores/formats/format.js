'use strict';

var Immutable = require('immutable'),
    _ = require('lodash');

module.exports = function(name){
    var _states = Immutable.Map(),
    _currentState;
    return {
        name: name,
        addState: function(name, state){
            _states = _states.set(name, state);
        },
        getState: function(name){
            return _states.get(name);
        },
        setState: function(name){
            _currentState = this.getState(name);
        },
        applyToBlock: function(block) {

        }
    };
};
