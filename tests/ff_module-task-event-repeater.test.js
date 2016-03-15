'use strict';

var React = require('react');
require('./lib/utils').bootstrapBrowser();
var TestUtils = require('react-addons-test-utils');
var expect = require('chai').expect;

var TaskEventRepeater = require('../blocks/core/ff_module/ff_module-task-event-repeater/ff_module-task-event-repeater');
var eventTypes = require('../blocks/core/ff_module/ff_module-task-event/_src/events').types;

var events = [{
    type: eventTypes.setTask,
    localEventId: 1,
    sent: '20:40',
    author: { name: 'Sally Student' },
    taskTitle: 'Write an Essay'
}, {
    type: eventTypes.stampResponseAsSeen,
    localEventId: 2,
    sent: '21:47',
    author: { name: 'Terry Teacher' }
}];

describe('TaskEventRepeater', function() {
    var component;

    before(function() {
        var element = React.createElement(TaskEventRepeater, { events: events });
        component = TestUtils.renderIntoDocument(element);
    });

    it('should render', function() {
        expect(component).to.exist;
    });

    it('should have ' + events.length + ' items', function() {
        var items = TestUtils.scryRenderedDOMComponentsWithTag(component, 'li');
        expect(items.length).to.equal(events.length);
    });

});