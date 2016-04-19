'use strict';

var React = require('react'),
    generateIconClass = require('../../../../../_lib/_ui/class-utils').generateIconClass,
    generateTextClass = require('../../../../../_lib/_ui/class-utils').generateTextClass;



export default class DropdownMainButton extends React.Component {
    render() {

        var iconEl = this.props.icon ?
                        <span
                            {...this.props.rtTarget}
                            className = {generateIconClass('ff_module-dropdown-button', this.props, '__icon-alt')} />
                        : null;

        var textEl = <span
                        className = {generateTextClass('ff_module-dropdown-button__content', this.props)}
                        >{this.props.text}</span>;

        var mainIcon = (!(this.props.isDisabled || this.props.hideArrow))  ?
                        <span
                            className = {this.props.generateSubClass('ff_module-dropdown-button__icon', this.props)}
                            {...this.props.rtTarget}></span>
                        : null

        return  <button type="button"
                    title = {this.props.text}
                    id = {this.props.id}
                    className = {this.props.generateSubClass('ff_module-dropdown-button__button' )}
                    disabled = {!!this.props.isDisabled}
                    {...this.props.rtTrigger}>

                    {iconEl}
                    {textEl}
                    {mainIcon}
                </button>;
    }
}

        // var iconSpan = this.props.icon ? <span className = {generateIconClass('ff_module-button',this.props)} /> : null;

        // var leftAlignedIcon = null,
        //     rightAlignedIcon = null;

        // if (iconSpan) {
        //     if (this.props.iconAlign==='right') {
        //         rightAlignedIcon = iconSpan;
        //     } else {
        //         leftAlignedIcon = iconSpan;
        //     }
        // }

        // var text = <span className = {generateTextClass('ff_module-button__content', this.props)}>{this.props.text}</span>;

        // return <button
        //         type="button"
        //         title = {this.props.text}
        //         id = {this.props.id}
        //         disabled = {this.props.disabled}
        //         className = {generateClass('ff_module-button', this.props)}
        //         onClick = {this.props.onClick}
        //         >
        //         {leftAlignedIcon}
        //         {text}
        //         {rightAlignedIcon}
        //         {this.props.children}
        //     </button>;
