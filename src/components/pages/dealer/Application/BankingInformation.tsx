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
        payment_bank_name?: string | number | undefined 
        payment_aba_routing_number?: string | number | undefined
        payment_account_number?: string | number | undefined
        payment_account_type?: string | number | undefined
        application_identifier?: number | undefined
    }


  interface Props {
    leaseApplicationId?: string | undefined
    data?: {
        payment?: Payments
        application_identifier? : Payments
    }
}

const BankingInformation: React.FC<Props> = ({leaseApplicationId, data}) => {
    console.log(`data`, data)
    const [bankInfo, setBankinfo] = useState<Array<any>>([])

    const appIdentifier = (data?.application_identifier) ? (data?.application_identifier) : leaseApplicationId

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
                <Layout>
                    <div className="indication">
                        <MainBreadcrumb 
                                items={[
                                    { text: " Dealers", link_type: "linkto", link: "#" },
                                    { text: " Lease Application", link_type: "linkto", link: "#" },
                                    { text:  `${appIdentifier}`, link_type: "linkto", link: "#" },
                                    { text: " Bank Information", link_type: "linkto", link: "#" },
                                ]}
                                />
                    </div>
                    <Content id='main-content'>
                    <div className="bank-info-container">
                        <Card type="inner" title="Lessee Banking Information">
                            <Form 
                                {...layout}
                                initialValues={{
                                    paymentBankName: data?.payment?.payment_bank_name,
                                    paymentAbaRoutingNumber: data?.payment?.payment_aba_routing_number,
                                    paymentAccountNumber : data?.payment?.payment_account_number,
                                    paymentAccountType : data?.payment?.payment_account_type,
                                }}  
                                onFinish = {onFinish} 
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item className="largeInput" label="Bank Name" name="paymentBankName" rules={[{
                                          required : true,
                                          message : "This field is required"
                                        }]} >
                                            <Input placeholder="your bank name" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="ABA Routing Number" name="paymentAbaRoutingNumber" rules={[{
                                          required : true,
                                          message : "This field is required"
                                        }]} >
                                            <Input  placeholder="your routing number" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Account Number" name="paymentAccountNumber"
                                        rules={[{
                                            required : true,
                                            message : "This field is required"
                                          }]} >
                                            <Input placeholder="your account number" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Checking/Savings Account" name="paymentAccountType">
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