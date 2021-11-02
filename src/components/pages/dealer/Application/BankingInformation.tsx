import React, {useState} from 'react';
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
        bank_name: "",
        account_number: "",
        routing_number: "",
        account_type: "",
        access_id: ""
    })

    const handleChange = (e:any) => {
        const {name, value} = e.target
        setCurrentInfo({...currentInfo, [name]:value})
    }

    const handleClick = () => {
        console.log(`currentInfo`, currentInfo)
        if (!currentInfo.bank_name || !currentInfo.account_number || !currentInfo.routing_number || !currentInfo.account_type) return;
        
        setCurrentInfo({
            bank_name: currentInfo.bank_name,
            account_number: currentInfo.account_number,
            routing_number: currentInfo.routing_number,
            account_type: currentInfo.account_type,
            access_id: leaseApplicationId
        })

        try {
            network.POST('/api/v1/applications/banking-information', currentInfo)
            .then(res => console.log(`res`, res))
                
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
                                            <Input name="bank_name" onChange={handleChange} placeholder="your bank name" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="ABA Routing Number">
                                            <Input name="routing_number" onChange={handleChange} placeholder="your routing number" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Account Number">
                                            <Input name="account_number" onChange={handleChange} placeholder="your account number" /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Checking/Savings Account">
                                            <Input name="account_type" onChange={handleChange} placeholder="Savings or Checking ?" /> 
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