import React from 'react';
import gaei from './gaei.png';
import styles from './header.scss';

class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {height} = this.props;
        let style = {
            height
        };
        let css = `${styles.logoBtnToggle} btn-default`;
        return (
            <div className={styles.logo} style={style}>
                <button type="button" className={css} data-toggle="collapse" data-target="#bjui-navbar-collapse">
                    <i className="fa fa-bars"></i>
                </button>
                <a className={styles.logoImg} href="#/"><img src={gaei} style={{
                height: '40px'
            }}/></a>
            </div>
        );
    }
}

export default Logo;
