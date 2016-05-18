'use strict';

var ReactDOM = require('react-dom');

import FormField from './ff_module-form-field';
import { connect } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { modelReducer, formReducer, actions, Errors } from 'react-redux-form';

import FormInput from '../../ff_module/ff_module-form-input/ff_module-form-input';
import FormLabel from '../../ff_module/ff_module-form-label/ff_module-form-label';
import CheckableList from '../../ff_module/ff_module-form-checkable-list/ff_module-form-checkable-list';
import ContainerFormLine from '../../ff_container/ff_container-form-line/ff_container-form-line';

const items = [{
        label: 'Label text',
        required: true,
        modifier: 'inline',
        type: 'checkbox',
        id: 'react-checkbox-id-1',
        // value: 'checkbox-value-1',
        name: 'react-checkbox-list-group'
    }, {
        label: 'Label text',
        required: true,
        type: 'checkbox',
        modifier: 'inline',
        id: 'react-checkbox-id-2',
        // value: 'checkbox-value-2',
        name: 'react-checkbox-list-group'
    }, {
        label: 'Label text',
        required: true,
        type: 'checkbox',
        modifier: 'inline',
        id: 'react-checkbox-id-3',
        // value: 'checkbox-value-3',
        name: 'react-checkbox-list-group'
    }],
    otherItems = [{
        label: 'Label text',
        required: true,
        modifier: 'inline',
        type: 'radio',
        id: 'react-radio-id-1',
        // value: 'radio-value-1',
        name: 'react-radio-list-group'
    }, {
        label: 'Label text',
        required: true,
        type: 'radio',
        modifier: 'inline',
        id: 'react-radio-id-2',
        // value: 'radio-value-2',
        name: 'react-radio-list-group'
    }, {
        label: 'Label text',
        required: true,
        type: 'radio',
        modifier: 'inline',
        id: 'react-radio-id-3',
        // value: 'radio-value-3',
        name: 'react-radio-list-group'
    }];

function emailIsValid(email) {
    // terrible validation, I know
    return email && email.length > 0 && /@/.test(email);
}

function colourIsValid(colour) {
    return colour === 'blue';
}

function isRequired(value) {
    return value && value.length;
}

const validators = {
    'user.email': {
        validateOn: 'blur',
        rules: {
            required: isRequired,
            valid: emailIsValid
        },
        showErrorsOn: (field) => field.touched && !field.focus && !field.valid,
        messages: {
            required: 'Please provide an email address.',
            valid: (val) => `"${val}" is not a valid email.`,
        }
    },
    'user.username': {
        validateOn: 'blur',
        rules: {
            required: isRequired
        },
        showErrorsOn: (field) => field.touched && !field.focus && !field.valid,
        messages: {
            required: 'Please provide a username.'
        }
    },
    'user.password': {
        validateOn: 'blur',
        rules: {
            required: isRequired
        },
        showErrorsOn: (field) => field.touched && !field.focus && !field.valid,
        messages: {
            required: 'Please provide a password.'
        }
    },
    'user.selectedColour': {
        validateOn: 'change',
        rules: {
            valid: colourIsValid
        },
        showErrorsOn: (field) => field.touched && !field.valid,
        messages: {
            valid: (val) => `"${val}" is not the correct colour.`
        }
    }
};


const initialState = {
    username: '',
    email: '',
    password: '',
    selectedColour: '',
    story: '',
    isAllowed: false,
    checklist: [],
    radiolist: '',
    radiolist2: '',
    items: [],
    otherItems: []
};



const store = createStore(combineReducers({
    user: modelReducer('user', initialState),
    userForm: formReducer('user', initialState)
}));


