import React from 'react';
import styles from './container.scss';

class Leftbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {width, height} = this.props;
        return (
            <div className={styles.leftside}>
                <div className={styles.sidebar} style={{
                    width: width + 'px',
                    height: height + 'px'
                }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Leftbar;
