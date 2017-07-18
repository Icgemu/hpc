import React from 'react';
//import styles from './container.scss'
import fetch from 'isomorphic-fetch';
import ECharts, { dispatchAction } from 'rsuite-echarts';
import Picker from 'rsuite-picker';
import '../echarts/style.less';
import echarts from 'echarts';
import baseBarOptions from '../echarts/data/bar-base';
import {Option1} from "./option/Option1"
class NodeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {option1:{},option2:{},option3:{},option4:{},option5:{},option6:{},option7:{},option8:{}};
    }
    componentDidMount() {
        Option1(this)
        // Option2(this)
        // ECharts.connect("g1")
    }

    componentDidUpdate(prevProps, prevState) {
        // var dom2 = document.getElementById("u1")
        // var dom3 = document.getElementById("u2")
        // if(dom2 && dom3){          
        //     setTimeout(()=>{
        //         var chart2 = ECharts.getInstanceByDom(dom2)
        //         var chart3 = ECharts.getInstanceByDom(dom3)
        //         ECharts.connect([chart2,chart3])
        //     },100);
        // }
        
    }

    render() {
        let styles = Object.assign({
            width: '100%',
            height: '300px',
            borderBottom: '1px dashed #000'
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

        var {option1,option2,option3,option4,option5,option6,option7,option8} = this.state;
        // var g = "g1"
        var chart1 = option1.tooltip ? <ECharts id="n1" group="n2" option={option1}/> : null
        // var chart2 = option2.tooltip ? <ECharts id="u2"  group="g2" option={option2}/> : null
        // var chart3 = option3.tooltip ? <ECharts id="c3"  group="g1" option={option3}/> : null
        // var chart4 = option4.title ? <ECharts  id="c4" option={option4}/> : null
        // var chart5 = option5.tooltip ? <ECharts id="c5"  option={option5}/> : null
        // var chart6 = option6.tooltip ? <ECharts id="c6"  option={option6}/> : null
        // var chart7 = option7.tooltip ? <ECharts id="c7"  option={option7}/> : null
        // var chart8 = option8.tooltip ? <ECharts id="c8"  option={option8}/> : null
        return (

            <div className="doc-container">
                
                <div style={styles}>
                    {chart1}
                </div>
                {/* <div style={styles}>
                    {chart2}
                </div>
                <div style={styles}>
                    {chart3}
                </div>
                <div style={styles}>
                    {chart4}
                </div>
                <div style={styles}>
                    {chart8}
                </div>
                 <div style={styles}>
                    {chart5}
                </div>
                 <div style={styles}>
                    {chart6}
                </div>
                 <div style={styles}>
                    {chart7}
                </div> */}
            </div>
        );
    }
}


export default NodeInfo;
