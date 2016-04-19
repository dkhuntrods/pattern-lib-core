'use strict';
var React = require('react'),
    ReactDOM = require('react-dom');

var TaskEvent = require('./ff_module-task-event');
var dStrings = ['27 Feb 2016 03:24:00', '27 Feb 2016 03:28:00', '28 Feb 2016 13:24:00'];
var eventTypes = require('./_src/events').types;

var events = [{
    type: eventTypes.setTask,
    sent: new Date(dStrings[0]),
    author: { name: 'Sally Student' },
    taskTitle: 'Write an Essay',
}];

module.exports = function() {
    document.addEventListener('DOMContentLoaded', function(evnt) {

        Array.prototype.forEach.call(document.querySelectorAll('[data-ff_module-task-event]'), function(domElement, index) {
            var root = React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } }, events.map(function(event) {
                return React.createElement('li', { style: { listStyle: 'none', margin: 0, padding: 0, marginBottom: '5px' } },
                    React.createElement(TaskEvent, {
                        key: 'el' + (index),
                        event: event,
                        actions: [{
                            text: 'Edit',
                            onClick: function(){console.log('edit');}
                        },{
                            text: 'Delete',
                            onClick: function(){console.log('delete');}
                        }]
                    }));
            }));
            ReactDOM.render(root, domElement);
        });
    });
};
