import React from 'react';
import Picker from 'rsuite-picker';
import users from './data/users';

export default React.createClass({
    handleSelect(value) {
        console.log(value);
        this.setState({
            value
        });
    },
    getInitialState(){
        return {
            value:''
        };
    },
    render() {
        return (
            <Picker
                options={users}
                defaultValue={this.state.value}
                onChange={this.handleSelect} />
        );
    }
});
