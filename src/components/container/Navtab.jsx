import React from 'react';
import styles from './container.scss'
class Navtab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {width, height} = this.props;

        return (
            <div className={styles.tabsPageContent} style={{
                width: width + 'px',
                height: (height - 26) + 'px'
            }}>
                <div className={styles.navtabPage} style={{
                    width: width + 'px',
                    height: (height - 26) + 'px'
                }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Navtab;
