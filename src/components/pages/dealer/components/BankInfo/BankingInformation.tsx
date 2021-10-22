import React from 'react';
import { Card, Row, Col, Form, Input, Button, Layout, Typography } from 'antd';
import { MainHeader} from '../../../../layouts'
import {BankSider} from '../../../../layouts/BankSider';
import '../../../../layouts/styles/BankInfo.css'

const { Content } = Layout;
const {Title} = Typography;
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
                            <Row gutter={16}>
                                <Col xs={24} sm={12} md={6}>
                                    <Title className="largeInput" level={5}>Bank Name</Title>
                                    <Input placeholder="Large Input" />
                                </Col> 
            
                                <Col xs={24} sm={12} md={6}> 
                                    <Title className="largeInput" level={5}>ABA Routing Number</Title>
                                    <Input placeholder="Large Input" />
                                </Col> 
            
                                <Col xs={24} sm={12} md={6}> 
                                    <Title className="largeInput" level={5}>Account Number</Title>
                                    <Input placeholder="Large Input" />
                                </Col> 
            
                                <Col xs={24} sm={12} md={6}> 
                                    <Title className="largeInput" level={5}>Checking/Savings Account</Title>
                                    <Input  placeholder="Large Input" />
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
