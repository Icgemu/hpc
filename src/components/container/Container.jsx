import React from 'react';
import Leftbar from './Leftbar';
import Navtab from './Navtab';
import {connect} from 'react-redux';
import styles from './container.scss'
import {AppConfig} from '../app/AppConfig'
import {delTab} from '../reducers/index';
class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.resize();
        $(window).resize(this.resize.bind(this));
    }

    windowInfo() {
        let ww = $(window).width();
        let hh = $(window).height();

        let th = $('#gaei-header').height();
        let fh = $('#gaei-footer').height();
        return {ww, hh, th, fh: 0}
    }

    resize() {
        let {ww, hh, th, fh} = this.windowInfo();
        let height = hh - th - fh - 6;
        let width = ww;
        let sidebar = 200;

        this.setState({height, width, sidebar});
    }

    delTab(e, item) {
        let id = item.id;
        let tabs = this.props.tabs.filter(t => {
            return t.id != item.id
        });
        let actives = tabs.filter(t => {
            return t.active
        });

        if (actives.length === 0) {
            let path = tabs[tabs.length - 1].path;
            this.props.router.push(path);
        }
        this.props.onDelete(id);
    }

    render() {
        let {height, width, sidebar} = this.state;
        let {close,active,gaeiContainer,navtab,tabsPageHeader,tabsPageHeaderContent,navTabs} = styles;
        // let ctabs = this.props.tabs;
        let tabs = this.props.tabs.map((item, i) => {
            let span;
            if (i !== 0) {
                span = <span id={item.id} className={close} onClick={e => {
                    this.delTab(e, item)
                }}>×</span>;
            }
            let activeCls = item.active
                ? active
                : ''
            return (
                <li className={activeCls}>
                    <a href={`#${item.path}`}>
                        <span>
                            <i className="fa fa-home"></i>
                            {item.title}</span>
                    </a>
                    {span}
                </li>
            )
        });

        let left = AppConfig.leftbar
            ? (
                <Leftbar width={sidebar} height={height}>
                    {this.props.left}
                </Leftbar>
            )
            : null;

        let rw = AppConfig.leftbar
            ? (width - sidebar - 6)
            : (width);
        let rstyle = AppConfig.leftbar
            ? {
                width: rw + 'px',
                height: height + 'px'
            }
            : {
                left: 0,
                width: rw + 'px',
                height: height + 'px'
            }
        return (
            <div className={gaeiContainer} style={{
                height: height + 'px',
                width: width + 'px'
            }}>
                {left}
                <div className={navtab} style={rstyle}>
                    <div className={tabsPageHeader}>
                        <div className={tabsPageHeaderContent}>
                            <ul className={navTabs}>
                                {tabs}
                            </ul>
                        </div>
                    </div>

                    <Navtab width={rw} height={height}>
                        {this.props.children}
                    </Navtab>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let ctabs = state.tabs;
    return {
        tabs: [...ctabs]
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDelete: (id) => {
            dispatch(delTab(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
