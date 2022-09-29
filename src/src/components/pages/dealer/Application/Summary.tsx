import React, { useState } from 'react'
import { Row, Col, Button, Typography, Layout, Avatar, Collapse, Tag, Card, Divider, message, Alert } from 'antd'
import 'antd/dist/antd.css'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import ApplicationSteps from './ApplicationSteps'
import { Lessee as SummaryLessee } from './Applicant/Applicant'
import '../../../layouts/styles/Summary.css'
import { logger, network } from '../../../../utils'

const { Title, Text } = Typography
const { Content } = Layout
const { Panel } = Collapse

interface LeaseCalculator {
  id?: string | number | undefined
  assetMake?: string
  assetModel?: string
  assetYear?: number
  newUsed?: string
  mileageTier?: string
}

interface Props {
  data?: {
    id: string | number
    lessee: SummaryLessee
    colessee: SummaryLessee
    leaseCalculator: LeaseCalculator
  }
  label?: any
}

const gridStyle: React.CSSProperties = {
  width: '25%',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#181c27',
  color: '#eff0f2',
}

const MotorSummary: React.FC<Props> = ({ label, children }) => {
  return (
    <div>
      <p>
        <Text style={{ color: 'rgba(0, 0, 0, 0.65)', fontWeight: 700, fontSize: '1.1em' }}>{label}</Text>
      </p>
      <p>{children}</p>
    </div>
  )
}

const PersonalSummary: React.FC<Props> = ({ label, children }) => {
  return (
    <Card.Grid hoverable={false} style={gridStyle}>
      <h5>{label}</h5>
      <span>{children}</span>
    </Card.Grid>
  )
}

