
import React from 'react';
import ReactDOM from 'react-dom';
import ECharts, {dispatchAction} from 'rsuite-echarts';
import Markdown from './Markdown';

import './style.less';
import './highlight.less';


import baseBarOptions from './data/bar-base';


const events = {
    click:function(params){
        console.log(params);
    }
};

export const EchartsApp = React.createClass({

    render() {
         let styles = Object.assign({
            width: '100%',
            height: '400px'
        }, this.props.style);

        return (

                <div className="doc-container">

                    <div style={styles}>
                        <h1>RSuite ECharts</h1>
                        <p>ECharts for React</p>
                        <ECharts  option={baseBarOptions}  onEvents={events} />

                          <Markdown>
                              {require('./README.md') }
                          </Markdown>
                    </div>
                </div>

        );
    }
});

//
// const rootElement = document.getElementById('app');
//
// ReactDOM.render(<App />,
//     rootElement
// );
