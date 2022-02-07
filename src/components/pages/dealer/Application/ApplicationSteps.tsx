import React, { useState } from 'react'
import { Col, Row, Steps, Layout, notification, Typography } from 'antd'
import Icon from '@ant-design/icons'
import { SolutionOutlined, UserOutlined, TeamOutlined, PoweroffOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { MotorSvg, CalculatorSvg } from '../../../../utils/Svg'
import logo from '../../../../assets/speed-leasing.png'
import '../styles/NewApplication.css'

const { Step } = Steps
const { Header } = Layout
const { Text } = Typography

interface Props {
  stepType: string
  leaseApplicationId: string
  leaseCalculatorId: string
  save: any
  attribute?: boolean
}
export const ApplicationSteps: React.FC<Props> = ({ stepType, leaseApplicationId, leaseCalculatorId, attribute }) => {
  const history = useHistory()

  let calculatorUrl: string = `/applications/${leaseApplicationId.trim()}/calculators/${leaseCalculatorId.trim()}`
  let applicantUrl: string = `/applications/${leaseApplicationId.trim()}`

  const handleBikeStep = () => {
    setStepRedirect(calculatorUrl, `bike`)
  }

  const handleCalculatorStep = () => {
    setStepRedirect(calculatorUrl, `calculator`)
  }

  const handleApplicantStep = () => {
    setStepRedirect(applicantUrl, `applicant`)
  }

  const handleCoApplicantStep = () => {
    setStepRedirect(applicantUrl, `co-applicant`)
  }

  const handleSummaryStep = () => {
    setStepRedirect(applicantUrl, `summary`)
  }

  const setStepRedirect = (url: string, page: string) => {
    history.push(`${url}/${page}`)
  }

  const handleEmptyForm = () => {
    notification.open({
      message: <Text type="warning">Please Fill Out The Form And Save</Text>,
      duration: 3,
      icon: <InfoCircleOutlined style={{ color: `#faad14` }} />,
      placement: 'topRight',
    })
  }

  return (
    <Header className="main-header-layout" id="main-menu">
      <Row>
        <Col span={6}>
          <div className="logo">
            <img className="logo-img" src={logo} alt="speedleasing" />
          </div>
        </Col>
        <Col span={12}>
          <Steps size="small">
            <Step
              onClick={attribute ? handleEmptyForm : handleBikeStep}
              className={`application-steps application-steps-wait ${stepType === 'bike' && 'application-steps-process'}`}
              status="process"
              title="Bike"
              icon={<Icon component={MotorSvg} />}
            />
            {/* {stepType != 'bike' &&  <Step onClick={handleCalculatorStep} className={`application-steps application-steps-wait ${ stepType === 'calculator' && 'application-steps-process'}`} status="wait" title="Calculator" icon={<Icon component={ CalculatorSvg } />} />} */}
            <Step
              onClick={attribute ? handleEmptyForm : handleApplicantStep}
              className={`application-steps application-steps-wait ${stepType === 'applicant' && 'application-steps-process'}`}
              status="wait"
              title="Applicant"
              icon={<UserOutlined />}
            />
            <Step
              onClick={attribute ? handleEmptyForm : handleCoApplicantStep}
              className={`application-steps application-steps-wait ${stepType === 'co-applicant' && 'application-steps-process'}`}
              status="wait"
              title="Co-Applicant"
              icon={<TeamOutlined />}
            />
            <Step
              onClick={handleSummaryStep}
              className={`application-steps application-steps-wait ${stepType === 'summary' && 'application-steps-process'}`}
              status="wait"
              title="Summary"
              icon={<SolutionOutlined />}
            />
          </Steps>
        </Col>
        <Col span={6}>
          <span style={{ float: 'right' }}>
            <Link to={`/application`} className="steps-exit-btn">
              <PoweroffOutlined />
              EXIT
            </Link>
          </span>
        </Col>
      </Row>
    </Header>
  )
}

export default ApplicationSteps
