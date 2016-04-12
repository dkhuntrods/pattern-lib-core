'use strict';

var React = require('react');
require('./lib/utils').bootstrapBrowser();
var TestUtils = require('react-addons-test-utils');
var expect = require('chai').expect;
var _ = require('lodash');

var TaskEvent = require('../blocks/core/ff_module/ff_module-task-event/ff_module-task-event.js');
var eventTypes = require('../blocks/core/ff_module/ff_module-task-event/_src/events').types;
var dStrings = ['27 Feb 2016 03:24:00', '27 Feb 2016 03:28:00', '28 Feb 2016 13:24:00'];
var dExpected = ['27/2/2016 at 3:24 AM', '27/2/2016 at 3:28 AM', '28/2/2016 at 1:24 PM'];
//TODO: Update tests to account for date/time of test run

var classes = {
    [eventTypes.setTask]: { sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', taskTitle: 'ff_module-task-event__task-title' },
    [eventTypes.stampResponseAsSeen]: { sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', message: 'ff_module-task-event__message' },
    [eventTypes.requestResubmission]: { sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', message: 'ff_module-task-event__message' },
    [eventTypes.confirmTaskIsComplete]: { sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', message: 'ff_module-task-event__message' },
    [eventTypes.confirmStudentIsExcused]: { sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', message: 'ff_module-task-event__message' },
    [eventTypes.comment]: { sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', message: 'ff_module-task-event__comment' },
    [eventTypes.markAndGrade]: { sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', mark: 'ff_module-task-event__mark', grade: 'ff_module-task-event__grade', markAndGrade: 'ff_module-task-event__mark-and-grade', message: 'ff_module-task-event__message' },
    [eventTypes.confirmStudentIsUnexcused]:{ sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', message: 'ff_module-task-event__message'},
    [eventTypes.deleteResponse]:{ sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', files: 'ff_module-task-event__files', message: 'ff_module-task-event__message'},
    [eventTypes.addFile]:{ sent: 'ff_module-task-event__sent', author: 'ff_module-task-event__author-action', files: 'ff_module-task-event__files', message: 'ff_module-task-event__message'}
};

var shouldntExist = 'shouldnt-exist';

var events = [{
    props: {
        type: eventTypes.setTask,
        sent: new Date(dStrings[0]),
        author: { name: 'Sally Student' },
        taskTitle: 'Write an Essay'
    },
    expected: {
        sent: dExpected[0],
        author: 'Sally Student set a task:',
        taskTitle: 'Write an Essay'
    }
}, {
    props: {
        type: eventTypes.markAndGrade,
        sent: new Date(dStrings[0]),
        author: { name: 'Sally MarkAndGrade' },
        mark: 7,
        markMax: 10,
        grade: 'B',
        markAndGrade: ''
    },
    expected: {
        sent: dExpected[0],
        author: 'Sally MarkAndGrade added a mark and grade:',
        mark: '7/10',
        grade: 'B',
        markAndGrade: '7/10, B'
    }
}, {
    props: {
        type: eventTypes.markAndGrade,
        sent: new Date(dStrings[0]),
        author: { name: 'Sally Grade' },
        grade: 'B',
        markAndGrade: ''
    },
    expected: {
        sent: dExpected[0],
        author: 'Sally Grade added a grade:',
        mark: '',
        grade: 'B',
        markAndGrade: 'B'
    }
}, {
    props: {
        type: eventTypes.markAndGrade,
        sent: new Date(dStrings[0]),
        author: { name: 'Sally GradeAndMessage' },
        grade: 'B',
        message: 'Good work',
        markAndGrade: ''
    },
    expected: {
        sent: dExpected[0],
        author: 'Sally GradeAndMessage added a grade:',
        mark: '',
        grade: 'B',
        markAndGrade: 'B',
        message: 'Good work'
    }
}, {
    props: {
        type: eventTypes.markAndGrade,
        sent: new Date(dStrings[0]),
        author: { name: 'Sally MarkAndMessage' },
        mark: 6,
        markMax: 10,
        message: 'Good work',
        markAndGrade: ''
    },
    expected: {
        sent: dExpected[0],
        author: 'Sally MarkAndMessage added a mark:',
        mark: '6/10',
        markAndGrade: '6/10',
        message: 'Good work'
    }
}, {
    props: {
        type: eventTypes.markAndGrade,
        sent: new Date(dStrings[0]),
        author: { name: 'Sally Student' },
        mark: 7,
        markMax: 10,
        markAndGrade: ''
    },
    expected: {
        sent: dExpected[0],
        author: 'Sally Student added a mark:',
        mark: '7/10',
        grade: '',
        markAndGrade: '7/10',
    }
}, {
    props: {
        type: eventTypes.stampResponseAsSeen,
        sent: new Date(dStrings[1]),
        author: { name: 'Terry Teacher' },
        message: 'Message from the teacher'
    },
    expected: {
        sent: dExpected[1],
        author: 'Terry Teacher stamped response as seen.',
        message: 'Message from the teacher'
    }
}, {
    props: {
        type: eventTypes.comment,
        sent: new Date(dStrings[2]),
        author: { name: 'Terry Teacher' },
        message: 'Much better, this sets the essay up very well. Very good character analysis, you understand the different perspectives and explained the context very thoroughly. Keep up the good work!'
    },
    expected: {
        sent: dExpected[2],
        author: 'Terry Teacher added a comment:',
        message: '“Much better, this sets the essay up very well. Very good character analysis, you understand the different perspectives and explained the context very thoroughly. Keep up the good work!”'
    }
}, {
    props: {
        type: eventTypes.requestResubmission,
        sent: new Date(dStrings[0]),
        author: { name: 'Terry Teacher' },
        message: 'Message from the teacher'
    },
    expected: {
        sent: dExpected[0],
        author: 'Terry Teacher requested resubmission.',
        message: 'Message from the teacher'
    }
}, {
    props: {
        type: eventTypes.confirmTaskIsComplete,
        sent: new Date(dStrings[1]),
        author: { name: 'Terry Teacher' },
        message: 'Message from the teacher'
    },
    expected: {
        sent: dExpected[1],
        author: 'Terry Teacher confirmed completion.',
        message: 'Message from the teacher'
    }
}, {
    props: {
        type: eventTypes.confirmStudentIsExcused,
        sent: new Date(dStrings[2]),
        author: { name: 'Terry Teacher' },
        message: 'Message from the teacher'
    },
    expected: {
        sent: dExpected[2],
        author: 'Terry Teacher confirmed student is excused.',
        message: 'Message from the teacher'
    }
}, {
    props: {
        type: eventTypes.deleteResponse,
        sent: new Date(dStrings[0]),
        author: { name: 'Terry Teacher' }
    },
    expected: {
        sent: dExpected[0],
        author: 'Terry Teacher deleted a response.'
    }
}, {
    props: {
        type: eventTypes.confirmStudentIsUnexcused,
        sent: new Date(dStrings[1]),
        author: { name: 'Terry Teacher' }
    },
    expected: {
        sent: dExpected[1],
        author: 'Terry Teacher unexcused student.'
    }
}, {
    props: {
        type: eventTypes.addFile,
        sent: new Date(dStrings[2]),
        author: { name: 'Sally StudentFiles' },
        files: [{
            title: 'File one',
            href: '#'
        }, {
            title: 'File two',
            type: 'page',
            href: '#'
        }, {
            title: 'File two'
        }]
    },
    expected: {
        sent: dExpected[2],
        author: 'Sally StudentFiles added files:',
        files: 'File oneFile twoFile two'
    }
}, {
    props: {
        type: eventTypes.addFile,
        sent: new Date(dStrings[2]),
        author: { name: 'Sally StudentFile' },
        files: [{
            title: 'File one',
            href: '#'
        }]
    },
    expected: {
        sent: dExpected[2],
        author: 'Sally StudentFile added a file:',
        files: 'File one'
    }
}, {
    props: {
        type: eventTypes.comment,
        deleted: true,
        sent: new Date(dStrings[2]),
        author: { name: 'Terry Teacher' },
    },
    expected: {
        sent: dExpected[2],
        author: 'Terry Teacher deleted a comment.',
    }
}, {
    props: {
        type: eventTypes.addFile,
        deleted: true,
        sent: new Date(dStrings[2]),
        author: { name: 'Sally StudentFiles' },
        files: [{
            title: 'File one',
            href: '#'
        }, {
            title: 'File two',
            type: 'page',
            href: '#'
        }, {
            title: 'File two'
        }]
    },
    expected: {
        sent: dExpected[2],
        author: 'Sally StudentFiles deleted files.',
        files: shouldntExist
    }
}, {
    props: {
        type: eventTypes.addFile,
        deleted: true,
        sent: new Date(dStrings[2]),
        author: { name: 'Sally StudentFile' },
        files: [{
            title: 'File one',
            href: '#'
        }]
    },
    expected: {
        sent: dExpected[2],
        author: 'Sally StudentFile deleted a file.',
        files: shouldntExist
    }
}];





describe('TaskEvent', function() {
    var component;

    before(function() {
        var element = React.createElement(TaskEvent, { event: events[0].props });
        component = TestUtils.renderIntoDocument(element);
    });

    it('should render', function() {
        expect(component).to.exist;
    });

    _.each(events, function(_event, index) {
        var testProps = _.omit(_event.props, ['type', 'maxMark']);
        describe(_event.props.type, function() {

            _.each(testProps, function(prop, key) {
                var element, component;
                var testClass = classes[_event.props.type][key];

                if (!testClass) return null;

                it('should render \'' + _event.expected[key] + '\' for prop \'' + key + '\' with value \'' + prop.toString() + '\'', function() {
                    element = React.createElement(TaskEvent, { event: _event.props });
                    component = TestUtils.renderIntoDocument(element);

                    if (_event.expected[key] === shouldntExist) {
                        var attemptToFindNode = function() {
                            TestUtils.findRenderedDOMComponentWithClass(component, testClass);
                        };
                        expect(attemptToFindNode).to.throw(Error, /Did not find/);
                    } else {
                        var node = TestUtils.findRenderedDOMComponentWithClass(component, testClass);
                        expect(node.textContent).to.equal(_event.expected[key]);
                    }


                });
            });
        });
    });

});
