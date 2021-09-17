import React from 'react'
import { Row, Col, Card, Button, Form, Input, Select, Typography, Layout } from "antd";

const { Title } = Typography;
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
    setStep: React.Dispatch<React.SetStateAction<string>>;
}

export const Calculator: React.FC<Props> = ({setStep}: Props) => {

    const [lesseeForm] = Form.useForm();


    return (
        <div style={{ margin: `20px 100px` }}>
            <div style={{ textAlign: `center`}}>
                <Title level={2}> Calculator </Title>
                <p> Add your bike's purchase price and options to  calculate your payments. </p>
            </div>

            <Form 
                // form={lesseeForm} 
                {...layout}  
                // colon={false}
                // onFinish={handleSubmit}
                // scrollToFirstError={true}
                // initialValues={{
                //     applicationDisclosureAgreement: 'unchecked'
                // }}
            >
                <Content className="content-1">

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Customer and Bike Information">
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Dealership's State" 
                                            hasFeedback
                                            rules={[{ required: true, message: `Dealership's State is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Dealership's County/Tax Jurisdiction" 
                                            hasFeedback
                                            rules={[{ required: true, message: `Dealership's County/Tax Jurisdiction is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Year" 
                                            hasFeedback
                                            rules={[{ required: true, message: ` is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>



                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Make" 
                                            hasFeedback
                                            rules={[{ required: true, message: ` is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Bike Condition" 
                                            hasFeedback
                                            rules={[{ required: true, message: ` is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>



                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Mileage Range" 
                                            hasFeedback
                                            rules={[{ required: true, message: ` is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>



                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Credit Tier" 
                                            hasFeedback
                                            rules={[{ required: true, message: ` is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Lessee Term" 
                                            hasFeedback
                                            rules={[{ required: true, message: ` is required` }]}
                                        >  
                                            <Select showSearch ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={12}> 
                                        NADA Rental
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>

                                <Row>
                                    <Col span={12}> 
                                        Purchase Option (Residual)
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>
                                <br/>

                                <Row>
                                    <Col span={24}> 
                                    <Title level={4}> Total Sale Price Calculation </Title>
                                    </Col> 
                                </Row>

                                <br/>

                                <Row>
                                    <Col span={16}> 
                                        Purchase Option (Residual)
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={16}> 
                                        Dealer Freight and Setup Cost
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={16}> 
                                        Total Bike Price
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            $123,123,120
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={16}> 
                                        Up-Front Sale or Use Tax
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            $123,123,120
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={16}> 
                                        Title, License, and Lien Fee
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={16}> 
                                        Dealer Documentation Fee
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={16}> 
                                        GAP
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>



                                <Row>
                                    <Col span={16}> 
                                        Pre-Paid Maintenance
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={16}> 
                                        Service Contract
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={16}> 
                                        Tire and Wheel
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <br/>

                                <Row>
                                    <Col span={12}> 
                                    Total Sales Price
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>

                                <Row>
                                    <Col span={12}> 
                                    
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`, fontWeight: 700}}> 
                                        <span>Subject to Credit Approval </span>
                                    </Col> 
                                </Row>

                            </Card>
                        </Col>
                        
                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Cap Cost Reduction (Down Payment)">
                                <Row>
                                    <Col span={16}> 
                                        Gross Trade Allowance
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={16}> 
                                        Trade-in Payoff
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <br/>

                                <Row>
                                    <Col span={12}> 
                                    Net Trade-In Allowance
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>

                                <Row>
                                    <Col span={16}> 
                                        Cash
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                <Row>
                                    <Col span={12}> 
                                    Total Cap Cost Reduction
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>
                                
                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Net Due on Motorcycle
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>
                                <Row>
                                    <Col span={16}> 
                                    Acquisition Fee
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`, borderBottom: `2px solid grey`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Total Cap Cost
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Total Gross Cap Cost
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>




                                <br/>
                                <div style={{padding: 20, backgroundColor: '#F5F6F8'}}>
                                    <Title level={4}> Customer Monthly Payment </Title>
                                    <Row>
                                        <Col span={12}> 
                                        Base Monthly Payment
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>

                                    <br/>
                                    <Row>
                                        <Col span={12}> 
                                        Monthly Sales Tax
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>

                                    <br/>
                                    <Row style={{color: `#1890ff`}}>
                                        <Col span={12}> 
                                        Total Monthly Payment
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>

                                    <Title level={4}> Cash Paid at Signing </Title>
                                    <Row>
                                        <Col span={12}> 
                                        First Monthly Payment
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>

                                    <br/>
                                    <Row>
                                        <Col span={12}> 
                                        Refundable Security Deposit
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>

                                    <br/>
                                    <Row>
                                        <Col span={12}> 
                                        Additional Cash Down
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>



                                    <br/>
                                    <Row style={{color: `#1890ff`}}>
                                        <Col span={12}> 
                                        Total Cash at Signing
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>
                                </div>



                            </Card>
                        </Col>






                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Cash Out of Pocket Helper">
                                
                                <Row>
                                    <Col span={16}> 
                                        Total Cash Out of Pocket
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Input style={{textAlign: `right`}} ></Input>
                                        </Form.Item>
                                    </Col> 

                                </Row>

                                <Row>
                                    <Col span={16}> 
                                    First Monthly Payment
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>
                                <Row>
                                    <Col span={16}> 
                                    Refundable Security Deposit
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>
                                <Row >
                                    <Col span={16} style={{ fontWeight: 700}}> 
                                    Put This Amount in Cash
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`, fontWeight: 700}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row >
                                    <Col span={16} style={{ fontWeight: 700}}> 
                                    
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`, fontWeight: 700}}> 
                                        <Button type="primary" > Copy to Cash Field</Button>
                                    </Col> 
                                </Row>

                                <Title level={4}> Dealer Participation (Reserve) </Title>
                                <Row>
                                    <Col span={12}> 
                                    Bike Minimum
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={16}> 
                                        Dealer Participation Markup
                                    </Col> 
                                    <Col span={8} style={{textAlign: `right`}}> 
                                        <Form.Item hasFeedback>  
                                            <Select style={{textAlign: `right`}} ></Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={12}> 
                                    Total Dealer Participation
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>



                                <Title level={4}> Dealer Funding Breakdown </Title>
                                <Row>
                                    <Col span={12}> 
                                    Total Transaction Price
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Minus Trade-in
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Minus Down Payment
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Minus Down Security Deposit
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Minus First Monthly Payment
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Minus Security Deposit
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Cash on Delivery on Bike
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Plus Dealer Participation
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <br/>
                                    <Row style={{color: `#1890ff`}}>
                                        <Col span={12}> 
                                        Remit to Dealer
                                        </Col> 
                                        <Col span={12} style={{textAlign: `right`}}> 
                                            <span>$14,000</span>
                                        </Col> 
                                    </Row>




                                <Title level={4}> Maximum Advances </Title>
                                <Row>
                                    <Col span={12}> 
                                    Front-End Max Advance
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={12}> 
                                    Back-End Max Advance
                                    </Col> 
                                    <Col span={12} style={{textAlign: `right`}}> 
                                        <span>$14,000</span>
                                    </Col> 
                                </Row>


                                <Title level={4}> Current Stipulations </Title>
                                <Row>
                                    <Col span={24}> 
                                        <a href="#"> 
                                            May be subject to payment limit (send POL and we'll determine the exact limit if any)
                                        </a>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={24}> 
                                        <a href="#"> 
                                            Subject to Pre-Funding verification call(s)
                                        </a>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={24}> 
                                        <a href="#"> 
                                            Proof of Residence (Matching Application & Within 30 Days)
                                        </a>
                                    </Col> 
                                </Row>

                                <br/>
                                <Row>
                                    <Col span={24}> 
                                        You may email documents satisfying these stipulations to:  
                                        <a href="#"> 
                                            2012070002@lease.speedleasing.com
                                        </a>
                                    </Col> 
                                </Row>

                            </Card>
                            <div style={{ marginTop: 20, textAlign: `right`}}>
                                <Button style={{ marginRight: 10 }}>Save</Button>
                                <Button style={{ marginRight: 10 }} type="primary" onClick={() => { setStep('bike') } } >Prev</Button>
                                <Button style={{ marginRight: 10 }} type="primary" onClick={() => { setStep('applicant') } } >Next</Button>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Form>

        </div>
    )
}

export default Calculator
