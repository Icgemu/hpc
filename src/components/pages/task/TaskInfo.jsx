import React from 'react';
//import styles from './container.scss'
import fetch from 'isomorphic-fetch';
import ECharts, { dispatchAction } from 'rsuite-echarts';
import Picker from 'rsuite-picker';
import '../echarts/style.less';
import baseBarOptions from '../echarts/data/bar-base';

import {Option1} from "./option/Option1"
import {Option2} from "./option/Option2"
import {Option3} from "./option/Option3"
import {Option4} from "./option/Option4"
import {Option5} from "./option/Option5"
import {Option6} from "./option/Option6"
import {Option7} from "./option/Option7"
class TaskInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {option1:{},option2:{},option3:{},option4:{},option5:{},option6:{},option7:{}};
    }
    componentDidMount() {
        Option1(this)
        Option2(this)
        Option3(this)
        Option4(this)
        Option5(this)
        Option6(this)
        Option7(this)
    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        let styles = Object.assign({
            width: '100%',
            height: '300px'
        }, this.props.style);
        // var _this = this;
        // var events = {
        //     click: function (params) {
        //         var node = params.name
        //         fetch('/info/node?t=cpu&q='+node).then((resp) => {
        //             return resp.json();
        //         }).then((arr) => {
        //             var x =[]
        //             var data = [] 
        //             var queue = arr.map((item) => {
        //                var  t  = new Date()
        //                 t.setTime(item.t)
        //                 x.push(t.getHours()+':'+t.getMinutes()+':'+t.getSeconds())
        //                 data.push(item['cpu_usage'])
        //             })
        //             myoption_node.xAxis.data = x
        //             myoption_node.series[0].data = data
        //             _this.setState({
        //                 myoption2:myoption_node
        //             });
        //         })
        //     }
        // };

        var {option1,option2,option3,option4,option5,option6,option7} = this.state;
        var chart1 = option1.tooltip ? <ECharts  option={option1}/> : null
        var chart2 = option2.tooltip ? <ECharts  option={option2}/> : null
        var chart3 = option3.tooltip ? <ECharts  option={option3}/> : null
        var chart4 = option4.title ? <ECharts  option={option4}/> : null
        var chart5 = option5.tooltip ? <ECharts  option={option5}/> : null
        var chart6 = option6.tooltip ? <ECharts  option={option6}/> : null
        var chart7 = option7.tooltip ? <ECharts  option={option7}/> : null
        return (

            <div className="doc-container">

                <div style={styles}>
                    {chart1}
                </div>
                <div style={styles}>
                    {chart2}
                </div>
                <div style={styles}>
                    {chart3}
                </div>
                <div style={styles}>
                    {chart4}
                </div>
                 <div style={styles}>
                    {chart5}
                </div>
                 <div style={styles}>
                    {chart6}
                </div>
                 <div style={styles}>
                    {chart7}
                </div>
            </div>
        );
    }
}


export default TaskInfo;
