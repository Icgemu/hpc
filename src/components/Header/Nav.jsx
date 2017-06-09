import React from 'react';
import styles from './header.scss';
class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let badge = `badge ${styles.badge} `;
        let drop = ` dropdown-menu ${styles.dropdown}`;

        return (
            <div className={styles.headerInfo}>
                <ul className={styles.headerInfoList}>
                    <li className="datetime">
                        <div>
                            <span id="bjui-date"></span>
                            <span id="bjui-clock"></span>
                        </div>
                    </li>
                    <li>
                        <a href="#">消息
                            <span className={badge}>4</span>
                        </a>
                    </li>
                    <li className="dropdown">
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
                    </li>
                </ul>
            </div>
        );
    }
}

export default Nav;
