import React, { PropTypes } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { on, off } from 'dom-lib';
import DropdownToggle from './DropdownToggle';
import Dropdown from './Dropdown';
import PickerMixin from './mixins/PickerMixin';

const CheckListPicker = React.createClass({
    mixins: [PickerMixin],
    propTypes: {
        options: PropTypes.array,
        onChange: PropTypes.func,
        height: PropTypes.number
    },
    contextTypes: {
        locale: PropTypes.object.isRequired
    },
    formatItem(item) {
        if (typeof (item) === 'string') {
            return {
                value: item,
                label: item,
                check: false
            };
        }
        return item;
    },

    isItemChecked(item) {

        const { currentCheckedItems } = this.state;
        let itemValue = this.formatItem(item).value;
        for (let i = 0, len = currentCheckedItems.length; i < len; i++) {
            let checkedItem = currentCheckedItems[i];
            if (itemValue === checkedItem.value) {
                return true;
            }
        }
        return false;
    },
    getUpdatedCheckList(checkList) {
        return checkList.map(i => {
            let item = this.formatItem(i);
            if (item.items) {
                return Object.assign({}, item, {
                    items: this.getUpdatedCheckList(item.items)
                });
            }
            return Object.assign({}, item, {
                check: this.isItemChecked(i)
            });
        });
    },

    getAllCheckedItems(items) {
        let ret = [];
        for (let i = 0, len = items.length; i < len; i++) {
            let item = this.formatItem(items[i]);
            if (item.items) {
                ret = ret.concat(this.getAllCheckedItems(item.items));
            } else if (item.check) {
                ret.push(item);
            }
        }
        return ret;
    },

    getInitialState() {
        const { options } = this.props;
        return {
            open: false,
            currentCheckedItems: this.getAllCheckedItems(options)
        };
    },

    componentWillReceiveProps(nextProps) {
        const { options } = nextProps;
        if (options) {
            this.setState({
                currentCheckedItems: this.getAllCheckedItems(options)
            });
        }
    },

    handleCheck(item) {
        const { onChange } = this.props;
        const { currentCheckedItems } = this.state;
        const willBeCheck = !item.check;
        let nextCheckedItem;
        if (willBeCheck) { // check item
            nextCheckedItem = [...currentCheckedItems, item];
        } else { // uncheck item
            nextCheckedItem = currentCheckedItems.filter(i => i.value !== item.value);
        }
        this.setState({
            currentCheckedItems: nextCheckedItem
        });
        onChange && onChange(nextCheckedItem.map(i => i.value));
    },
    handleClearSelected() {

        const { onChange } = this.props;
        onChange && onChange([]);

        this.setState({
            currentCheckedItems: []
        });

    },
    render() {

        const { options, height, className, inverse, disabled } = this.props;
        const { open, currentCheckedItems, dropup } = this.state;
        const { placeholder } = this.context.locale;
        const updatedCheckList = this.getUpdatedCheckList(options);
        const placeholderText = placeholder ? placeholder.replace(/\${\ *length\ *}/g, currentCheckedItems.length) : `${currentCheckedItems.length} selected`;
        const classes = classNames('rsuite-Picker rsuite-CheckListPicker', className, {
            'rsuite-Picker--dropup': dropup,
            'expand CheckListSelect--expand': open,
            'inverse': inverse,
            'disabled': disabled
        });

        return (
            <div className={classes}>
                <DropdownToggle
                    placeholder={placeholderText}
                    onClick={this.toggleDropdown}
                    onKeyDown={this.handleKeyDown}
                    />
                {open && <Dropdown
                    ref='dropdown'
                    options={updatedCheckList}
                    height={height}
                    onSelect={this.handleCheck}
                    onKeyDown={this.handleKeyDown}
                    onClose={this.handleClose}
                    onClearSelected={this.handleClearSelected}
                    dropup={dropup}
                    multiple
                    />
                }
            </div>
        );
    }
});
export default CheckListPicker;
