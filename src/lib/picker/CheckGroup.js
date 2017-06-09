import React from 'react';
import ReactDOM from 'react-dom';
import CheckItem from './CheckItem';
import { toggleClass } from 'dom-lib';

const CheckGroup = React.createClass({
    propTypes: {
        items: React.PropTypes.array,
        excludeItems: React.PropTypes.array,
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        onSelect: React.PropTypes.func
    },
    handleClickGroup() {
        toggleClass(ReactDOM.findDOMNode(this.refs.title).parentNode, 'contract');
    },
    render() {
        const { items = [], label, onSelect, onKeyDown, excludeItems = []} = this.props;
        let checkList = items.filter((item) => {
            let flag = true;
            excludeItems.forEach((excItem) => {
                if (item.value === excItem.value) {
                    flag = false;
                }
            });
            return flag;
        });

        if (!checkList.length) {
            return null;
        }

        checkList = checkList.map((item, idx) => {

            const { label, value, check , ...other } = item;
            return <CheckItem
                {...other}
                key={idx}
                check={check}
                label={label}
                value={value}
                onSelect={onSelect.bind(null, item)}
                onKeyDown={onKeyDown}
                />;
        });

        return (
            <div className="selectGroup">
                <div className="selectGroup-title" ref='title' onClick={this.handleClickGroup}>
                    <span>{label}</span>
                    <span className="arrow"></span>
                </div>
                {checkList}
            </div>
        );
    }
});

export default CheckGroup;
