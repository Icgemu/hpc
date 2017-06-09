import React from 'react';
import Nav from './Nav';
import Logo from './Logo';
import Navbar from './Navbar';

import styles from './header.scss';

class TopHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <header id="gaei-header" className={styles.gaeiHeader}>
                <Logo/>
                <Nav/>
                <Navbar/>
            </header>
        );
    }
}

export default TopHeader;
