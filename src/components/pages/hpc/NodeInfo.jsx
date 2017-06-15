import React from 'react';
//import styles from './container.scss'
import fetch from 'isomorphic-fetch';
import ECharts, { dispatchAction } from 'rsuite-echarts';
import Picker from 'rsuite-picker';
import '../echarts/style.less';
import '../echarts/highlight.less';
import baseBarOptions from '../echarts/data/bar-base';

class NodeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { q_name: '', job_name: '' , myoption:{}, myoption2:{}};
    }



    componentDidMount() {
        fetch('/info/node_stats/cpu/1').then((resp) => {
            return resp.json();
        }).then((arr) => {
            var percentiles = arr.map((e)=>{
                return e.key
            })
            var legend_data = ['0','10','20','30','40','50','60','70','80','90']
            var mydata = {}
            legend_data.map((e)=>{
                mydata[e]=[]
            })
            arr.map((e)=>{
                var buckets = e.bins.buckets;
                var c = e.doc_count
                var sum = 0
                var localdata = {} 
                buckets.map( k =>{
                    localdata[k.key+''] = (k.doc_count/c)
                    sum += k.doc_count
                })
                legend_data.map(e=>{
                    if(localdata[e] && localdata[e]>=0){
                        mydata[e].push(localdata[e])
                    }else{
                         mydata[e].push(0.0)
                    }
                })
                console.log(c+':'+sum)
            })
            var series = legend_data.map((e)=>{
                var d = mydata[e]
                // var sum = 0
                //  d.map(e=>{sum += e})
                //  d = d.map(e=>e/sum)
                return {
                    name: e,
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: d
                }
            })

            myoption.legend.data = legend_data
            myoption.series = series
            myoption.xAxis.data = percentiles

            console.log(JSON.stringify(myoption))
            this.setState({
                myoption
            });
        })

        fetch('/info/q').then((resp) => {
            return resp.json();
        }).then((arr) => {
            var queue = arr.map((item) => {
                return {
                    label: item.key,
                    value: item.key
                }
            })
            this.setState({
                queue
            });
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.q_name != '' && this.state.q_name != prevState.q_name) {
            fetch('/info/jobs?q=' + this.state.q_name).then((resp) => {
                return resp.json();
            }).then((arr) => {
                var jobs = arr.map((item) => {
                    return {
                        label: item.key,
                        value: item.key
                    }
                })
                this.setState({
                    jobs
                });
            })
        }
    }

    render() {
        let styles = Object.assign({
            width: '100%',
            height: '400px'
        }, this.props.style);
        var _this = this;
        var events = {
            click: function (params) {
                var node = params.name
                fetch('/info/node?t=cpu&q='+node).then((resp) => {
                    return resp.json();
                }).then((arr) => {
                    var x =[]
                    var data = [] 
                    var queue = arr.map((item) => {
                       var  t  = new Date()
                        t.setTime(item.t)
                        x.push(t.getHours()+':'+t.getMinutes()+':'+t.getSeconds())
                        data.push(item['cpu_usage'])
                    })
                    myoption_node.xAxis.data = x
                    myoption_node.series[0].data = data
                    _this.setState({
                        myoption2:myoption_node
                    });
                })
            }
        };

        var { queue, jobs, q_name, job_name ,myoption,myoption2} = this.state;
        var chart = myoption.legend ? <ECharts  option={myoption}  onEvents={events} /> : null
         var chart1 = myoption2.tooltip ? <ECharts  option={myoption2} /> : null
        return (

            <div className="doc-container">

                <div style={styles}>
                    <h1>RSuite ECharts</h1>
                    <p>ECharts for React</p>
                    <Picker options={queue} defaultValue={q_name} onChange={(e) => this.handleSelect('q_name', e)} />
                    <Picker options={jobs} defaultValue={job_name} onChange={(e)=>this.handleSelect('job_name',e)}  />
                    {chart}
                    {chart1}
                </div>
            </div>
        );
    }

    handleSelect(key, value) {
        console.log(key + "=" + value);
        var s = {};
        s[key] = value;
        if(key =='q_name'){
            s['job_name'] = '';
        }
        this.setState(s);
    }


}


const myoption =  {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['直接访问', '邮件营销','联盟广告','视频广告','搜索引擎']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis:  {
        type: 'value'
    },
    xAxis: {
        type: 'category',
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    series: [
        {
            name: '搜索引擎',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
        }
    ]
};

const myoption_node =  {
    tooltip : {
        trigger: 'axis'
    },
    yAxis:  {
        type: 'value'
    },
    xAxis: {
        type: 'category',
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    series: [
        {
            name: 'cpu',
            type: 'line',         
            data: [320, 302, 301, 334, 390, 330, 320]
        }
    ]
};

export default NodeInfo;
