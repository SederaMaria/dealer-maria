import React, { useState } from 'react'
import {
    Row,
    Col,
    Layout,
    Card,
    Form,
    Input,
    Button
} from 'antd';

import { MainHeader, } from '../../../layouts';
import { ReferenceSider } from '../../../layouts/ReferenceSider';
import '../../../layouts/styles/Reference.css'

const { Content } = Layout;

const Reference = () => {
    return (
        <>
            <MainHeader />
            <Layout>
                <ReferenceSider activeKey="references" />
                <Layout>
                    <Content id='main-content'>
                        <div className="reference-container">
                            <Card type="inner" title="Add Reference">
                                <Row className="largeInput">
                                    <Col span={4}>
                                        <Form.Item label="First Name">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={4}>
                                        <Form.Item label="Last Name">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>

                                    </Col>

                                    <Col span={4}>
                                        <Form.Item label="Phone Number">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>

                                    </Col>

                                    <Col span={4}>
                                        <Form.Item label="City">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={4}>
                                        <Form.Item label="State">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row className="create-reference">
                                    <Col>
                                        <Button id="create-reference" type="primary">Create Reference</Button>
                                    </Col>
                                </Row>

                            </Card>

                        </div>

                        <div className="reference-container">

                        </div>
                    </Content>

                </Layout>
            </Layout>
        </>


    )

}

export default Reference