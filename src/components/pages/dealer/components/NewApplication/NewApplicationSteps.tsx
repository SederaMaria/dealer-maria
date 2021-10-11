import React, { useState } from 'react'
import { Col, Row, Steps, Layout } from 'antd';
import Icon from '@ant-design/icons';
import { SolutionOutlined, UserOutlined, TeamOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Link, useLocation, useHistory } from 'react-router-dom';

import {
    BikeInformation, 
    Calculator, 
    Applicant,
    CoApplicant,
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

function NewApplicationSteps(props: any) {
    const history = useHistory();
    const search = useLocation().search;
    const stepParams: string | null = new URLSearchParams(search).get("step");
    const getStepParams = stepParams === null ? `bike` : stepParams
    const [ step, setStep ] = useState<string>(getStepParams)
    const urlHistory: string = `/applications/${props.match.params.leaseApplicationId}/calculators/${props.match.params.LeaseCalculatorId}`
   
    const handleBikeStep = () => {
        let stepType: string = `bike`
        setStep(stepType)
        setStepRedirect(stepType)
    }
    
    const handleCalculatorStep = () => {
        let stepType: string = `calculator`
        setStep(stepType)
        setStepRedirect(stepType)
    }

    const handleApplicantStep = () => {
        let stepType: string = `applicant`
        setStep(stepType)
        setStepRedirect(stepType)
    }

    const handleCoApplicantStep = () => {
        let stepType: string = `co-applicant`
        setStep(stepType)
        setStepRedirect(stepType)
    }

    const handleSummaryStep = () => {
        let stepType: string = `summary`
        setStep(stepType)
        setStepRedirect(stepType)
    }


    const setStepRedirect = (stepType: string) => {
        history.push(`/applications/${props.match.params.leaseApplicationId}/calculators/${props.match.params.LeaseCalculatorId}?step=${stepType}`)
    }


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
                        <Step onClick={handleBikeStep} className={`application-steps application-steps-wait ${ step === 'bike' && 'application-steps-process'}`} status="process" title="Bike" icon={<Icon component={ MotorSvg } />} />
                        <Step onClick={handleCalculatorStep} className={`application-steps application-steps-wait ${ step === 'calculator' && 'application-steps-process'}`} status="wait" title="Calculator" icon={<Icon component={ CalculatorSvg } />} />
                        <Step onClick={handleApplicantStep} className={`application-steps application-steps-wait ${ step === 'applicant' && 'application-steps-process'}`} status="wait" title="Applicant" icon={<UserOutlined />} />
                        <Step onClick={handleCoApplicantStep} className={`application-steps application-steps-wait ${ step === 'co-applicant' && 'application-steps-process'}`} status="wait" title="Co-Applicant" icon={<TeamOutlined />} />
                        <Step onClick={handleSummaryStep} className={`application-steps application-steps-wait ${ step === 'summary' && 'application-steps-process'}`} status="wait" title="Summary" icon={<SolutionOutlined />} />
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
                case "bike": return <BikeInformation setStep={setStep} urlHistory={urlHistory}/>;
                case "calculator": return <Calculator setStep={setStep} urlHistory={urlHistory}/>;
                case "applicant": return <Applicant setStep={setStep} urlHistory={urlHistory}/>;
                case "co-applicant": return <CoApplicant setStep={setStep} urlHistory={urlHistory}/>;
                case "summary": return <Summary setStep={setStep} urlHistory={urlHistory}/>;
            }
            })()}

        </div>
    )
}

export default NewApplicationSteps
