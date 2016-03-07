'use strict';

var React = require('react');
require('./lib/utils').bootstrapBrowser();

var TestUtils = require('react-addons-test-utils'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    getTestFramework = require('./lib/framework').setUpTestFramework(React, TestUtils, expect);

var ProfileResponseButton = require("../blocks/core/ff_module/ff_module-profile-response-button/ff_module-profile-response-button.js"),
    eventTypes = require('../blocks/core/ff_module/ff_module-task-event/_src/events').types,
    dateFormatting = require('../blocks/core/_lib/_ui/dateFormatting')();

var buttonProps = [{
        onSelect: sinon.spy(),
        isSelected: false,
        isRead: true,
        label: "Sally Student",
        markAndGrade: {
            mark: 7,
            markMax: 10,
            grade: "A"
        },
        event: {
            type: eventTypes.markAndGrade,
            sent: new Date()
        },
        pic_href: "/images/default_picture.png"
    }, {
        onSelect: sinon.spy(),
        isSelected: true,
        isRead: true,
        label: "Terry Teacher",
        markAndGrade: {
            mark: 7,
            markMax: 10
        },
        event: {
            type: eventTypes.requestResubmission,
            sent: new Date()
        },
        pic_href: "/images/default_picture.png"
    }, {
        onSelect: sinon.spy(),
        isSelected: true,
        isRead: false,
        label: "Terry Trilobite",
        event: {
            type: eventTypes.requestResubmission,
            sent: new Date()
        },
        pic_href: "/images/default_picture.png"
    }, {
        onSelect: sinon.spy(),
        isSelected: false,
        isRead: false,
        label: "Joshua Teacher",
        markAndGrade: {
            grade: 'A'
        },
        event: {
            type: eventTypes.requestResubmission,
            sent: new Date()
        },
        pic_href: "/images/group-icon.png"
    }, {
        onSelect: sinon.spy(),
        label: "Joshua No State",
        markAndGrade: {
            grade: 'A'
        },
        event: {
            type: eventTypes.requestResubmission,
            sent: new Date()
        },
        pic_href: "/images/group-icon.png"
    }],
    defaultClass = 'ff_module-profile-response-button',
    selectedClass = 'ff_module-profile-response-button ff_module-profile-response-button--is-selected',
    readClass = 'ff_module-profile-response-button ff_module-profile-response-button--is-read';

function testClasses(component, value, props) {
    var node = TestUtils.findRenderedDOMComponentWithTag(component, 'button');
    if (props.isSelected === true) {
        expect(node.className).to.equal(selectedClass);
    } else if (props.isRead === true) {
        expect(node.className).to.equal(readClass);
    } else {
        expect(node.className).to.equal(defaultClass);
    }
}

function statusSummaryText(event) {
    switch (event.type) {
        case eventTypes.setTask:
            return "Task set";
        case eventTypes.stampResponseAsSeen:
            return "Confirmed as seen";
        case eventTypes.requestResubmission:
            return "Resubmission requested";
        case eventTypes.confirmTaskIsComplete:
            return "Confirmed as complete";
        case eventTypes.confirmStudentIsExcused:
            return "Student excused";
        case eventTypes.comment:
            return "Comment sent";
        case eventTypes.markAndGrade:
            return "Mark sent";
        default:
            return "";
    }
}

var testDefs = {
    'markAndGrade': function(component, value, props) {
        var node = TestUtils.findRenderedDOMComponentWithClass(component, 'ff_module-profile-response-button__mark-and-grade');

        if (value.grade && value.mark && value.markMax) {
            expect(node.textContent).to.equal(value.mark + '/' + value.markMax + ', ' + value.grade);
        } else if (value.grade) {
            expect(node.textContent).to.equal(value.grade);
        } else if (value.mark && value.markMax) {
            expect(node.textContent).to.equal(value.mark + '/' + value.markMax);
        }
    },
    'label': function(component, value, props) {
        var node = TestUtils.findRenderedDOMComponentWithClass(component, 'ff_module-profile-response-button__label');
        expect(node.textContent).to.equal(value);
    },
    'onSelect': function(component, value, props) {
        var node = TestUtils.findRenderedDOMComponentWithTag(component, 'button');
        TestUtils.Simulate.click(node);
        expect(props.onSelect.called).to.be.true;
    },
    'pic_href': function(component, value, props) {
        var node = TestUtils.findRenderedDOMComponentWithClass(component, 'ff_module-profile-response-button__image');
        expect(node.getAttribute('src')).to.equal(value);
    },
    'event':function(component, value, props){
        var node = TestUtils.findRenderedDOMComponentWithClass(component, 'ff_module-profile-response-button__status');
        var expected = '';
        if (props.event) {
            expected = statusSummaryText(props.event) + " " + dateFormatting.niceDate(props.event.sent);
        }
        expect(node.textContent).to.equal(expected);
    },
    'isSelected': testClasses,
    'isRead': testClasses
}

describe('ProfileResponseButton', getTestFramework(ProfileResponseButton, buttonProps, testDefs, function(props) {
    return props.label + ': ' + props.event.type;
}));
