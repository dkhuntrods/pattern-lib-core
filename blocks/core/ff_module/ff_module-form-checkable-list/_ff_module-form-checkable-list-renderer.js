'use strict';
var React = require('react');

var CheckableList = require('./ff_module-form-checkable-list');

var data = {
	items: [{
		label: 'Label text',
		required: true,
		modifier: 'inline',
		type: 'radio',
		id: 'react-radio-id-1',
		value: 'radio-value-1',
		name: 'radio-list-group',
		key: '1'
	},
	{	label: 'Label text',
		required: true,
		type: 'radio',
		modifier: 'inline',
		id: 'react-radio-id-2',
		value: 'radio-value-2',
		name: 'radio-list-group',
		key: '2'
	},
	{	
		label: 'Label text',
		required: true,
		type: 'radio',
		modifier: 'inline',
		id: 'react-radio-id-3',
		value: 'radio-value-3',
		name: 'radio-list-group',
		key: '3'
	}]
};

module.exports = function() {
	document.addEventListener('DOMContentLoaded', function(event) {
		React.render(<CheckableList {...data} />, document.querySelector('[data-ff_module-form-checkable-list]'));
	});
};
