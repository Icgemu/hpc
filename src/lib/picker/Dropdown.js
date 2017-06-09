import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import SearchBar from './SearchBar';
import DropdownMenu from './DropdownMenu';


function reactToString(element) {
    const nodes = [];
    function recursion(element) {
        React.Children.forEach(element.props.children, (child) => {
            if (React.isValidElement(child)) {
                recursion(child);
            } else if (typeof child === 'string') {
                nodes.push(child);
            }
        });
    }
    recursion(element);
    return nodes;
}

const Dropdown = React.createClass({
    _displayOptionsNoGroup: [],
    propTypes: {
        value: PropTypes.any,
        options: PropTypes.array,
        height: PropTypes.number,
        onSelect: PropTypes.func,
        dropup: PropTypes.bool,
        multiple: PropTypes.bool
    },
    getDefaultProps() {
        return {
            options: []
        };
    },

    getInitialState() {
        return {
            searchText: ''
        };
    },

    handleSearchTextChange(e) {
        let nextSearchText = e.target.value;
        this.setState({
            searchText: nextSearchText
        });
    },
    shouldDisplay(item) {

        const { searchText } = this.state;

        if (typeof item.label === 'string') {
            return ~item.label.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase());
        } else if (React.isValidElement(item.label)) {
            const nodes = reactToString(item.label);
            return ~nodes.join('').toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase());
        }

        return false;
    },
    handleListSelect(item) {
        const { onSelect } = this.props;
        onSelect && onSelect(item);
    },
    findNextOption(items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].items && items[i].items.length) {
                this.findNextOption(items[i].items);
            } else {
                this._displayOptionsNoGroup.push(items[i]);
            }
        }
    },
    focusNextMenuItem() {
        const { menu } = this.refs;
        menu.focusNextItem && menu.focusNextItem();
    },
    getDisplayOptions() {
        const { options } = this.props;
        return options.map(o => {
            // if is a item group
            if (o.items) {
                return Object.assign({}, o, {
                    items: o.items.filter(this.shouldDisplay)
                });
            }
            // else is a item
            if (this.shouldDisplay(o)) {
                return o;
            }
        }).filter(o => !!o && (!o.items || o.items.length > 0)) || [];
    },


    render() {

        const { value, dropup, height, className, multiple, onClearSelected, onKeyDown } = this.props;
        const classes = classNames('selectDropdown', {
            'checkListDropdown': multiple,
            dropup
        }, className);

        return (
            <div className={classes}  >
                <SearchBar
                    onKeyDown={onKeyDown}
                    onChange={this.handleSearchTextChange}
                    value={this.state.searchText} />
                <DropdownMenu
                    ref='menu'
                    multiple={multiple}
                    selected={value}
                    onClearSelected={onClearSelected}
                    items={this.getDisplayOptions()}
                    onSelect={this.handleListSelect}
                    onClose={this.props.onClose}
                    height={height}
                    />
            </div>
        );
    }
});

export default Dropdown;
