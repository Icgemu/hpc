import React from 'react';
import ReactDOM from 'react-dom';
import Option from './Option';
import { toggleClass } from 'dom-lib';


const OptionGroup = React.createClass({
    handleClickGroup() {
        toggleClass(ReactDOM.findDOMNode(this), 'shrink');
    },
    renderOption(item, index){

        const { selected, onSelect, onKeyDown, } = this.props;
        const { label, value , ...other } = item;

        return (
            <Option
                {...other}
                key={index}
                onKeyDown={onKeyDown}
                selected={selected === value}
                label={label}
                value={value}
                onSelect={ onSelect && onSelect.bind(null, item) }
                />
        );
    },
    render() {

        const {  label, items = [], children,  ...props } = this.props;
        return (
            <div
                className="selectGroup"
                {...props}
            >
                <div className="selectGroup-title" ref='title' onClick={this.handleClickGroup}>
                    <span>{label}</span>
                    <span className="arrow"></span>
                </div>
                {
                    items.length ? items.map((item, index) => this.renderOption(item, index)) :
                    children
                }
            </div>
        );
    }
});

export default OptionGroup;
