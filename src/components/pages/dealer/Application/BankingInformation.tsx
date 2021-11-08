import React, {useState, useEffect} from 'react';
import { network, logger } from '../../../../utils';
import { Card, Row, Col, Form, Input, Button, Layout } from 'antd';
import { MainHeader, BankSider, MainBreadcrumb } from '../../../layouts'
import '../../../layouts/styles/BankInfo.css'


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

    const [bankInfo, setBankinfo] = useState<Array<any>>([])

    const [currentInfo, setCurrentInfo] = useState<any>({

        payment_bank_name: "",
        payment_account_number: "",
        payment_aba_routing_number: "",
        payment_account_type: ""
        
    })

    const [label, setLabel] = useState<any>({
        bank_name:"your bank name",
        account_number: "your routing number",
        routing_number: "ABA Routing Number",
        account_type: "Savings or Checking ?"
    })

    useEffect(() => {
        try {
            network.GET(`/api/v1/dealers/${leaseApplicationId}/banking-information`)
            .then(res=>{
                setLabel({
                    bank_name: res.data.payment.payment_bank_name,
                    account_number: res.data.payment.payment_account_number,
                    routing_number: res.data.payment.payment_aba_routing_number,
                    account_type: res.data.payment.payment_account_type
                })
            })  
            .catch(e=>{
                console.log(`no data error test`, e)
            })
    
          } catch (e) {
            logger.error("fetch banking information Error", e);
          }
    }, [])

    const handleChange = (e:any) => {
        const {name, value} = e.target
        setCurrentInfo({...currentInfo, [name]:value})
       
    }


    const handleClick = () => {
        
        if (!currentInfo.payment_bank_name || !currentInfo.payment_account_number || !currentInfo.payment_aba_routing_number || !currentInfo.payment_account_type) return;
        
        setCurrentInfo({
            payment_bank_name: currentInfo.payment_bank_name,
            payment_account_number: currentInfo.payment_account_number,
            payment_aba_routing_number: currentInfo.payment_aba_routing_number,
            payment_account_type: currentInfo.payment_account_type,
        })

        try {
            network.PUT(`/api/v1/dealers/${leaseApplicationId}/banking-information`, currentInfo)
            .then(res => console.log(`res PUT`, res))
                
          } catch (e) {
            logger.error("Error sending banking information", e)
          }
          setBankinfo([...bankInfo, currentInfo])
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
                                            <Input name="payment_bank_name" onChange={handleChange} placeholder={label.bank_name} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="ABA Routing Number">
                                            <Input name="payment_aba_routing_number" onChange={handleChange} placeholder={label.routing_number} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Account Number">
                                            <Input name="payment_account_number" onChange={handleChange} placeholder={label.account_number} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Checking/Savings Account">
                                            <Input name="payment_account_type" onChange={handleChange} placeholder={label.account_type} /> 
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