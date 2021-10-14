import React, {useState} from 'react'
import { Row, Col, Button, Typography, Layout, Avatar, Collapse } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApplicationSteps from './ApplicationSteps';
import '../../../layouts/styles/Summary.css';


const { Title, Text } = Typography;
const { Content } = Layout;

const {Panel} = Collapse;

const SummaryDescription = ({ label, children }: any) => {
    return <Row style={{marginBottom: 6, position:`relative`, top: `16%`}}><Col span={24}><Text style={{color: "rgba(0, 0, 0, 0.65)", fontWeight: 700, fontSize: "1.1em" }}> {label} </Text> </Col> <Col span={24}> {children} </Col></Row>
  }

interface Lessee {
    ssn?: string | undefined
}

interface LeaseCalculator {
    id?: string | number | undefined
}

interface RootLeaseCalculator {
    leaseCalculator?: LeaseCalculator
}

interface Props {
    data?: {
        id: string | number,
        lessee: Lessee,
        leaseCalculator: RootLeaseCalculator
    }
}


export const Summary: React.FC<Props> = ({data}) => {

    const [activeKey, setActiveKey] = useState(0);


    let leaseApplicationId: string | number | undefined = data?.id
    let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.leaseCalculator?.id

    const switchActiveKey = (key:number)=> {
       activeKey == key ? setActiveKey(0): setActiveKey(key)
    }

    return (
        <>
            <ApplicationSteps 
                stepType={`summary`} 
                leaseApplicationId={`${leaseApplicationId}`} 
                leaseCalculatorId={`${leaseCalculatorId}`}  
                save={null} 
            />
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
                                <Button id="editApplicant" type="primary" >
                                <Link to={`/applications/${leaseApplicationId}/applicant`}> Edit </Link>
                                </Button>
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
                                            <Row>
                                                <Col span={3}><b>First Name</b></Col>
                                                <Col span={3}><b>Middle Name</b></Col>
                                                <Col span={3}><b>Last Name</b></Col>
                                                <Col span={3}><b>Date of Birth</b></Col>
                                                <Col span={3}><b>Phone Phone</b></Col>
                                                <Col span={3}><b>Mobile Phone</b></Col>
                                                <Col span={3}><b>Driver's License Number</b></Col>
                                                <Col span={3}><b>Last Four of SSN</b></Col>
                                            </Row>
                                            <Row>
                                                <Col span={3}><p>ELLEN</p></Col>
                                                <Col span={3}><p>EL</p></Col>
                                                <Col span={3}><p>Credco</p></Col>
                                                <Col span={3}><p>August 30, 1980</p></Col>
                                                <Col span={3}><p>(804)222-1111</p></Col>
                                                <Col span={3}><p>N/A</p></Col>
                                                <Col span={3}><p>1234</p></Col>
                                                <Col span={3}><p>1234</p></Col>
                                            </Row>
                                        </div>
                                        <div className="address">
                                            <Title level={2} style={{textAlign: `left`}}>Home Address</Title>
                                            <Row>
                                                <Col span={6}><b>Street Address(No.P.O.boxes)</b></Col>
                                                <Col span={3}><b>Appartment / Unit</b></Col>
                                                <Col span={3}><b>Zip Code</b></Col>
                                                <Col span={3}><b>State</b></Col>
                                                <Col span={3}><b>Country/Parish</b></Col>
                                                <Col span={3}><b>City</b></Col>
                                            </Row>
                                            <Row>
                                                <Col span={6}><p>5468 MONTEZUMA RD</p></Col>
                                                <Col span={3}><p>Credco</p></Col>
                                                <Col span={3}><p>38610</p></Col>
                                                <Col span={3}><p>MS</p></Col>
                                                <Col span={3}><p>MONTEZUMA</p></Col>
                                                <Col span={3}><p>BLUE MAUNTAIN</p></Col>
                                            </Row>

                                            <Row  className="address-down">
                                                <Col span={5}><b>Years at Current Address</b></Col>
                                                <Col span={5}><b>Months at Current Address</b></Col>
                                                <Col span={5}><b>Monthly Mortgage or Rent</b></Col>
                                                <Col span={5}><b>Own or Rent</b></Col>
                                            </Row>
                                            <Row>
                                                <Col span={5}><p>10</p></Col>
                                                <Col span={5}><p>120</p></Col>
                                                <Col span={5}><p>1000</p></Col>
                                                <Col span={5}><p>Own</p></Col>
                                            </Row>
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
                                <Button id="edit" type="primary" >
                                    <Link to={`/applications/${leaseApplicationId}/co-applicant`}> Edit </Link>
                                </Button>
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
                                            <Row>
                                                <Col span={3}><b className="expand-test">First Name</b></Col>
                                                <Col span={3}><b>Middle Name</b></Col>
                                                <Col span={3}><b>Last Name</b></Col>
                                                <Col span={3}><b>Date of Birth</b></Col>
                                                <Col span={3}><b>Phone Phone</b></Col>
                                                <Col span={3}><b>Mobile Phone</b></Col>
                                                <Col span={3}><b>Driver's License Number</b></Col>
                                                <Col span={3}><b>Last Four of SSN</b></Col>
                                            </Row>
                                            <Row>
                                                <Col span={3}><p>ELLEN</p></Col>
                                                <Col span={3}><p>EL</p></Col>
                                                <Col span={3}><p>Credco</p></Col>
                                                <Col span={3}><p>August 30, 1980</p></Col>
                                                <Col span={3}><p>(804)222-1111</p></Col>
                                                <Col span={3}><p>N/A</p></Col>
                                                <Col span={3}><p>1234</p></Col>
                                                <Col span={3}><p>1234</p></Col>
                                            </Row>
                                        </div>
                                        <div className="address">
                                            <Title level={2} style={{textAlign: `left`}}>Home Address</Title>
                                            <Row>
                                                <Col span={6}><b>Street Address(No.P.O.boxes)</b></Col>
                                                <Col span={3}><b>Appartment / Unit</b></Col>
                                                <Col span={3}><b>Zip Code</b></Col>
                                                <Col span={3}><b>State</b></Col>
                                                <Col span={3}><b>Country/Parish</b></Col>
                                                <Col span={3}><b>City</b></Col>
                                            </Row>
                                            <Row>
                                                <Col span={6}><p>5468 MONTEZUMA RD</p></Col>
                                                <Col span={3}><p>Credco</p></Col>
                                                <Col span={3}><p>38610</p></Col>
                                                <Col span={3}><p>MS</p></Col>
                                                <Col span={3}><p>MONTEZUMA</p></Col>
                                                <Col span={3}><p>BLUE MAUNTAIN</p></Col>
                                            </Row>

                                            <Row  className="address-down">
                                                <Col span={5}><b>Years at Current Address</b></Col>
                                                <Col span={5}><b>Months at Current Address</b></Col>
                                                <Col span={5}><b>Monthly Mortgage or Rent</b></Col>
                                                <Col span={5}><b>Own or Rent</b></Col>
                                            </Row>
                                            <Row>
                                                <Col span={5}><p>10</p></Col>
                                                <Col span={5}><p>120</p></Col>
                                                <Col span={5}><p>1000</p></Col>
                                                <Col span={5}><p>Own</p></Col>
                                            </Row>
                                        </div>  
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    </Content>

                </div>

                <div style={{ marginTop: 20, textAlign: `center`}}>
                    <Button style={{ marginRight: 10 }} type="primary" >
                    <Link to={`/applications/${leaseApplicationId}/co-applicant`}> prev </Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Summary
