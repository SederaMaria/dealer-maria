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

  interface Payments {
        payment_bank_name?: string | number | undefined
        payment_aba_routing_number?: string | number | undefined
        payment_account_number?: string | number | undefined
        payment_account_type?: string | number | undefined
    }

  interface Props {
    leaseApplicationId?: string | undefined
    data?: {
        payment?: Payments
    }
}

const BankingInformation: React.FC<Props> = ({leaseApplicationId, data}) => {

    console.log(data?.payment)

    const [bankInfo, setBankinfo] = useState<Array<any>>([])

    const [currentInfo, setCurrentInfo] = useState<any>({
        paymentBankName: "",
        paymentAccountNumber: "",
        paymentAbaRoutingNumber: ""
    })

    // useEffect(() => {
    //     try {
    //         network.GET(`/api/v1/dealers/${leaseApplicationId}/banking-information`)
    //         .then(res=>{
    //             setLabel({
    //                 bank_name: res.data.payment.payment_bank_name,
    //                 account_number: res.data.payment.payment_account_number,
    //                 routing_number: res.data.payment.payment_aba_routing_number,
    //                 account_type: res.data.payment.payment_account_type
    //             })

    //             setApp_identifier(res.data.application_identifier)
    //         })  
    //         .catch(e=>{
    //             console.log(`no data error test`, e)
    //         })
    
    //       } catch (e) {
    //         logger.error("fetch banking information Error", e);
    //       }
    // }, [])

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
                            <Form 
                                {...layout}
                                initialValues={{
                                    payment_bank_name: data?.payment?.payment_bank_name,
                                    payment_aba_routing_number: data?.payment?.payment_aba_routing_number,
                                    payment_account_number : data?.payment?.payment_account_number,
                                    payment_account_type : data?.payment?.payment_account_type,
                                }}   
                                    >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item className="largeInput" label="Bank Name" name="payment_bank_name" >
                                            <Input name="payment_bank_name" onChange={handleChange} placeholder={label.bank_name} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="ABA Routing Number" name="payment_aba_routing_number" >
                                            <Input name="payment_aba_routing_number" onChange={handleChange} placeholder={label.routing_number} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Account Number" name="payment_account_number" >
                                            <Input name="payment_account_number" onChange={handleChange} placeholder={label.account_number} /> 
                                        </Form.Item>
                                    </Col> 
                                
                                    <Col xs={24} sm={12} md={6}> 
                                        <Form.Item className="largeInput" label="Checking/Savings Account" name="payment_account_type" >
                                            <select name="payment_account_type" className="select-option" onChange={handleChange}>
                                              <option value="">{label.account_type ? label.account_type : "Please Select"}</option>
                                              <option value="checking">Checking</option>
                                              <option value="savings">Savings</option>
                                            </select>
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