import React, {useState} from 'react';
import { network, logger } from '../../../../utils';
import { Card, Row, Col, Form, Input, Button, Layout, Select } from 'antd';
import { MainHeader, BankSider, MainBreadcrumb } from '../../../layouts'
import '../../../layouts/styles/BankInfo.css'

const { Content } = Layout;
const {Option} = Select;

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
    data? : string | number | any
}

const BankingInformation: React.FC<Props> = ({leaseApplicationId, data}) => {

    const {
        payment_bank_name,
        payment_aba_routing_number,
        payment_account_number,
        payment_account_type
    } = data

    const [bankInfo, setBankinfo] = useState<Array<any>>([])

    const [currentInfo, setCurrentInfo] = useState<any>({
        paymentBankName: "",
        paymentAccountNumber: "",
        paymentAbaRoutingNumber: ""
    })


    const handleChange = (e:any) => {
        const {name, value} = e.target
        setCurrentInfo({...currentInfo, [name]:value})
    }

    const handleClick = () => {
        
        if (!currentInfo.paymentBankName || !currentInfo.paymentAccountNumber || !currentInfo.paymentAbaRoutingNumber || !currentInfo.paymentAccountType) return;
        
        setCurrentInfo({
            paymentBankName: currentInfo.paymentBankName,
            paymentAccountNumber: currentInfo.paymentAccountNumber,
            paymentAbaRoutingNumber: currentInfo.paymentAbaRoutingNumber,
            paymentAccountType: currentInfo.paymentAccountType,
        })

        try {
            network.PUT(`/api/v1/dealers/${leaseApplicationId}/banking-information`, currentInfo)
            .then(res => console.log(`res PUT`, res))
                
          } catch (e) {
            logger.error("Error sending banking information", e)
          }
          setBankinfo([...bankInfo, currentInfo])
    }

    console.log(`payment.bank_name`, payment_bank_name)
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
                                    { text:  `1234`, link_type: "linkto", link: "#" },
                                    { text: " Bank Information", link_type: "linkto", link: "#" },
                                ]}
                                />
                    </div>
                    <Content id='main-content'>
                    <div className="bank-info-container">
                        <Card type="inner" title="Lessee Banking Information">
                            <Form {...layout}
                                initialValues={{
                                    paymentBankName: payment_bank_name,
                                    paymentAbaRoutingNumber: payment_aba_routing_number,
                                    paymentAccountNumber: payment_account_number,
                                    paymentAccountType: payment_account_type
                                }}
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="paymentBankName" className="largeInput" label="Bank Name">
                                            <Input onChange={handleChange} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item name="paymentAbaRoutingNumber" className="largeInput" label="ABA Routing Number">
                                            <Input  onChange={handleChange} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item name="paymentAccountNumber" className="largeInput" label="Account Number">
                                            <Input onChange={handleChange} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item name="paymentAccountType" className="largeInput" label="Checking/Savings Account">
                                            <Select>
                                                <Option  value="checking">Checking</Option>
                                                <Option value="savings">Savings</Option>    
                                            </Select>
                                        </Form.Item>    
                                    </Col> 
                                </Row>
                                <Row className="submit-bank-info">
                                    <Col>
                                        <Button id="submit-bank-info" type="primary" onClick= {handleClick}>Submit Bank Information</Button>
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