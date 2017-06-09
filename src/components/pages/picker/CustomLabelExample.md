
```js
import React from 'react';
import Picker from 'rsuite-picker';

const users = [{
    label: <div><i className="fa fa-group"></i> Master </div>,
    value: 'Master',
    items: [
        {
            value: 'Eugenia',
            label: <div><i className="fa fa-user"></i>Eugenia</div>
        },
        {
            value: 'Kariane',
            label: <div><i className="fa fa-user"></i>Eugenia</div>
        }
        ...
    ]
}
...
];

export default React.createClass({
    render(){
        return (
            <Picker options={users} />
        );
    }
});

```
