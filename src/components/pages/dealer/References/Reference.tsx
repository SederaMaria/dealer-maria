import React, { useState } from 'react'
import {
    Row,
    Col,
    Layout,
    Typography,
    Card,
    Spin,
    Form,
    Input,
    Button
} from 'antd';

import { MainHeader, } from '../../../layouts';
import { ReferenceSider } from '../../../layouts/ReferenceSider';

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
                                    <Col span={5}>
                                        <Form.Item label="First Name">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={5}>
                                        <Form.Item label="Last Name">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>

                                    </Col>

                                    <Col span={5}>
                                        <Form.Item label="Phone Number">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>

                                    </Col>

                                    <Col span={5}>
                                        <Form.Item label="City">
                                            <Input placeholder="Large Input" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={5}>
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
                    </Content>

                </Layout>
            </Layout>
        </>


    )

}

export default Reference