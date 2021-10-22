import React from 'react';
import { Card, Row, Col, Form, Input, Button, Layout } from 'antd';
import { MainHeader, BankSider } from '../../../layouts'
import '../../../layouts/styles/BankInfo.css'
import { MainBreadcrumb } from '../../../layouts';

const { Content } = Layout;

const layout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };

  interface Props {
    leaseApplicationId?: string | undefined
}

const BankingInformation: React.FC<Props> = ({leaseApplicationId}) => {

    return (
        <> 
            <MainHeader />
            <Layout>
                <BankSider activeKey="banking-information"/>
                <Layout>
                    <div className="indication">
                        <MainBreadcrumb 
                                items={[
                                    { text: " Dealers", link_type: "linkto", link: "#" },
                                    { text: " Lease Application", link_type: "linkto", link: "#" },
                                    { text:  `${leaseApplicationId}`, link_type: "linkto", link: "#" },
                                    { text: " Bank Information", link_type: "linkto", link: "#" },
                                ]}
                                />
                    </div>
                    <Content id='main-content'>
                    <div className="bank-info-container">
                        <Card type="inner" title="Lessee Banking Information">
                            <Form {...layout}>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item className="largeInput" label="Bank Name">
                                            <Input placeholder="Large Input" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="ABA Routing Number">
                                            <Input placeholder="Large Input" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Account Number">
                                            <Input placeholder="Large Input" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Checking/Savings Account">
                                            <Input placeholder="Large Input" /> 
                                        </Form.Item>
                                    </Col> 
                                </Row>
                            </Form>
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