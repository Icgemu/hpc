import React from 'react';
import Modal from './Modal';
import {connect} from 'react-redux';
import store from "../index/store"

class Dialog extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Modal {...this.props.option}>
                {this.props.children}
            </Modal>
        );
    }
}

const addModal = (option) => {
    return {type: 'ADD_MODAL', option}
}

export const dialog = function(option) {
    store.dispatch(addModal(option));
}

export default Dialog;
