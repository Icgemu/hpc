import React from 'react'
import {Route} from 'react-router'
import {connect} from 'react-redux'
import styles from './dialog.scss'
import CSSModules from 'react-css-modules'

class Modal extends React.Component {
    constructor(props) {
        super(props);

        let {width, height} = props;

        let ww = $(window).width();
        let hh = $(window).height();

        if (width > ww) {
            width = ww;
        }
        if (height > hh) {
            height = hh;
        }

        let top = props.top || parseInt((hh - height) / 2);
        let left = props.left || parseInt((ww - width) / 2);

        this.state = {
            width,
            height,
            top,
            left,
            restore: false
        };
    }
    maximize(e) {
        //this.props.maximize(e);
        console.log("maximize");
        e.preventDefault();
        let width = $(window).width();
        let height = $(window).height();
        this.setState({width, height, top: 0, left: 0, restore: true});
        e.stopPropagation();
    }

    minimize(e, id, title, component) {
        this.props.minimize({
            ...this.state,
            ...this.props
        });
        e.preventDefault();
        e.stopPropagation();
    }

    close(e, id) {
        this.props.close(id);
        e.preventDefault();
        e.stopPropagation();
    }

    restore(e) {
        console.log("restore");
        e.preventDefault();
        let {width, height} = this.props;

        let ww = $(window).width();
        let hh = $(window).height();

        if (width > ww) {
            width = ww;
        }
        if (height > hh) {
            height = hh;
        }

        let top = parseInt((hh - height) / 2);
        let left = parseInt((ww - width) / 2);

        this.setState({width, height, top, left, restore: false});

        e.stopPropagation();
        //this.props.restore(e);
    }

    mouseDown(e) {
        console.log("down");
        let X = e.pageX || e.clientX;
        let Y = e.pageY || e.clientY;
        document.onselectstart = function() {
            return false;
        }
        this.setState({down: true, X, Y});
        e.stopPropagation();
    }
    mouseUp(e) {
        console.log("up");
        this.setState({down: false});
        document.onselectstart = function() {
            return true;
        }
        e.stopPropagation();
    }
    mouseMove(e) {
        if (this.state.down) {
            console.log("PX:" + e.pageX + ",Y:" + e.pageY);
            console.log("CX:" + e.clientX + ",Y:" + e.clientY);
            let X = e.pageX || e.clientX;
            let Y = e.pageY || e.clientY;

            let left = this.state.left + X - this.state.X;
            let top = this.state.top + Y - this.state.Y;
            this.setState({X, Y, left, top});
        }
        e.stopPropagation();
    }

    componentDidMount() {}

    render() {
        let {width, height, left, top} = this.state;
        let {id, title, component} = this.props;

        let restore;
        if (this.state.restore) {
            restore = (
                <a styleName="close" style={{
                    right: '23px'
                }} onClick={e => {
                    this.restore(e)
                }} title="恢复">
                    <i className="fa fa-history"></i>
                </a>
            )
        } else {
            restore = (
                <a styleName="close" style={{
                    right: '23px'
                }} onClick={e => {
                    this.maximize(e)
                }} title="最大化">
                    <i className="fa fa-plus-circle"></i>
                </a>
            )
        }
        return (
            <div styleName="dialog" style={{
                zIndex: 10,
                top: top + 'px',
                left: left + 'px',
                width: width + 'px',
                height: height + 'px'
            }}>
                <div styleName="dialogHeader" onSelectStart={e => {
                    return false;
                }} onCopy={e => {
                    return false
                }} onPaste={e => {
                    return false
                }} onCut={e => {
                    return false
                }} onMouseDown={e => {
                    this.mouseDown(e)
                }} onMouseMove={e => {
                    this.mouseMove(e)
                }} onMouseUp={e => {
                    this.mouseUp(e)
                }}>
                    <a styleName="close" onClick={e => {
                        this.close(e, id)
                    }} title="关闭">
                        <i className="fa fa-times-circle"></i>
                    </a>
                    {restore}
                    <a styleName="close" style={{
                        right: '42px'
                    }} onClick={e => {
                        this.minimize(e, id, title, component)
                    }} title="最小化">
                        <i className="fa fa-minus-circle"></i>
                    </a>
                    <h6>
                        <span styleName="title">
                            <i className="fa fa-th-large"></i>&nbsp;{title}</span>
                    </h6>
                </div>
                <div styleName="dialogContent">{this.props.component}</div>
            </div>
        )
    }
}

const closeModal = (id) => {
    return {type: 'CLOSE_MODAL', id}
}

const addMinimizeModal = (option) => {
    return {type: 'ADD_MINI_MODAL', option}
}

const mapDispatchToProps = (dispatch) => {
    return {
        minimize: (option) => {
            dispatch(closeModal(option.id));
            dispatch(addMinimizeModal(option));
        },
        close: (id) => {
            dispatch(closeModal(id));
        }
    }
}

export default connect(null, mapDispatchToProps)(CSSModules(Modal, styles, {allowMultiple: true}))
