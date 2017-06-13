import React from 'react';
//import styles from './container.scss'
import fetch from 'isomorphic-fetch';
import ECharts, { dispatchAction } from 'rsuite-echarts';
import Picker from 'rsuite-picker';
import '../echarts/style.less';
import '../echarts/highlight.less';
import baseBarOptions from '../echarts/data/bar-base';


const events = {
    click: function (params) {
        console.log(params);
    }
};

class NodeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { q_name: '', job_name: '' , myoption:{}};
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
                buckets.map( k =>{
                    mydata[k.key].push(k.doc_count/c)
                    sum += k.doc_count
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
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: d
                }
            })

            myoption.legend.data = legend_data
            myoption.series = series
            myoption.xAxis.data = percentiles
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
        var { queue, jobs, q_name, job_name ,myoption} = this.state;
        var chart = myoption.legend ? <ECharts  option={myoption}  onEvents={events} /> : null

        return (

            <div className="doc-container">

                <div style={styles}>
                    <h1>RSuite ECharts</h1>
                    <p>ECharts for React</p>
                    <Picker options={queue} defaultValue={q_name} onChange={(e) => this.handleSelect('q_name', e)} />
                    <Picker options={jobs} defaultValue={job_name} onChange={(e)=>this.handleSelect('job_name',e)}  />
                    {chart}
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
            name: '直接访问',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [320, 302, 301, 334, 390, 330, 320]
        },
        {
            name: '邮件营销',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '联盟广告',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '视频广告',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
        },
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

export default NodeInfo;
