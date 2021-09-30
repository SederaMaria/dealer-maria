import React from 'react'
import { Row, Col, Button, Typography, Layout, Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { Content } = Layout;
interface Props {
    setStep: React.Dispatch<React.SetStateAction<string>>,
}

const SummaryDescription = ({ label, children }: any) => {
    return <Row style={{marginBottom: 10}}><Col span={24}> <Text style={{color: "rgba(0, 0, 0, 0.65)", fontWeight: 700, fontSize: "1.1em" }}> {label} </Text> </Col> <Col span={24}> {children} </Col></Row> 
  }

export const Summary: React.FC<Props> = ({setStep}: Props) => {
    return (
        <div style={{ margin: `20px 100px` }}>
            <div style={{ textAlign: `center`,  marginBottom: 20}}>
                <Title level={2}> Summary </Title>
                
                
                <Content className="content-1" style={{ backgroundColor: `white`, marginBottom: 50}}>

                    <Row gutter={[16, 40]}>
                        <Col span={4} style={{ textAlign: `center`}}>
                            <Title level={2} style={{ textAlign: `center`}}> Applicant </Title>
                            <Avatar shape="square" size={200} icon={<UserOutlined />} />
                        </Col>
                        <Col span={10} style={{ textAlign: `left`}}>
                            
                        <SummaryDescription label="Name">ELLEN CREDCO</SummaryDescription> 
                        <SummaryDescription label="Address">742 YUCA VALLEY LN TEST COLUMBIA, SC 29229</SummaryDescription>
                        <SummaryDescription label="Home Phone">(804) 222-1111</SummaryDescription>
                        <SummaryDescription label="Mobile Phone"> N/A</SummaryDescription>
                        <SummaryDescription label="Date of Birth">August 30, 1980</SummaryDescription>
                        <SummaryDescription label="Last Four of SSN">1234</SummaryDescription>


                        </Col>
                        <Col span={10} >

                        </Col>
                    </Row>

                </Content>



                <Content className="content-1" style={{ backgroundColor: `white`, marginBottom: 50}}>

                    <Row gutter={[16, 40]}>
                        <Col span={4} style={{ textAlign: `center`}}>
                            <Title level={2} style={{ textAlign: `center`}}> Co Applicant </Title>
                            <Avatar shape="square" size={200} icon={<UserOutlined />} />
                        </Col>
                        <Col span={10} style={{ textAlign: `left`}}>
                            
                        <SummaryDescription label="Name">ELLEN CREDCO</SummaryDescription> 
                        <SummaryDescription label="Address">742 YUCA VALLEY LN TEST COLUMBIA, SC 29229</SummaryDescription>
                        <SummaryDescription label="Home Phone">(804) 222-1111</SummaryDescription>
                        <SummaryDescription label="Mobile Phone"> N/A</SummaryDescription>
                        <SummaryDescription label="Date of Birth">August 30, 1980</SummaryDescription>
                        <SummaryDescription label="Last Four of SSN">1234</SummaryDescription>


                        </Col>
                        <Col span={10} >

                        </Col>
                    </Row>

                </Content>

            </div>

            <div style={{ marginTop: 20, textAlign: `center`}}>
                <Button style={{ marginRight: 10 }} type="primary" onClick={() => { setStep('co-applicant') } } >Prev</Button>
            </div>


        </div>
    )
}

export default Summary
