import React from 'react';
import styles from './header.scss';
import DatePicker from 'rsuite-datepicker';
import 'rsuite-datepicker/style/Default.less';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    changeTime(flag, d){
        let data = {}
        data[flag] = d;
        this.setState(data)
    }

    render() {
        let badge = `badge ${styles.badge} `;
        let drop = ` dropdown-menu ${styles.dropdown}`;

        let wid = Object.assign({
            width: '250px',
        }, this.props.style);

        return (
            <div className={styles.headerInfo}>
                <div style={wid}>
                    <DatePicker
                        dateFormat="YYYY-MM-DD"
                        autoClose = "true"
                        onChange={date => this.changeTime('st',date)}
                    />
                    ~
                    <DatePicker
                        dateFormat="YYYY-MM-DD"
                        autoClose = "true"
                        onChange={date => this.changeTime('et',date)}
                    />

                </div>
                <ul className={styles.headerInfoList}>
                    <li className="datetime">

                    </li>
                    {/* <li>
                        <a href="#">消息
                            <span className={badge}>4</span>
                        </a>
                    </li> */}
                    {/* <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">我的账户
                            <span className="caret"></span>
                        </a>
                        <ul className={drop} role="menu">
                            <li>
                                <a href="#" data-toggle="dialog" data-id="changepwd_page" data-mask="true" data-width="400" data-height="260">&nbsp;<span className="glyphicon glyphicon-lock"></span>
                                    修改密码</a>
                            </li>
                            <li>
                                <a href="#">&nbsp;<span className="glyphicon glyphicon-user"></span>
                                    我的资料</a>
                            </li>
                            <li className="divider"></li>
                            <li>
                                <a href="#" className="red">&nbsp;<span className="glyphicon glyphicon-off"></span>
                                    注销登陆</a>
                            </li>
                        </ul>
                    </li> */}
                </ul>
            </div>
        );
    }
}

export default Nav;
