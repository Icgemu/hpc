import React from 'react';
import styles from './footer.scss'
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <footer id="gaei-footer" className={styles.footer}>Copyright &copy; 2015 - 2016
                <a href="http://oa.gaei.cn" target="_blank">广汽研究院</a>
            </footer>
        );
    }
}

export default Footer;
