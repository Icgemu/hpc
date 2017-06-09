import React from 'react';
import Modal from './Modal';
import {connect} from 'react-redux';

class DialogButton extends React.Component {
    constructor(props) {
        super(props);
    }
    click(e, option) {
        // console.log("click:" + JSON.stringify(option.title));
        this.props.add(option);
    }
    render() {
        let option = this.props.option;
        return (
            <button {...this.props} onClick={e => {
                this.click(e, option)
            }}>
                {this.props.children}
            </button>
        );
    }
}

const addModal = (option) => {
    return {type: 'ADD_MODAL', option}
}


const mapDispatchToProps = (dispatch) => {
    return {
        add: (option) => {
            console.log("add:" + JSON.stringify(option.title));
            dispatch(addModal(option));
        }
    }
}

export default connect(null, mapDispatchToProps)(DialogButton)
