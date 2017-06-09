import React from 'react'
import {Link} from 'react-router'
class Tabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {height} = this.props;
        let style = {
            height
        };
        let links = this.props.links.map((item, i) => {
            let ul;
            if (item.group) {
                let lis = item.childs.map(child => {
                    let {path, id, title} = child;
                    return (
                        <li>
                            <Link to={path} id={id} title={title}>{title}</Link>
                        </li>
                    )
                });
                ul = (
                    <li>
                        {item.group}
                        <ul>
                            {lis}
                        </ul>
                    </li>
                )
            } else {
                let {path, id, title} = item;
                ul = (
                    <li>
                        <Link to={path} id={id} title={title}>{title}</Link>
                    </li>
                )
            }
            return ul
        })

        return (
            <ul>{links}</ul>
        )
    }
}

export default Tabs;
