import React from 'react';

const Option = React.createClass({
    propTypes: {
        selected: React.PropTypes.bool,
        value: React.PropTypes.any,
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        onSelect: React.PropTypes.func
    },
    render() {
        const { selected, label, value,  onSelect, title, ...props } = this.props;
        return (
            <a

                {...props}
                title = { title || (typeof label === 'string' ? label : ''  ) }
                className={'selectOption' + (selected ? ' active' : '')}
                href=''
                role="menuitem"
                data-value={value}
                onClick={(event) => {
                    event.preventDefault();
                    onSelect && onSelect(event);
                }} >
                {label}
            </a>
        );
    }
});

export default Option;
