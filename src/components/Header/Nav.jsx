import React from 'react';
import styles from './header.scss';
import DatePicker from 'rsuite-datepicker';
import 'rsuite-datepicker/style/Default.less';

import {Grid,Row,Col,Button} from "rsuite"

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

       fetch("/get_time",{credentials: 'include'}).then((resp) => {
           return resp.json();
       }).then((arr) => {
           //_this.setState(arr)
           if(arr && arr["st"] & arr["et"]){
               console.log(JSON.stringify(arr))
                this.setState({"st":new Date(arr["st"]),"et":new Date(arr["et"])})
           }
       })
    }

    changeTime(flag, d){
        let data = {}
        data[flag] = d;
        this.setState(data)
    }

    setTime(e){
       var  {st,et} = this.state
       var s = st.getTime();
       var e = et.getTime();
        var url = `/time/${s}/${e}`
       fetch(url,{credentials: 'include'}).then((resp) => {
           return resp.json();
       }).then((arr) => {
           //_this.setState(arr)
           if(arr && arr["result"]  == "ok"){
                window.location.reload()
            //    fetch("/get_time",{credentials: 'include'}).then((resp) => {
            //        return resp.json();
            //    }).then((arr) => {
            //        //_this.setState(arr)
            //        if (arr && arr["st"] & arr["et"]) {
            //            console.log(JSON.stringify(arr))
            //         //    this.setState(arr)
            //        }
            //    })
           }
       })
        //this.setState(data)
        // alert(st.getTime() +"~" +et.getTime())
        // var r = this.props.router
       
    }

    render() {
        let badge = `badge ${styles.badge} `;
        let drop = ` dropdown-menu ${styles.dropdown}`;

        let wid = Object.assign({
            width: '450px',
        }, this.props.style);
        let {st,et} = this.state
        let sd = st?(st.toLocaleDateString()) : "";
        let ed = et?(et.toLocaleDateString()) : "";
        return (
            <div className={styles.headerInfo}>
                <div style={wid}>
                    
                        <Row><Col xs={4}>
                    <DatePicker
                        dateFormat="YYYY/M/D"
                        autoClose = "true"
                        placeholder={sd}
                        onSelect={date => this.changeTime('st',date)}
                    /></Col>
                    <Col xs={1}>~</Col>
                    <Col xs={4}><DatePicker
                        dateFormat="YYYY/M/D"
                        autoClose = "true"
                        placeholder={ed}
                        onSelect={date => this.changeTime('et',date)}
                    /></Col>
                    <Col xs={3}><Button shape='primary' onClick={e =>{ 
                            this.setTime(e)
                        }}>确定</Button></Col>
                    </Row>
                    
                </div>
            </div>
        );
    }
}

export default Nav;
