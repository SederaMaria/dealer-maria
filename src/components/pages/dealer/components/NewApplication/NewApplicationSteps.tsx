import React from 'react'
import { Col, Row, Steps, Layout } from 'antd';
import { SolutionOutlined, LoadingOutlined, SmileOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { BikeInformation } from './steps'
import logo from '../../../../../assets/speed-leasing.png';
import '../styles/NewApplication.css'

const { Step } = Steps;
const { Header } = Layout;

function NewApplicationSteps() {
    return (
        <div>

            <Header className="main-header-layout" id='main-menu'>
                <Row>
                <Col span={6}>          
                    <div className="logo" >
                    <img className="logo-img" src={logo} alt="speedleasing"/>
                    </ div>
                </Col>
                <Col span={12}>
                    <Steps size="small">
                        <Step className="application-steps application-steps-process" status="process" title="Bike" icon={<LoadingOutlined />} />
                        <Step className="application-steps application-steps-wait" status="wait" title="Calculator" icon={<SolutionOutlined />} />
                        <Step className="application-steps application-steps-wait" status="wait" title="Applicant" icon={<SmileOutlined />} />
                        <Step className="application-steps application-steps-wait" status="wait" title="Applicant" icon={<SmileOutlined />} />
                        <Step className="application-steps application-steps-wait" status="wait" title="Summary" icon={<SmileOutlined />} />
                    </Steps>
                </Col>
                <Col span={6}>
                    <span style={{float: 'right'}}>
                        <Link to={`/new-application`} className="steps-exit-btn">
                            <PoweroffOutlined />EXIT
                        </Link>
                    </span>
                </Col>
                </Row>
            </Header>

            <BikeInformation />

        </div>
    )
}

export default NewApplicationSteps
