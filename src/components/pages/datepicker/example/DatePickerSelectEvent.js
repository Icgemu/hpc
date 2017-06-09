import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'rsuite-datepicker';
import 'rsuite-datepicker/style/Default.less';

const DatePickerSelectEvent = props => (
    <div className="field event">
        <DatePicker
            dateFormat="YYYY-MM-DD"
            onSelect={ date => alert(date.toDateString()) }
        />
    </div>
);

export default DatePickerSelectEvent;
