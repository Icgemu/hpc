
Picker also supports multi-value pickers. The select below is declared with the `multiple` attribute.

```js
import React from 'react';
import Picker from 'rsuite-picker';

const users = [{
        label: 'Master',
        value: 'Master',
        items: [
            {
                label: 'Eugenia',
                value: 'Eugenia'
            },
            {
                label: 'Kariane',
                value: 'Kariane'
            }
            ...
        ]
    }
    ...
];

export default React.createClass({
    render(){
        return (
            <Picker options={users} multiple />
        );
    }
});

```
