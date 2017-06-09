import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { getHeight, scrollTop, hasClass, removeClass } from 'dom-lib';

import OptionGroup from './OptionGroup';
import Option from './Option';

import CheckGroup from './CheckGroup';
import CheckItem from './CheckItem';

const DropdownMenu = React.createClass({
    propTypes: {
        selected: PropTypes.any,
        items: PropTypes.array,
        height: PropTypes.number,
        onSelect: PropTypes.func,
        multiple: PropTypes.bool
    },
    contextTypes: {
        locale: PropTypes.object.isRequired
    },
    componentWillReceiveProps(nextProps) {

        if (!nextProps.multiple && nextProps.selected !== this.props.selected) {

            const node = ReactDOM.findDOMNode(this);
            const options = Array.from(node.querySelectorAll('.selectOption, .selectGroup-title'));
            const groups = Array.from(node.querySelectorAll('.selectGroup'));
            const { height } = this.props;
            if (!options.length) {
                return;
            }

            const itemHeight = getHeight(options[0]) || 32;
            const dropdownDOM = ReactDOM.findDOMNode(this);
            let activeIndex = 0;

            for (let i = 0; i < options.length; i++) {
                if (hasClass(options[i], 'active')) {
                    activeIndex = i;
                }
            }

            for (let i = 0; i < groups.length; i++) {
                removeClass(groups[i], 'contract');
            }

            scrollTop(dropdownDOM, (activeIndex + 2) * itemHeight - height);

        }
    },
    getItemsAndActiveIndex() {
        const items = this.getFocusableMenuItems();
        const activeIndex = items.indexOf(document.activeElement);
        return { items, activeIndex };
    },
    getFocusableMenuItems() {
        const node = ReactDOM.findDOMNode(this);
        if (!node) {
            return [];
        }
        return Array.from(node.querySelectorAll('.selectOption'));
    },
    focusNextItem() {
        const { items, activeIndex } = this.getItemsAndActiveIndex();
        if (items.length === 0) {
            return;
        }

        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        items[nextIndex].focus();
    },
    focusPreviousItem() {
        const { items, activeIndex } = this.getItemsAndActiveIndex();

        if (items.length === 0) {
            return;
        }

        const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        items[prevIndex].focus();
    },
    getActiveElementOption(options, value) {
        for (let i = 0; i < options.length; i++) {
            if (options[i].value + '' === value + '') {
                return options[i];
            } else if (options[i].items && options[i].items.length) {
                let active = this.getActiveElementOption(options[i].items, value);
                if (active) {
                    return active;
                }
            }
        }
        return false;
    },
    selectActiveItem() {
        const { items, onSelect } = this.props;
        const activeItem = document.activeElement;
        const option = this.getActiveElementOption(items, activeItem.dataset.value);

        onSelect(option);
    },
    handleKeyDown(event) {

        const { onClose, multiple } = this.props;

        switch (event.keyCode) {
            //down
            case 40:
                this.focusNextItem();
                event.preventDefault();
                break;
            //up
            case 38:
                this.focusPreviousItem();
                event.preventDefault();
                break;
            //enter
            case 13:
                this.selectActiveItem();
                !multiple && onClose && onClose(event);
                event.preventDefault();
                break;
            //esc | tab
            case 27:
            case 9:
                onClose && onClose(event);
            default:
        }

        event.preventDefault();
    },
    renderOptions() {

        const { selected, items, onSelect } = this.props;

        return items.map((item, index) => {

            let { label, items, value, ...other } = item;
            if (item.items) {
                return <OptionGroup
                    {...other}
                    key={index}
                    selected={selected}
                    items={items}
                    label={label}
                    onSelect={onSelect}
                    onKeyDown={this.handleKeyDown}
                    />;
            }

            return <Option
                {...other}
                key={index}
                onKeyDown={this.handleKeyDown}
                selected={selected === value}
                label={label}
                value={value}
                onSelect={onSelect.bind(null, item)}
                />;
        });

    },
    getCheckedItem(checkedItem) {
        const { items } = this.props;
        let checked = true;

        items.forEach((group) => {
            if (checkedItem.value === group.value) {
                checked = group.check;
            }
            if (group.items && group.items.length) {
                group.items.forEach((item) => {
                    if (checkedItem.value === item.value) {
                        checked = item.check;
                    }
                });
            }
        });
        return Object.assign({}, checkedItem, {
            check: checked
        });
    },
    renderCheckList() {

        const { items, onSelect, onClearSelected } = this.props;
        const { clearSelected } = this.context.locale;
        const { checkedItems = []} = this.state;
        const options = items.filter((item) => {
            let flag = true;
            checkedItems.forEach((excItem) => {
                if (item.value === excItem.value) {
                    flag = false;
                }
            });
            return flag;
        }).map((item, idx) => {

            let { label, items, value, check, ...other } = item;

            if (item.items) {
                return <CheckGroup
                    {...other}
                    key={idx}
                    label={label}
                    items={items}
                    excludeItems={checkedItems}
                    onSelect={onSelect}
                    onKeyDown={this.handleKeyDown}
                    />;
            }
            return <CheckItem
                {...other}
                key={idx}
                check={check}
                label={label}
                value={value}
                onSelect={onSelect.bind(null, item)}
                onKeyDown={this.handleKeyDown}
                />;
        });

        if (checkedItems.length) {
            options.unshift(<hr key={Math.random() * 1E18} />);
            options.unshift(checkedItems.map((item, idx) => {
                let newItem = this.getCheckedItem(item);
                return <CheckItem
                    key={idx}
                    check={newItem.check}
                    label={newItem.label}
                    value={item.value}
                    onSelect={onSelect.bind(null, newItem)}
                    onKeyDown={this.handleKeyDown}
                    />;
            }));
            options.unshift(<div key={Math.random() * 1E18}><a onClick={onClearSelected} className="btnClear">{ clearSelected || 'Clear selected' }</a></div>);
        }

        return options;
    },
    setCheckedItems(items) {

        let checkedItems = items.filter((item) => {
            return item.check;
        });
        items.forEach((group) => {
            if (group.items && group.items.length) {
                let subItems = group.items.filter((item) => {
                    return item.check;
                });
                checkedItems = checkedItems.concat(subItems);
            }
        });

        this.setState({ checkedItems });
    },
    _getItemsLength(items = []) {
        let length = items.length;

        const size = items.map((item) => {
            return item.items ? item.items.length : 0;
        });

        if (size.length) {
            length += size.reduce((previous, current) => {
                return previous + current;
            });
        }

        return length;

    },
    componentWillMount() {
        this.setCheckedItems(this.props.items);
    },
    componentWillReceiveProps(nextProps) {

        if (this._getItemsLength(nextProps.items) !== this._getItemsLength(this.props.items)) {
            this.setCheckedItems(nextProps.items);
        }
    },
    render() {
        const { multiple, height } = this.props;
        const classes = multiple ? 'checkList' : 'selectList';
        return (
            <div className={classes} style={{ maxHeight: height }}>
                {multiple ? this.renderCheckList() : this.renderOptions()}
            </div>
        );
    }
});

export default DropdownMenu;
