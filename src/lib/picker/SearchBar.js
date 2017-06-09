import React from 'react';
import ReactDOM from 'react-dom';

const SearchBar = React.createClass({
    propTypes: {
        value: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onKeyDown: React.PropTypes.func
    },
    render() {
        const { value, onChange, onKeyDown } = this.props;
        return (
            <div className="searchBar">
                <input
                    className="searchBar-input"
                    ref='input'
                    value={value}
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    />
            </div>
        );
    }
});

export default SearchBar;