class LoginForm extends React.Component {
    render() {
        let { user, userForm, validation } = this.props;

        return (
            <form>


            <FormField
                model='user.username'
                validators={validation['user.username'].rules}
                validateOn={validation['user.username'].validateOn}
                showErrorsOn={validation['user.username'].showErrorsOn}
                messages={validation['user.username'].messages}
                >

                <FormLabel required={true}>Username</FormLabel>

                <FormInput
                    type="text"
                    required={true}
                    value={user.username}
                    />

            </FormField>


            <FormField model='user.selectedColour'
                validators={validation['user.selectedColour'].rules}
                validateOn={validation['user.selectedColour'].validateOn}
                showErrorsOn={validation['user.selectedColour'].showErrorsOn}
                messages={validation['user.selectedColour'].messages}
                >


              <FormLabel>Colours</FormLabel>

              <FormInput
                type="select"
                value={user.selectedColour}
                options={[{ value: '', text: 'Select a colour' }, { value: 'red', text: 'Red' }, { value: 'blue', text: 'Blue' }]}
                />

            </FormField>

            <FormField model='user.story'>

              <FormLabel>Story</FormLabel>

              <FormInput
                type="textarea"
                value={user.story}
                />

            </FormField>

            <FormField model='user.password'
                validators={validation['user.password'].rules}
                validateOn={validation['user.password'].validateOn}
                showErrorsOn={validation['user.password'].showErrorsOn}
                messages={validation['user.password'].messages}
                >

              <FormLabel required={true}>Password</FormLabel>

              <FormInput
                required={true}
                type="password"
                value={user.password}
                />

            </FormField>

            <FormField model='user.isAllowed'>

              <FormLabel required={true}>Allowed?: </FormLabel>

              <FormInput
                required={true}
                type="checkbox"
                // value={}
                // checked={user.isAllowed}
                />

            </FormField>



              <FormLabel required={true}>Checklist: </FormLabel>

                <FormField model='user.checklist[]'>
                <FormInput
                required={true}
                type="checkbox"
                value='one'
                />
                <FormInput
                required={true}
                type="checkbox"
                value='two'
                />
                </FormField>

                <br/>

            <FormLabel required={true}>Radio1: </FormLabel>

                <FormField model='user.radiolist'>
                <FormInput
                required={true}
                type="radio"
                value='radio-val-1'
                />
                </FormField>

                <FormLabel required={true}>Radio2: </FormLabel>
                <FormField model='user.radiolist'>
                <FormInput
                required={true}
                type="radio"
                value='radio-val-2'
                />
                </FormField>

                 <br/>
              <FormLabel required={true}>Checkablelist checkbox</FormLabel>

              <CheckableList
                required={true}
                model='user.items[].checked'
                items={user.items}
                />

                 <br/>
                <FormLabel required={true}>Checkablelist Radio</FormLabel>

              <CheckableList
                required={true}
                modifier='stacked'
                model='user.otherItems[].checked'
                items={user.otherItems}
                />



            <button>
              Log in
            </button>


            <p>Username (text): {user.username}</p>
            <p>SelectedColour (select): {user.selectedColour}</p>
            <p>Password (password): {user.password}</p>
            <p>Story (textarea): {user.story}</p>
            <p>Is allowed?: {(user.isAllowed).toString()}</p>

            <p>Checklist: {(user.checklist).toString()}</p>
            <p>Radiolist: {(user.radiolist).toString()}</p>

            <p>Checklist (checkablelist-checkbox): {user.items.map((item)=>item.checked? 'true': 'false').join(', ')}</p>
            <p>OtherItems (checkablelist-radio): {user.otherItems.map((item)=>item.checked? 'true': 'false').join(', ')}</p>

          </form>
        )
    }
}


function mapStateToProps(state) {
    return {
        user: state.user,
        userForm: state.userForm,
        validation: validators
    };
}


const ConnectedLoginForm = connect(
    mapStateToProps
)(LoginForm);

class App extends React.Component {
    render() {
        return (<Provider store = { store }>
            <ConnectedLoginForm />
            </Provider>)
    }
}

module.exports = function() {
    document.addEventListener('DOMContentLoaded', function(event) {
        var element = document.querySelector('[data-ff_module-form-field]');
        if (element) {
            ReactDOM.render(<App/>, element);
        }
    });
};
