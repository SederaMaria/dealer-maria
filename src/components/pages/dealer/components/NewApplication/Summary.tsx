import React, {useState} from 'react'
import { Row, Col, Button, Typography, Layout, Avatar, Collapse } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../../../../layouts/styles/Summary.css';


const { Title, Text } = Typography;
const { Content } = Layout;
interface Props {
    setStep: React.Dispatch<React.SetStateAction<string>>,
    urlHistory: string
}
const {Panel} = Collapse;

const SummaryDescription = ({ label, children }: any) => {
    return <Row style={{marginBottom: 6, position:`relative`, top: `16%`}}><Col span={24}><Text style={{color: "rgba(0, 0, 0, 0.65)", fontWeight: 700, fontSize: "1.1em" }}> {label} </Text> </Col> <Col span={24}> {children} </Col></Row>
  }

  
export const Summary: React.FC<Props> = ({setStep, urlHistory}: Props) => {

    const [activeKey, setActiveKey] = useState(0);

    const switchActiveKey = (key:number)=> {
       activeKey == key ? setActiveKey(0): setActiveKey(key)
    }

    return (
        <div style={{ margin: `20px 100px` }}>
            <div style={{ textAlign: `center`,  marginBottom: 20}}>
                <Title level={2}> Summary </Title>

                <Content className="content-1" style={{ backgroundColor: `white`, marginBottom: 50}}>

                    <Row gutter={[16, 40]}>
                        <Col span={8} style={{ textAlign: `center`}}>
                            <Title level={2} style={{ textAlign: `center`}}> Applicant </Title>
                            <Avatar shape="square" size={250} icon={<UserOutlined />} />
                        </Col>
                        <Col span={10} style={{ textAlign: `left`}}>

                        <SummaryDescription label="Name">ELLEN CREDCO</SummaryDescription> 
                        <SummaryDescription label="Address">742 YUCA VALLEY LN TEST COLUMBIA, SC 29229</SummaryDescription>
                        <SummaryDescription label="Home Phone">(804) 222-1111</SummaryDescription>
                        <SummaryDescription label="Mobile Phone"> N/A</SummaryDescription>
                        <SummaryDescription label="Date of Birth">August 30, 1980</SummaryDescription>
                        <SummaryDescription label="Last Four of SSN">1234</SummaryDescription>
                        </Col>
                    </Row>
                    <Row className="edit-expand-buttons" justify="center">
                        <Col span={6}>
                            <Button id="editApplicant" type="primary" onClick={()=>{ setStep('applicant') } }>Edit</Button>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" style={{background: `#CCCCCC`, border: `#000`}} onClick={()=> switchActiveKey(1)}>Expand</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={24} md={12}>
                            <Collapse activeKey= {activeKey}>
                                <Panel header key="1">
                                    <div className="personal">
                                        <Title level={2} style={{textAlign: `left`}}>Personal</Title>
                                    </div>
                                    <div className="address">
                                        <Title level={2} style={{textAlign: `left`}}>Home Address</Title>
                                    </div>  
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Content>

                <Content className="content-1" style={{ backgroundColor: `white`, marginBottom: 50}}>

                    <Row gutter={[16, 40]}>
                        <Col span={8} style={{ textAlign: `center`}}>
                            <Title level={2} style={{ textAlign: `center`}}> Co Applicant </Title>
                            <Avatar shape="square" size={250} icon={<UserOutlined />} />
                        </Col>
                        <Col span={10} style={{ textAlign: `left`}}>
                            
                        <SummaryDescription label="Name">ELLEN CREDCO</SummaryDescription> 
                        <SummaryDescription label="Address">742 YUCA VALLEY LN TEST COLUMBIA, SC 29229</SummaryDescription>
                        <SummaryDescription label="Home Phone">(804) 222-1111</SummaryDescription>
                        <SummaryDescription label="Mobile Phone"> N/A</SummaryDescription>
                        <SummaryDescription label="Date of Birth">August 30, 1980</SummaryDescription>
                        <SummaryDescription label="Last Four of SSN">1234</SummaryDescription>
                        </Col>
                    </Row>
                    <Row className="edit-expand-buttons" justify="center">
                        <Col span={6}>
                            <Button id="edit" type="primary" onClick={() => { setStep('co-applicant') } }>Edit</Button>
                        </Col>
                        <Col span={6}>
                            <Button id="expand" type="primary" style={{background: `#CCCCCC`, border: `#000`}} onClick={()=>switchActiveKey(2)}>Expand</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={24} md={12}>
                            <Collapse activeKey= {activeKey}>
                                <Panel header key="2">
                                    <div className="personal">
                                        <Title level={2} style={{textAlign: `left`}}>Personal</Title>
                                        
                                    </div>
                                    <div className="address">
                                        <Title level={2} style={{textAlign: `left`}}>Home Address</Title>
                                        
                                    </div>  
                                </Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </Content>

            </div>

            <div style={{ marginTop: 20, textAlign: `center`}}>
                <Button style={{ marginRight: 10 }} type="primary" onClick={() => { setStep('co-applicant') } } >
                <Link to={`${urlHistory}?step=co-applicant`}> prev </Link>
                </Button>
            </div>
        </div>
    )
}

export default Summary
