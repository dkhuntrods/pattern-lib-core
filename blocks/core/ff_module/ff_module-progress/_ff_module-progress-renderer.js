'use strict';

var React = require('react'),
    ReactDOM = require('react-dom');


var Progress = require('../../ff_module/ff_module-progress/ff_module-progress.js'),
    selector = 'data-ff_module-progress';

var data = {
    id: 1,
    classes: "ff_module-other-module-class ff_utils-other-class",
    sent_to: 23,
    no_excused: 2,
    completed_by: 20,
    marked: 3
};

module.exports = function() {
    document.addEventListener('DOMContentLoaded', function(event) {
        Array.prototype.forEach.call(document.querySelectorAll('[' + selector + ']'), function(domElement) {
            if (domElement) {
                ReactDOM.render(React.createElement(Progress, data), domElement);
            }
        });
    });
};
