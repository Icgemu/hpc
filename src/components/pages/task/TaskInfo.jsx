import React from 'react';
//import styles from './container.scss'
import fetch from 'isomorphic-fetch';
import ECharts, { dispatchAction } from 'rsuite-echarts';
import Picker from 'rsuite-picker';
import '../echarts/style.less';
import baseBarOptions from '../echarts/data/bar-base';
import {bar} from "../hpc/echart"

class TaskInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {option1:{}};
    }
    componentDidMount() {
        fetch('/task/job_by_day').then((resp) => {
            return resp.json();
        }).then((arr) => {
            const x_data = [];
            const x_tmp = {}
            const status = [0,1,3,4]
            const series_tmp = status.map((item) =>{
                return x_data.map(r => {
                    const x = {}
                    x[r] = 0;
                    
                    return x
                })
            })

            arr.forEach((item) => {
                series_tmp[item.job_status][item.t] = item.cnt
            })

            const option1 = bar(x_data, series_tmp)
            this.setState({
                option1
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        let styles = Object.assign({
            width: '100%',
            height: '400px'
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

        var {option1} = this.state;
        var chart = option1.tooltip ? <ECharts  option={option1}/> : null
        return (

            <div className="doc-container">

                <div style={styles}>
                    <h1>RSuite ECharts</h1>
                    <p>ECharts for React</p>
                    {chart}
                </div>
            </div>
        );
    }
}


export default TaskInfo;
