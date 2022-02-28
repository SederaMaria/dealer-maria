import React, {useState} from 'react';
import { network, logger } from '../../../../utils';
import { Card, Row, Col, Form, Input, Button, Layout, Select, message } from 'antd';
import { MainHeader, BankSider, MainBreadcrumb } from '../../../layouts'
import '../../../layouts/styles/BankInfo.css'

const { Content } = Layout;
const {Option} = Select

const layout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };

  interface Payments {
        applicationIdentifier?: string | number | undefined 
        payment: any
    }


  interface Props {
    leaseApplicationId?: string | undefined
    data?: {
        leaseApplication?: Payments
    }
}

const BankingInformation: React.FC<Props> = ({leaseApplicationId, data}) => {
    
    const [bankInfo, setBankinfo] = useState<Array<any>>([])

    const appIdentifier = (data?.leaseApplication?.applicationIdentifier) ? (data?.leaseApplication?.applicationIdentifier) : leaseApplicationId
    
    const onFinish = (values: any) =>{
        try {
            network.PUT(`/api/v1/dealers/${leaseApplicationId}/banking-information`, values)
            message.success("Data saved successfully")

          } catch (e) {
            logger.error("Error sending banking information", e)
          }
          setBankinfo([...bankInfo, values])
    }   

    return (
        <> 
            <MainHeader />
            <Layout>
                <BankSider activeKey="banking-information"/>
                <Layout id="content-area-layout">
                    <MainBreadcrumb 
                        items={[
                            { text: "Home", link_type: "linkto", link: "/home" },
                            { text: "Lease Applications", link_type: "linkto", link: "/home" },
                            { text:  `${appIdentifier ? appIdentifier : leaseApplicationId}`, link_type: "linkto", link: "#" },
                            { text: "Bank Information", link_type: "linkto", link: "#" },
                            ]}
                        />
                    <Content id='main-content'>
                    <div className="bank-info-container">
                        <Card type="inner" title="Lessee Banking Information">
                            <Form 
                                {...layout}
                                initialValues={{
                                    paymentBankName: data?.leaseApplication?.payment.paymentBankName,
                                    paymentAbaRoutingNumber: data?.leaseApplication?.payment.paymentAbaRoutingNumber,
                                    paymentAccountNumber : data?.leaseApplication?.payment.paymentAccountNumber,
                                    paymentAccountType : data?.leaseApplication?.payment.paymentAccountType,
                                }}  
                                onFinish = {onFinish} 
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item label="Bank Name" name="paymentBankName" rules={[{
                                          required : true,
                                          message : "This field is required"
                                        }]} >
                                            <Input /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item label="ABA Routing Number" name="paymentAbaRoutingNumber" rules={[{
                                          required : true,
                                          message : "This field is required"
                                        }]} >
                                            <Input /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item label="Account Number" name="paymentAccountNumber"
                                        rules={[{
                                            required : true,
                                            message : "This field is required"
                                          }]} >
                                            <Input /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item label="Checking/Savings Account" name="paymentAccountType"
                                        rules={[{
                                            required : true,
                                            message : "This field is required"
                                          }]}> 
                                            <Select>
                                              <Option  value="checking">Checking</Option>
                                              <Option value="savings">Savings</Option>
                                            </Select>
                                        </Form.Item>    
                                    </Col> 
                                </Row>
                                <Row className="submit-bank-info">
                                    <Col>
                                        <Button id="submit-bank-info" htmlType="submit" type="primary" >Submit Bank Information</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </div>
                    </Content>
                </Layout>  
            </Layout> 
        </>
    )
   
}

export default BankingInformation;