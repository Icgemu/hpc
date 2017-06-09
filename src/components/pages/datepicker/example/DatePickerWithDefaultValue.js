import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'rsuite-datepicker';
import 'rsuite-datepicker/style/Default.less';

const DatePickerWithDefaultValue = props => (
    <div className="field default-value">
        <DatePicker
            dateFormat="YYYY-MM-DD"
            selected={new Date()}
        />
    </div>
);

export default DatePickerWithDefaultValue;
