import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'rsuite-datepicker';
import 'rsuite-datepicker/style/Default.less';

const DatePickerOnlyDate = props => (
    <div className="field only-date">
        <DatePicker dateFormat="YYYY-MM-DD" />
    </div>
);

export default DatePickerOnlyDate;
