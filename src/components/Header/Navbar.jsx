import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {activeLink} from '../reducers/index';
import styles from './header.scss';
class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    onLinkClick(e, item) {
        this.props.onLinkClick(item.id);
    }
    render() {

        let lis = this.props.links.map((item, i) => {
            let active = (item.id === this.props.currentActive.id)
                ? `${styles.active}`
                : null;

            return (
                <li className={active}>
                    <Link to={item.path} onClick={e => {
                        this.onLinkClick(e, item)
                    }}>
                        <i className="fa fa-check-square-o"></i>
                        {item.title}
                    </Link>
                </li>
            )
        })
        return (
            <div className={styles.hnav}>
                <div className={styles.hnavBox}>
                    <ul className={styles.hnavUI}>
                        {lis}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLinkClick: (id) => {
            dispatch(activeLink(id))
        }
    }
}
const mapStateToProps = (state, ownProps) => {
    return {links: state.links.links, currentActive: state.links.currentActive}
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
