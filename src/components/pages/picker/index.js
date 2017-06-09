import React from 'react';
// import ReactDOM from 'react-dom';

import { Header, Navbar, Nav, Row, Col } from 'rsuite';
import Markdown from './Markdown';

import 'rsuite-picker/less/index.less';
import './less/index.less';

import SimpleExample from './SimpleExample';
import OptionGroupExample from './OptionGroupExample';
import CustomLabelExample from './CustomLabelExample';
import MultipleExample from './MultipleExample';

export const PickerExample = React.createClass({
    render() {

        return (
              <div className="container-fluid">
                    <p className="sub-title">A react component for replacing default select and dropdown.</p>
                    <h2>Single pickers</h2>
                    <Row>
                        <Col md={6}>
                            <Markdown>
                                {require('./SimpleExample.md') }
                            </Markdown>
                        </Col>
                        <Col  md={6}>
                            <SimpleExample />
                        </Col>
                    </Row>
                    <hr/>
                      <hr/>
                        <hr/>
                    <h2>Option group support</h2>
                    <Row>
                        <Col md={6}>
                            <Markdown>
                                {require('./OptionGroupExample.md') }
                            </Markdown>
                        </Col>
                        <Col  md={6}>
                            <OptionGroupExample />
                        </Col>
                    </Row>
                    <hr/>
                      <hr/>
                        <hr/>
                    <h2>Custom label</h2>
                    <Row>
                        <Col md={6}>
                            <Markdown>
                                {require('./CustomLabelExample.md') }
                            </Markdown>
                        </Col>
                        <Col  md={6}>
                            <CustomLabelExample />
                        </Col>
                    </Row>
                    <hr/>
                      <hr/>
                        <hr/>
                    <h2>Multiple pickers</h2>
                    <Row>
                        <Col md={6}>
                            <Markdown>
                                {require('./MultipleExample.md') }
                            </Markdown>
                        </Col>
                        <Col  md={6}>
                            <MultipleExample />
                        </Col>
                    </Row>
                    <hr/>
                      <hr/>
                        <hr/>
                    <hr />
                    <a href="https://github.com/rsuite/rsuite-picker/tree/master/examples" target="_blank">
                        More Examples
                    </a>

                    <Markdown>
                        {require('./props.md') }
                    </Markdown>
                </div>
        );
    }
});

// ReactDOM.render(<App/>,
//     document.getElementById('app')
// );
