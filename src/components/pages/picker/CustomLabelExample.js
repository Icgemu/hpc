import React from 'react';

import Picker from 'rsuite-picker';
import userGroups from './data/userGroups';

export default React.createClass({
    render() {

        const options = userGroups.map((group) => {
            let items = group.items || [];
            return {
                value: group.value,
                label: <div><i className="fa fa-group"></i>  {group.label}</div>,
                items: items.map((item) => {
                    return {
                        value: item.value,
                        title: item.label,
                        label: <div><i className="fa fa-user"></i>  {item.label} </div>
                    };
                })
            };
        });

        return (
            <Picker options={options} />
        );
    }
});
