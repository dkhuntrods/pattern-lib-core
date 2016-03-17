'use strict';

var React = require('react');
import Button from '../../../../ff_module-button/ff_module-button.js';

import FormInput from '../../../../ff_module-form-input/ff_module-form-input';
import FormLabel from '../../../../ff_module-form-label/ff_module-form-label';
import {types as itemTypeNames} from '../../../../ff_module-form-input/_src/types';

export default class DropdownMainList extends React.Component {
    render() {
        var hasList = !this.props.isDisabled && this.props.list && this.props.list.length;
        var el = hasList ?
                <div
                    className={this.props.generateClass('ff_module-dropdown-button__list-container')}
                    data-ff_module-dropdown-button-rt-target={ !this.props.isDisabled ? this.props.dropdownLinkId : false }>

                    <ul className="ff_module-dropdown-button__list">
                        {this.props.list.map(item => this.renderListItem(item))}
                    </ul>
                </div> : <span/>;
        return el;
    }
    renderListItem(item, itemIndex){
        var itemType = getItemType(item);
        return <li key={itemIndex}>
                {itemTypes[itemType](item)}
            </li>
    }
}

function linkTemplate(item) {
    return <a href={item.href} className="ff_module-dropdown-button__link">{item.text}</a>;
}

function buttonTemplate(item) {
    return <Button classes="ff_module-dropdown-button__link" modifier={item.modifier ? item.modifier : 'link'} onClick={item.onClick} text={item.text}/>;
}

function inputTemplate(item) {
    return  <div className='ff_module-form-pair ff_module-dropdown-button__link'>
                <FormInput
                    checked={item.checked}
                    id={item.id}
                    value={item.value}
                    name={item.name}
                    type={item.type || 'radio'}
                    onChange={item.onChange}/>
                <FormLabel
                    id={item.id}
                    required={item.required}
                    optionalMarker=''>{item.text}</FormLabel>
            </div>;
}


var itemTypes = {};
itemTypes[itemTypeNames.link] = linkTemplate;
itemTypes[itemTypeNames.button] = buttonTemplate;
itemTypes[itemTypeNames.checkbox] = inputTemplate;
itemTypes[itemTypeNames.radio] = inputTemplate;

function getItemType(item) {
    switch(true) {
        case !!item.type: return item.type; break;
        case !!item.href: return itemTypeNames.link; break;
        default: return itemTypeNames.button;
    }
}