export const Summary: React.FC<Props> = ({ data }) => {
  let leaseApplicationId: string | number | undefined = data?.id
  let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.id

  const [hasSubmitError, setHasSubmitError] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [showSubmitterMessage, setShowSubmitterMessage] = useState<boolean>(false)
  const [submitterMessage, setSubmitterMessage] = useState<string | undefined>('')

  const handleSubmit = async () => {
    try {
      const response = await network.GET(`/api/v1/dealers/applications/${leaseApplicationId}`)
      message.success('Succesfully Submitted Application')
      console.log(response)
      setHasSubmitError(false)
      setSubmitSuccess(true)
      setShowSubmitterMessage(false)
      setSubmitterMessage('Succesfully Submitted Application')
    } catch (e: any) {
      logger.error('Request Error', e)
      setSubmitterMessage(e.response.data.message)
      setShowSubmitterMessage(true)
    }
  }

  const colesseeHasValue = () => {
    if (!data?.colessee) {
      return false
    } else {
      return Object.values(data?.colessee).some(val => (val !== null))
    }
  }

  return (
    <>
      <ApplicationSteps stepType={`summary`} leaseApplicationId={`${leaseApplicationId}`} leaseCalculatorId={`${leaseCalculatorId}`} save={null} />
      {showSubmitterMessage && <Alert message={submitterMessage} type="warning" showIcon closable />}
      <div style={{ margin: `20px 100px` }}>
        <div style={{ textAlign: `center`, marginBottom: 20 }}>
          <Title level={2}> Summary </Title>
          <Content className="content-1" style={{ backgroundColor: `white`, marginBottom: 50 }}>
            <div id="motor-content">
              {/* <div>
                                <Avatar shape="square" size={150} style={{marginLeft:`35px`}} icon={<UserOutlined />} />
                            </div> */}
              <div className="motor-details">
                <div className="motor-summary">
                  <MotorSummary label="New/Used">{data?.leaseCalculator?.newUsed ? data?.leaseCalculator?.newUsed : 'Empty'}</MotorSummary>
                  <MotorSummary label="Make">{data?.leaseCalculator?.assetMake ? data?.leaseCalculator?.assetMake : 'Empty'}</MotorSummary>
                  <MotorSummary label="Model">{data?.leaseCalculator?.assetModel ? data?.leaseCalculator?.assetModel : 'Empty'}</MotorSummary>
                  <MotorSummary label="Year">{data?.leaseCalculator?.assetYear ? data?.leaseCalculator?.assetYear : 'Empty'}</MotorSummary>
                  <MotorSummary label="Mileage Tier">{data?.leaseCalculator?.mileageTier ? `$ ${data?.leaseCalculator?.mileageTier}` : 'Empty'}</MotorSummary>
                </div>
              </div>
            </div>
            <div className="collapse-container">
              <Collapse>
                <Panel
                  header="Applicant"
                  key="1"
                  style={{ textAlign: `left` }}
                  extra={
                    <Link to={`/applications/${leaseApplicationId}/applicant`}>
                      <Tag>Edit</Tag>
                    </Link>
                  }
                >
                  <Card  headStyle={cardStyle} title="Personal">
                    <div id="locateTest" className="applicant-elements-above">
                      <PersonalSummary label="First Name">{data?.lessee?.firstName ? data?.lessee?.firstName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Middle Name">{data?.lessee?.middleName ? data?.lessee?.middleName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Last Name">{data?.lessee?.lastName ? data?.lessee?.lastName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Date of Birth(mm/dd/yyyy)">{data?.lessee?.dateOfBirth ? data?.lessee?.dateOfBirth : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="applicant-elements-below">
                      <PersonalSummary label="Social Security Number">{data?.lessee?.ssn ? data?.lessee?.ssn : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Driver's License Number">{data?.lessee?.driversLicenseIdNumber ? data?.lessee?.driversLicenseIdNumber : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Home Phone Number">{data?.lessee?.homePhoneNumber ? data?.lessee?.homePhoneNumber : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Mobile Phone Number">{data?.lessee?.mobilePhoneNumber ? data?.lessee?.mobilePhoneNumber : 'Empty'}</PersonalSummary>
                    </div>
                  </Card>

                  <Card headStyle={cardStyle} title="Home Address">
                    <div className="applicant-elements-above">
                      <PersonalSummary label="Street Address 1 (no P.O. Boxes)">{data?.lessee?.homeAddress?.street1 ? data?.lessee?.homeAddress?.street1 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Street Address 2">{data?.lessee?.homeAddress?.street2 ? data?.lessee?.homeAddress?.street2 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="ZIP Code">{data?.lessee?.homeAddress?.zipcode ? data?.lessee?.homeAddress?.zipcode : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="State">{data?.lessee?.homeAddress?.state ? data?.lessee?.homeAddress?.state : 'Empty'}</PersonalSummary>
                    </div>

                    <div className="applicant-elements-below">
                      <PersonalSummary label="County/Parish"> {data?.lessee?.homeAddress?.county ? data?.lessee?.homeAddress?.county : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="City">{data?.lessee?.homeAddress?.cityId ? data?.lessee?.homeAddress?.cityId : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Years at Current Address">{data?.lessee?.atAddressYears ? data?.lessee?.atAddressYears : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Months at Current Address">{data?.lessee?.atAddressMonths ? data?.lessee?.atAddressMonths : 'Empty'}</PersonalSummary>
                    </div>

                    <div className="exception-cell ownership">
                      <PersonalSummary label="Monthly Mortgage or Rent">{data?.lessee?.monthlyMortgage ? data?.lessee?.monthlyMortgage : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Ownership">{data?.lessee?.homeOwnership == 1 ? 'Own' : 'Rent'}</PersonalSummary>
                    </div>
                  </Card>

                  <Card headStyle={cardStyle} title="Mailing Address">
                    <div className="applicant-elements-above">
                      <PersonalSummary label="Street Address (no P.O. Boxes)">{data?.lessee?.mailingAddress?.street1 ? data?.lessee?.mailingAddress?.street1 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Street Address 2">{data?.lessee?.mailingAddress?.street2 ? data?.lessee?.mailingAddress?.street2 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="ZIP Code">{data?.lessee?.mailingAddress?.zipcode ? data?.lessee?.mailingAddress?.zipcode : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="State">{data?.lessee?.mailingAddress?.state ? data?.lessee?.mailingAddress?.state : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="exception-cell">
                      <PersonalSummary label="City">{data?.lessee?.mailingAddress?.cityId ? data?.lessee?.mailingAddress?.cityId : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="County/Parish">{data?.lessee?.mailingAddress?.county ? data?.lessee?.mailingAddress?.county : 'Empty'}</PersonalSummary>
                    </div>
                  </Card>

                  <Card headStyle={cardStyle} title="Employment Details">
                    <div className="applicant-elements-below">
                      <PersonalSummary label="Employer Name">{data?.lessee?.employerName ? data?.lessee?.employerName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Phone Number">{data?.lessee?.employerPhoneNumber ? data?.lessee?.employerPhoneNumber : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="City">{data?.lessee?.employmentAddress?.city ? data?.lessee?.employmentAddress?.city : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="State">{data?.lessee?.employmentAddress?.state ? data?.lessee?.employmentAddress?.state : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="applicant-elements-above">
                      <PersonalSummary label="Employment Status">{data?.lessee?.employmentStatus ? data?.lessee?.employmentStatus : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Job Title">{data?.lessee?.jobTitle ? data?.lessee?.jobTitle : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Years Employed">{data?.lessee?.timeAtEmployerYears ? data?.lessee?.timeAtEmployerYears : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Months Employed">{data?.lessee?.timeAtEmployerMonths ? data?.lessee?.timeAtEmployerMonths : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="gross-monthly">
                      <PersonalSummary label="Gross Monthly Income">{data?.lessee?.grossMonthlyIncome ? `$ ${data?.lessee?.grossMonthlyIncome}` : 'Empty'}</PersonalSummary>
                    </div>
                  </Card>
                </Panel>

                { colesseeHasValue() && <Panel
                  header="Co-Applicant"
                  key="2"
                  style={{ textAlign: `left` }}
                  extra={
                    <Link to={`/applications/${leaseApplicationId}/co-applicant`}>
                      <Tag>Edit</Tag>
                    </Link>
                  }
                >
                  <Card headStyle={cardStyle} title="Personal">
                    <div className="applicant-elements-above">
                      <PersonalSummary label="First Name">{data?.colessee?.firstName ? data?.colessee?.firstName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Middle Name">{data?.colessee?.middleName ? data?.colessee?.middleName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Last Name">{data?.colessee?.lastName ? data?.colessee?.lastName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Date of Birth(mm/dd/yyyy)">{data?.colessee?.dateOfBirth ? data?.colessee?.dateOfBirth : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="applicant-elements-below">
                      <PersonalSummary label="Social Security Number">{data?.colessee?.ssn ? data?.colessee?.ssn : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Driver's License Number">{data?.colessee?.driversLicenseIdNumber ? data?.colessee?.driversLicenseIdNumber : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Home Phone Number">{data?.colessee?.homePhoneNumber ? data?.colessee?.homePhoneNumber : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Mobile Phone Number">{data?.colessee?.mobilePhoneNumber ? data?.colessee?.mobilePhoneNumber : 'Empty'}</PersonalSummary>
                    </div>
                  </Card>

                  <Card headStyle={cardStyle} title="Home Address">
                    <div className="applicant-elements-above">
                      <PersonalSummary label="Street Address 1 (no P.O. Boxes)">{data?.colessee?.homeAddress?.street1 ? data?.colessee?.homeAddress?.street1 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Street Address 2">{data?.colessee?.homeAddress?.street2 ? data?.colessee?.homeAddress?.street2 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="ZIP Code">{data?.colessee?.homeAddress?.zipcode ? data?.colessee?.homeAddress?.zipcode : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="State">{data?.colessee?.homeAddress?.state ? data?.colessee?.homeAddress?.state : 'Empty'}</PersonalSummary>
                    </div>

                    <div className="applicant-elements-below">
                      <PersonalSummary label="County/Parish"> {data?.colessee?.homeAddress?.county ? data?.colessee?.homeAddress?.county : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="City">{data?.colessee?.homeAddress?.cityId ? data?.colessee?.homeAddress?.cityId : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Years at Current Address">{data?.colessee?.atAddressYears ? data?.colessee?.atAddressYears : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Months at Current Address">{data?.colessee?.atAddressMonths ? data?.colessee?.atAddressMonths : 'Empty'}</PersonalSummary>
                    </div>

                    <div className="exception-cell ownership">
                      <PersonalSummary label="Monthly Mortgage or Rent">{data?.colessee?.monthlyMortgage ? data?.colessee?.monthlyMortgage : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Ownership">{data?.colessee?.homeOwnership == 1 ? 'Own' : 'Rent'}</PersonalSummary>
                    </div>
                  </Card>

                  <Card headStyle={cardStyle} title="Mailing Address">
                    <div className="applicant-elements-above">
                      <PersonalSummary label="Street Address (no P.O. Boxes)">{data?.colessee?.mailingAddress?.street1 ? data?.colessee?.mailingAddress?.street1 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Street Address 2">{data?.colessee?.mailingAddress?.street2 ? data?.colessee?.mailingAddress?.street2 : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="ZIP Code">{data?.colessee?.mailingAddress?.zipcode ? data?.colessee?.mailingAddress?.zipcode : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="State">{data?.colessee?.mailingAddress?.state ? data?.colessee?.mailingAddress?.state : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="exception-cell">
                      <PersonalSummary label="City">{data?.colessee?.mailingAddress?.cityId ? data?.colessee?.mailingAddress?.cityId : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="County/Parish">{data?.colessee?.mailingAddress?.county ? data?.colessee?.mailingAddress?.county : 'Empty'}</PersonalSummary>
                    </div>
                  </Card>

                  <Card headStyle={cardStyle} title="Employment Details">
                    <div className="applicant-elements-below">
                      <PersonalSummary label="Employer Name">{data?.colessee?.employerName ? data?.colessee?.employerName : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Phone Number">{data?.colessee?.employerPhoneNumber ? data?.colessee?.employerPhoneNumber : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="City">{data?.colessee?.employmentAddress?.city ? data?.colessee?.employmentAddress?.city : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="State">{data?.colessee?.employmentAddress?.state ? data?.colessee?.employmentAddress?.state : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="applicant-elements-above">
                      <PersonalSummary label="Employment Status">{data?.colessee?.employmentStatus ? data?.colessee?.employmentStatus : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Job Title">{data?.colessee?.jobTitle ? data?.colessee?.jobTitle : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Years Employed">{data?.colessee?.timeAtEmployerYears ? data?.colessee?.timeAtEmployerYears : 'Empty'}</PersonalSummary>
                      <PersonalSummary label="Months Employed">{data?.colessee?.timeAtEmployerMonths ? data?.colessee?.timeAtEmployerMonths : 'Empty'}</PersonalSummary>
                    </div>
                    <div className="gross-monthly">
                      <PersonalSummary label="Gross Monthly Income">{data?.colessee?.grossMonthlyIncome ? `$ ${data?.colessee?.grossMonthlyIncome}` : 'Empty'}</PersonalSummary>
                    </div>
                  </Card>
                </Panel> }
                {/* <Panel header="Calculation" key="3"  style={{textAlign:`left`}} extra={<Link to={`/applications/${leaseApplicationId}/calculators/${leaseCalculatorId}/calculator`}><Tag>Edit</Tag></Link>}>

                              </Panel> */}
              </Collapse>
            </div>
          </Content>
        </div>

        <div style={{ marginTop: 20, textAlign: `center` }}>
          <Button style={{ marginRight: 10 }} type="primary" onClick={handleSubmit}>
            Submit to Speed Leasing
          </Button>
        </div>
      </div>
    </>
  )
}

export default Summary