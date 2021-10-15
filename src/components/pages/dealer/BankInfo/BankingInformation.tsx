import React from 'react';
import { Card, Row, Col, Form, Input, Button, Layout } from 'antd';
import { MainHeader, BankSider } from '../../../layouts'
import '../../../layouts/styles/BankInfo.css'

const { Content } = Layout;
const BankingInformation = () => {

    return (
        <> 
            <MainHeader />
            <Layout>
                <BankSider activeKey="banking-information"/>
                <Layout>
                    <Content id='main-content'>
                    <div className="bank-info-container">
                        <Card type="inner" title="Lessee Banking Information">
                            <Row className="largeInput">
                                <Col span={5}>
                                <Form.Item label="Bank Name">
                                      <Input placeholder="Large Input" />
                                </Form.Item>
                                </Col> 
            
                                <Col span={5}> 
                                    <Form.Item label="ABA Routing Number">  
                                        <Input placeholder="Large Input" />
                                    </Form.Item>
                                </Col> 
            
                                <Col span={5}> 
                                    <Form.Item label="Account Number">  
                                        <Input placeholder="Large Input" />
                                    </Form.Item>
                                </Col> 
            
                                <Col span={5}> 
                                    <Form.Item label="Checking / Savings Account">   
                                        <Input placeholder="Large Input" />
                                    </Form.Item>
                                </Col> 
                            </Row>
                            <Row className="submit-bank-info">
                                <Col>
                                    <Button id="submit-bank-info" type="primary">Submit Bank Information</Button>
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

export default BankingInformation;
