import React from 'react';


const CheckItem = React.createClass({
    propTypes: {
        check: React.PropTypes.bool,
        value: React.PropTypes.any,
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        onSelect: React.PropTypes.func
    },
    render() {
        const { check, label, value, onSelect, title, ...props } = this.props;

        return (
            <a
                { ...props }
                title = { title || (typeof label === 'string' ? label : ''  ) }
                className={'selectOption checkItem' + (check ? ' check' : '')}
                href=''
                data-value={value}
                onClick={(event) => {
                    onSelect && onSelect(event);
                    event.preventDefault();
                } }>
                <input className="checkItem-checkbox" type="checkbox" />
                <label className="checkItem-label">{label}</label>
            </a>
        );
    }
});

export default CheckItem;
