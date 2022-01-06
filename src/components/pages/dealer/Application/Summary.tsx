import React from 'react';
import { Row, Col, Button, Typography, Layout, Avatar, Collapse, Tag, Card, Divider, message } from "antd";
import 'antd/dist/antd.css';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApplicationSteps from './ApplicationSteps';
import { Lessee as SummaryLessee } from './Applicant/Applicant';
import '../../../layouts/styles/Summary.css';
import { logger, network } from '../../../../utils';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;

interface LeaseCalculator {
    id?: string | number | undefined
}

interface Props {
    data?: {
        id: string | number,
        lessee: SummaryLessee,
        colessee: SummaryLessee,
        leaseCalculator: LeaseCalculator
    }, 
    label?: any
}

const MotorSummary: React.FC<Props>  = ({label, children }) => {
  return <div>         
    <p><Text style={{color: "rgba(0, 0, 0, 0.65)", fontWeight: 700, fontSize: "1.1em"}}>{label}</Text></p>
    <p>{children}</p>
    </div>
}

export const Summary: React.FC<Props> = ({data}) => {
    console.log(`data the calculator`, data)
    let leaseApplicationId: string | number | undefined = data?.id
    let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.id

    const handleSubmit = async () => {        
        try {
            await network.POST(`/api/v1/dealers/applications/${leaseApplicationId}`, data);
            console.log("Submit Data", data)
            console.log(data?.lessee?.firstName)
            message.success("Succesfully Submitted Application")
         } catch (e) {
           logger.error("Request Error", e);
           message.error("Error submitting application");
         }
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
                        <div id="motor-content">
                            <div>
                                <Avatar shape="square" size={150} style={{marginLeft:`35px`}} icon={<UserOutlined />} />
                            </div>
                            <div className="motor-details">
                                <div className="motor-summary">
                                    <MotorSummary label="Make">N/A</MotorSummary>
                                    <MotorSummary label="Model">N/A</MotorSummary>
                                    <MotorSummary label="Year">N/A</MotorSummary>
                                    <MotorSummary label="Total Sales Price">N/A</MotorSummary>
                                    <MotorSummary label="Term">N/A</MotorSummary>
                                </div>
                                <div className="motor-summary">
                                    <MotorSummary label="Make">N/A</MotorSummary>
                                    <MotorSummary label="Model">N/A</MotorSummary>
                                    <MotorSummary label="Year">N/A</MotorSummary>
                                    <MotorSummary label="Total Sales Price">N/A</MotorSummary>
                                    <MotorSummary label="Term">N/A</MotorSummary>
                                </div>
                               
                            </div>
                        </div>
                        <div className="collapse-container">
                            <Collapse>
                              <Panel header="Applicant" key="1" style={{textAlign:`left`}} extra={<Link to={`/applications/${leaseApplicationId}/applicant`}><Tag>Edit</Tag></Link>}>
                                  <div className="applicant-elements-above">
                                      <Card title="Personal">
                                        <p id="locateTest"><em>First Name:</em> {data?.lessee?.firstName}</p><Divider dashed />
                                        <p><em>Middle Name:</em> {data?.lessee?.middleName}</p><Divider dashed />
                                        <p><em>Last Name:</em> {data?.lessee?.lastName}</p><Divider dashed />
                                        <p><em>Date of Birth(mm/dd/yyyy):</em> {data?.lessee?.dateOfBirth}</p><Divider dashed />
                                        <p><em>Social Security Number:</em> {data?.lessee?.ssn}</p><Divider dashed />
                                        <p><em>Driver's License Number:</em> {data?.lessee?.driversLicenseIdNumber}</p><Divider dashed />
                                        <p><em>Home Phone Number:</em> { data?.lessee?.homePhoneNumber}</p><Divider dashed />
                                        <p><em>Mobile Phone Number:</em> {data?.lessee?.mobilePhoneNumber}</p>
                                      </Card>
                                      <Card title="Home Address">
                                        <p><em>Street Address 1 (no P.O. Boxes):</em> {data?.lessee?.homeAddress?.street1}</p><Divider dashed />
                                        <p><em>Street Address 2:</em> {data?.lessee?.homeAddress?.street2}</p><Divider dashed />
                                        <p><em>ZIP Code:</em> {data?.lessee?.homeAddress?.zipcode}</p><Divider dashed />
                                        <p><em>State:</em>  {data?.lessee?.homeAddress?.state}</p><Divider dashed />
                                        <p><em>County/Parish:</em> {data?.lessee?.homeAddress?.county}</p><Divider dashed />
                                        <p><em>City:</em> {data?.lessee?.homeAddress?.cityId}</p><Divider dashed />
                                        <p><em>Years at Current Address:</em> {data?.lessee?.atAddressYears}</p><Divider dashed />
                                        <p><em>Months at Current Address:</em> {data?.lessee?.atAddressMonths}</p><Divider dashed />
                                        <p><em>Monthly Mortgage or Rent:</em> {data?.lessee?.monthlyMortgage}</p><Divider dashed />
                                        <p><em>Ownership:</em> {data?.lessee?.homeOwnership == 1 ? 'Own' : 'Rent'}</p>
                                      </Card>
                                      <Card title="Mailing Address">
                                        <p><em>Street Address (no P.O. Boxes):</em> { data?.lessee?.mailingAddress?.street1}</p><Divider dashed />
                                        <p><em>Street Address 2:</em> {data?.lessee?.mailingAddress?.street2}</p><Divider dashed />
                                        <p><em>ZIP Code:</em> {data?.lessee?.mailingAddress?.zipcode}</p><Divider dashed />
                                        <p><em>State:</em> {data?.lessee?.mailingAddress?.state}</p><Divider dashed />
                                        <p><em>County/Parish:</em> {data?.lessee?.mailingAddress?.county}</p><Divider dashed />
                                        <p><em>City:</em> {data?.lessee?.mailingAddress?.cityId}</p>
                                      </Card>
                                      
                                  </div>
                                  <div className="applicant-elements-below">
                                      <Card title="Employeer">
                                        <p><em>Employer Name:</em> {data?.lessee?.employerName}</p><Divider dashed />
                                        <p><em>Phone Number:</em> {data?.lessee?.employerPhoneNumber}</p><Divider dashed />
                                        <p><em>City:</em>  {data?.lessee?.employmentAddress?.city}</p><Divider dashed />
                                        <p><em>State: </em> {data?.lessee?.employmentAddress?.state}</p>
                                      </Card>
                                      <Card title="Employment Details">
                                        <p><em>Employment Status:</em> {data?.lessee?.employmentStatus}</p><Divider dashed />
                                        <p><em>Job Title:</em> {data?.lessee?.jobTitle}</p><Divider dashed />
                                        <p><em>Years Employed:</em> {data?.lessee?.timeAtEmployerYears}</p><Divider dashed />
                                        <p><em>Months Employed: </em> {data?.lessee?.timeAtEmployerMonths}</p><Divider dashed />
                                        <p><em>Gross Monthly Income: </em> ${data?.lessee?.grossMonthlyIncome}</p>
                                      </Card>
                                  </div>
                              </Panel>
                              <Panel header="Co-Applicant" key="2" style={{textAlign:`left`}} extra={<Link to={`/applications/${leaseApplicationId}/co-applicant`}><Tag>Edit</Tag></Link>}>
                                <div className="applicant-elements-above">
                                    <Card title="Personal">
                                      <p><em>First Name:</em> {data?.colessee?.firstName}</p><Divider dashed />
                                      <p><em>Middle Name:</em>  {data?.colessee?.middleName}</p><Divider dashed />
                                      <p><em>Last Name:</em> {data?.colessee?.lastName}</p><Divider dashed />
                                      <p><em>Date of Birth(mm/dd/yyyy):</em> {data?.colessee?.dateOfBirth} </p><Divider dashed />
                                      <p><em>Social Security Number:</em> {data?.colessee?.ssn}</p><Divider dashed />
                                      <p><em>Driver's License Number:</em> {data?.colessee?.driversLicenseIdNumber}</p><Divider dashed />
                                      <p><em>Home Phone Number:</em> { data?.colessee?.homePhoneNumber}</p><Divider dashed />
                                        <p><em>Mobile Phone Number:</em> {data?.colessee?.mobilePhoneNumber}</p>
                                    </Card>
                                    <Card title="Home Address">
                                        <p><em>Street Address 1 (no P.O. Boxes):</em> {data?.colessee?.homeAddress?.street1}</p><Divider dashed />
                                        <p><em>Street Address 2:</em> {data?.colessee?.homeAddress?.street2}</p><Divider dashed />
                                        <p><em>ZIP Code:</em> {data?.colessee?.homeAddress?.zipcode}</p><Divider dashed />
                                        <p><em>State:</em>  {data?.colessee?.homeAddress?.state}</p><Divider dashed />
                                        <p><em>County/Parish:</em> {data?.colessee?.homeAddress?.county}</p><Divider dashed />
                                        <p><em>City:</em> {data?.colessee?.homeAddress?.cityId}</p><Divider dashed />
                                        <p><em>Years at Current Address:</em> {data?.colessee?.atAddressYears}</p><Divider dashed />
                                        <p><em>Months at Current Address:</em> {data?.colessee?.atAddressMonths}</p><Divider dashed />
                                        <p><em>Monthly Mortgage or Rent:</em> {data?.colessee?.monthlyMortgage}</p><Divider dashed />
                                        <p><em>Ownership:</em> {data?.colessee?.homeOwnership == 1 ? 'Own' : 'Rent'}</p>
                                    </Card>
                                    <Card title="Mailing Address">
                                        <p><em>Street Address (no P.O. Boxes):</em> { data?.colessee?.mailingAddress?.street1}</p><Divider dashed />
                                        <p><em>Street Address 2:</em> {data?.colessee?.mailingAddress?.street2}</p><Divider dashed />
                                        <p><em>ZIP Code:</em> {data?.colessee?.mailingAddress?.zipcode}</p><Divider dashed />
                                        <p><em>State:</em> {data?.colessee?.mailingAddress?.state}</p><Divider dashed />
                                        <p><em>County/Parish:</em> {data?.colessee?.mailingAddress?.county}</p><Divider dashed />
                                        <p><em>City:</em> {data?.colessee?.mailingAddress?.cityId}</p>
                                    </Card>
                                </div>
                                <div className="applicant-elements-below">
                                    <Card title="Employeer">
                                        <p><em>Employer Name:</em> {data?.colessee?.employerName}</p><Divider dashed />
                                        <p><em>Phone Number:</em> {data?.colessee?.employerPhoneNumber}</p><Divider dashed />
                                        <p><em>City:</em>  {data?.colessee?.employmentAddress?.city}</p><Divider dashed />
                                        <p><em>State: </em> {data?.colessee?.employmentAddress?.state}</p>
                                    </Card>
                                    <Card title="Employment Details">
                                        <p><em>Employment Status:</em> {data?.colessee?.employmentStatus}</p><Divider dashed />
                                        <p><em>Job Title:</em> {data?.colessee?.jobTitle}</p><Divider dashed />
                                        <p><em>Years Employed:</em> {data?.colessee?.timeAtEmployerYears}</p><Divider dashed />
                                        <p><em>Months Employed: </em> {data?.colessee?.timeAtEmployerMonths}</p><Divider dashed />
                                        <p><em>Gross Monthly Income: </em> ${data?.colessee?.grossMonthlyIncome}</p>
                                    </Card>
                                </div>
                              </Panel>
                              <Panel header="Calculation" key="3"  style={{textAlign:`left`}} extra={<Link to={`/applications/${leaseApplicationId}/calculators/${leaseCalculatorId}/calculator`}><Tag>Edit</Tag></Link>}>
                              {/* <p>{text}</p> */}
                              </Panel>
                            </Collapse>
                        </div>
                    </Content>
                </div>

                <div style={{ marginTop: 20, textAlign: `center`}}>
                    <Button style={{ marginRight: 10 }} type="primary" 
                        onClick={handleSubmit}
                    >
                        Submit to Speed Leasing
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Summary
