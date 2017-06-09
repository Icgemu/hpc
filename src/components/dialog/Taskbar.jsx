import React from 'react'
import {connect} from 'react-redux'
import styles from './dialog.scss'
import CSSModules from 'react-css-modules'

class Taskbar extends React.Component {
    constructor(props) {
        super(props);
        this.setState({tabs: []});
    }
    render() {
        if (this.props.tabs.length === 0) {
            return null;
        }
        let lis = this.props.tabs.map(option => {
            return (
                <li >
                    <div styleName="taskbutton" onClick={e => {
                        this.props.addModal(option)
                    }}>
                        <span>
                            <i className="fa fa-th-large"></i>&nbsp;{option.title}
                        </span>
                    </div>
                    <div styleName="close" onClick={e => {
                        this.props.close(option.id)
                    }}>
                        <i className="fa fa-times-circle"></i>
                    </div>
                </li>
            )
        })

        return (
            <div styleName="taskbar" style={{
                left: '0px',
                bottom: '0px'
            }}>
                <div styleName="taskbarContent">
                    <ul>
                        {lis}
                    </ul>
                </div>
            </div>
        )
    }
}

const addModal = (option) => {
    return {type: 'ADD_MODAL', option}
}

const closeMiniModal = (id) => {
    return {type: 'CLOSE_MINI_MODAL', id}
}

const mapStateToProps = (state, ownProps) => {
    let dialog = state.minDialog;
    return {
        tabs: [...dialog]
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addModal: (option) => {
            dispatch(addModal(option));
            dispatch(closeMiniModal(option.id));
        },
        close: (id) => {
            dispatch(closeMiniModal(id));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(Taskbar, styles, {allowMultiple: true}))
