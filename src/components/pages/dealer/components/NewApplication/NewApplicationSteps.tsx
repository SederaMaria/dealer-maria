import React, { useState } from 'react'
import { Col, Row, Steps, Layout } from 'antd';
import Icon from '@ant-design/icons';
import { SolutionOutlined, UserOutlined, TeamOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import {
    BikeInformation, 
    Calculator, 
    Applicant,
    Summary
} from "./"

import { 
    MotorSvg, 
    CalculatorSvg 
} from '../../../../../utils/Svg';
import logo from '../../../../../assets/speed-leasing.png';
import '../styles/NewApplication.css'

const { Step } = Steps;
const { Header } = Layout;

function NewApplicationSteps() {

    const [ step, setStep ] = useState<string>(`bike`)



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
                        <Step className={`application-steps application-steps-wait ${ step === 'bike' && 'application-steps-process'}`} status="process" title="Bike" icon={<Icon component={ MotorSvg } />} />
                        <Step className={`application-steps application-steps-wait ${ step === 'calculator' && 'application-steps-process'}`} status="wait" title="Calculator" icon={<Icon component={ CalculatorSvg } />} />
                        <Step className={`application-steps application-steps-wait ${ step === 'applicant' && 'application-steps-process'}`} status="wait" title="Applicant" icon={<UserOutlined />} />
                        <Step className={`application-steps application-steps-wait ${ step === 'co-applicant' && 'application-steps-process'}`} status="wait" title="Co-Applicant" icon={<TeamOutlined />} />
                        <Step className={`application-steps application-steps-wait ${ step === 'summary' && 'application-steps-process'}`} status="wait" title="Summary" icon={<SolutionOutlined />} />
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


            {(() => {
            switch(step) {
                case "bike": return <BikeInformation setStep={setStep}/>;
                case "calculator": return <Calculator setStep={setStep}/>;
                case "applicant": return <Applicant setStep={setStep} />;
                case "co-applicant": return <Applicant setStep={setStep} />;
                case "summary": return <Summary setStep={setStep} />;
            }
            })()}

        </div>
    )
}

export default NewApplicationSteps
