import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'rsuite-datepicker';
import 'rsuite-datepicker/style/Default.less';

const DatePickerWithTime = props => (
    <div className="field">
        <DatePicker dateFormat="YYYY-MM-DD HH:mm:ss" />
    </div>
);

export default DatePickerWithTime;
