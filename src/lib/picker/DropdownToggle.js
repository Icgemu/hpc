import React  from 'react';

const DropdownToggle = ({ placeholder = '', onClick, onKeyDown } = props) => (
    <button type="button" className="toggle" onClick={onClick} onKeyDown={onKeyDown}>
        <div className="toggle-placeholder" >{ placeholder }</div>
        <span className="toggle-arrow"></span>
    </button>
);

export default DropdownToggle;
