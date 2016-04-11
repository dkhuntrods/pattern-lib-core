'use strict';

var React = require('react');
var template = require('./_ff_module-profile-response-button.rt.js');
var eventTypes = require('../ff_module-task-event/_src/events').types,
    dateFormatting = require('../../_lib/_ui/dateFormatting')();

// lastEventWasAuthoredByCurrentUser
// lastEventWasReleased

module.exports = React.createClass({
    displayName: 'ProfileTaskResponseButton',
    render: template,
    propTypes: {
        onSelect: React.PropTypes.func.isRequired,
        label: React.PropTypes.string.isRequired,
        markAndGrade: React.PropTypes.object.isRequired,
        isSelected: React.PropTypes.bool,
        isRead: React.PropTypes.bool,
        event: React.PropTypes.object,
        pic_href: React.PropTypes.string.isRequired,
        lastEventWasAuthoredByCurrentUser: React.PropTypes.bool
    },
    generateClass: function(base) {
        var classNames = [],
            props = this.props;
        classNames.push(base);
        if (!!props.modifier) classNames.push(base + '--' + props.modifier);
        if (!!props.isRead && !props.isSelected) classNames.push(base + '--is-read');
        if (!!props.isSelected) classNames.push(base + '--is-selected');
        if (!!props.classes) classNames.push(props.classes);
        return classNames.join(' ');
    },
    generateIconClass: function(){
        var classNames = [],
            props = this.props;
        classNames.push('ff_icon');
        if (!!props.isRead && !props.isSelected) classNames.push('ff_icon-task-incoming-grey');
        if (!!props.isSelected) classNames.push('ff_icon-task-incoming-extradarkgrey');
        if (!props.isSelected && !props.isRead) classNames.push('ff_icon-task-incoming-brightblue');
        classNames.push('ff_module-profile-response-button__incoming-icon');
        return classNames.join(' ');
    },
    renderMarkAndGrade: function() {
        var props = this.props,
            marksAll = props.markAndGrade;
        if (!marksAll) return '';
        if (marksAll.grade && marksAll.mark && marksAll.markMax) {
            return marksAll.mark + '/' + marksAll.markMax + ', ' + marksAll.grade;
        } else if (marksAll.grade) {
            return marksAll.grade;
        } else if (marksAll.mark && marksAll.markMax) {
            return marksAll.mark + '/' + marksAll.markMax;
        }
        return '';
    },
    renderStatus: function() {
        var event = this.props.event;
        if (event) {
            return statusSummaryText(event);
        } else {
            return '';
        }
    },
    renderTime: function(){
        var event = this.props.event;
        if (event && event.sent){
            return dateFormatting.niceDate(event.sent);
        } else {
            return '';
        }
    }
});

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
