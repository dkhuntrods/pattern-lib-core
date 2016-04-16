'use strict';

module.exports = function camelCase(input) {
    return input.toLowerCase().replace(/[-_]+(.)?/g, function(match, group1) {
        return group1.toUpperCase();
    });
};
