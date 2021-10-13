import React from 'react';
import { Card, Row, Col, Form, Input, Button } from 'antd';
import '../../../../layouts/styles/BankInfo.css'

const BankingInformation = () => {
    
    return <div className="bank-info-container">
        <Card type="inner" title="Lessee Banking Information">
            <Row className="largeInput">
                <Col span={5}> 
                    <Form.Item>  
                        <b>Bank Name</b>
                    </Form.Item>

                    <Form.Item >  
                        <Input placeholder="Large Input" />
                    </Form.Item>
                </Col> 

                <Col span={5}> 
                    <Form.Item>  
                        <b>ABA Routing Number</b>
                    </Form.Item>

                    <Form.Item >  
                        <Input placeholder="Large Input" />
                    </Form.Item>
                </Col> 

                <Col span={5}> 
                    <Form.Item>  
                        <b>Account Number</b>
                    </Form.Item>

                    <Form.Item >  
                        <Input placeholder="Large Input" />
                    </Form.Item>
                </Col> 

                <Col span={5}> 
                    <Form.Item>  
                        <b>Checking / Savings Account</b>
                    </Form.Item>

                    <Form.Item >  
                        <Input placeholder="Large Input" />
                    </Form.Item>
                </Col> 
            </Row>
            <Row className="submit-bank-info">
                <Col>
                    <Button type="primary">Submit Bank Information</Button>
                </Col>
            </Row>
        </Card>
    </div>
}

export default BankingInformation;
