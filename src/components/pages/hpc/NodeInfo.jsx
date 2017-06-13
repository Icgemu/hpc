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
        this.state = { q_name: '', job_name: '' };
    }

    componentDidMount() {
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
        var { queue, jobs, q_name, job_name } = this.state;
        return (

            <div className="doc-container">

                <div style={styles}>
                    <h1>RSuite ECharts</h1>
                    <p>ECharts for React</p>
                    <Picker options={queue} defaultValue={q_name} onChange={(e) => this.handleSelect('q_name', e)} />
                    <Picker options={jobs} defaultValue={job_name} onChange={(e)=>this.handleSelect('job_name',e)}  />
                    <ECharts  option={baseBarOptions}  onEvents={events} />
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

export default NodeInfo;
