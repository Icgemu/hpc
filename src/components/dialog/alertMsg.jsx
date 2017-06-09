import React from 'react'
import {connect} from 'react-redux'
import store from "../index/store"
import styles from './dialog.scss'
import CSSModules from 'react-css-modules'

class Alertmsg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: -300,
            types: {
                error: 'danger',
                info: 'primary',
                warn: 'warning',
            },
            fas: {
                error: 'fa-times-circle',
                info: 'fa-info-circle',
                warn: 'fa-exclamation-circle',
            },
            title: {
                error: '错误提示',
                info: '信息提示',
                warn: '告警提示',
            }
        };
    }

    componentDidMount() {

        let interid = setInterval(() => {
            if (this.state.top != 0) {
                this.setState({
                    top: this.state.top + 2
                });
            } else {
                clearInterval(this.state.interid);
                setTimeout(e=>{
                  this.close(this.props.id);
                },3000);
            }

        }, 2);

        this.setState({interid});
    }

    close(id) {

        let interid = setInterval(() => {
            if (this.state.top != -300) {
                this.setState({
                    top: this.state.top - 2
                });
            } else {
                clearInterval(this.state.interid);
                this.props.close(id);
            }

        }, 2);

        this.setState({interid});
    }

    render() {
        let  btnType = this.state.types[this.props.type];
        let cls = `btn btn-${btnType}`;
        let fa = `fa ${this.state.fas[this.props.type]}`;
        let alertcls = `alert${this.props.type}`
        let headercls = `alertHeader${this.props.type}`
        let title = this.state.title[this.props.type];
        let btn = (
            <li>
                <button className={cls} onClick={e => {
                    this.props.callback
                        ? this.callback(e)
                        : "";
                    this.close(this.props.id)
                }} type="button">确定</button>
            </li>
        )
        return (
            <div styleName={alertcls} style={{
                top: this.state.top + 'px'
            }}>
                <div styleName={headercls}>
                    <h6>
                        <span styleName="title">
                            <i className={fa}></i>&nbsp;{title}</span>
                    </h6>
                </div>

                <div styleName="alertContent">
                    <div className={this.props.type}>
                        <div styleName="msg">{this.props.msg}</div>
                    </div>
                </div>
                <div styleName="toolBar">
                    <ul>{btn}</ul>
                </div>
            </div>
        );
    }
}

const addAlert = (option) => {
    let id = parseInt(Math.random() * 100000000000);
    option.id = id;
    return {type: 'ADD_ALERT_MSG', option}
}

const delAlert = (id) => {
    return {type: 'DEL_ALERT_MSG', id}
}

export const alertMsg = function(option) {
    store.dispatch(addAlert(option));
}

const mapDispatchToProps = (dispatch) => {
    return {
        close: (id) => {
            dispatch(delAlert(id));
        }
    }
}

export default connect(null, mapDispatchToProps)(CSSModules(Alertmsg, styles, {allowMultiple: true}))
