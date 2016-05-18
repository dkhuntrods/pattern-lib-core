'use strict';

import { createFieldClass, Errors } from 'react-redux-form';
import { FormError, FormErrorList } from '../ff_module-form-errors/ff_module-form-errors';
import ContainerFormLine from '../../ff_container/ff_container-form-line/ff_container-form-line';
import _ from 'underscore';
import React from 'react';

function isMulti(model) {
    return /\[\]$/.test(model);
}

function isChecked(props) {
    if (isMulti(props.model)) {
        return (props.modelValue || [])
            .filter((item) =>
                _.isEqual(item, props.value))
            .length;
    }

    return !!props.modelValue;
}

const controlPropsMap = {
    default: (props) => controlPropsMap.text(props),
    checkbox: (props) => ({
        // ...props,
        name: props.model,
        checked: isChecked(props),
    }),
    radio: (props) => ({
        // ...props,
        name: props.model,
        checked: _.isEqual(props.modelValue, props.value),
        value: props.value,
    }),
    select: (props) => ({
        // ...props,
        name: props.model,
        value: props.modelValue,
    }),
    text: (props) => ({
        // ...props,
        value: props.updateOn === 'change' && !props.defaultValue ? props.modelValue : undefined,
        name: props.model,
    }),
    textarea: (props) => controlPropsMap.text(props),
};

export const FF_Field = createFieldClass({
    'FormInput': (props) => {

        var controlType = controlPropsMap[props.type] || controlPropsMap['default'],
            controlProps = controlType(props);

        return {
            // ...controlProps,
            value: controlProps.value,
            name: controlProps.name,
            checked: controlProps.checked,
            onChange: props.onChange,
            onBlur: props.onBlur,
            onFocus: props.onFocus,
            onClick: props.onClick,
            errors: props.fieldValue.errors,
            valid: props.fieldValue.valid
        };
    },
    'FormLabel': (props) => {
        return {
            valid: props.fieldValue.valid
        };
    }
});

export class FormField extends React.Component {
    render() {

        return (
            <FF_Field {...this.props}>

            {this.props.children}

            <ContainerFormLine>
                <Errors model={this.props.model}
                    show={this.props.showErrorsOn || false}
                    messages={this.props.messages}
                    wrapper={FormErrorList}
                    component={FormError}
                    />
            </ContainerFormLine>

            </FF_Field>
        )
    }
}

module.exports = FormField;
