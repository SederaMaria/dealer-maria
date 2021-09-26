import React, { useState } from 'react'
import { Row, Col, Card, Button, Form, Input, Radio, InputNumber, Select, Typography, Layout } from "antd";
import MaskedInput from 'antd-mask-input'
import SsnInput from './SsnInput'
import DobInput from './DobInput'
import '../../styles/Applicant.css';

const { Option } = Select;
const { Title } = Typography;
const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';
const layout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };
  

interface Lessee {
    ssn?: string | undefined
}

interface Props {
    setStep: React.Dispatch<React.SetStateAction<string>>,
    data?: {
        lessee: Lessee
    }
}

export const Applicant: React.FC<Props> = ({setStep, data}: Props) => {


    const { lessee } = data || {};

    const [lesseeForm] = Form.useForm();

    const [lesseeHomeStateOptions, setLesseeHomeStateOptions] = useState([])
    const [lesseeHomeCountyOptions, setLesseeHomeCountyOptions] = useState([])
    const [lesseeHomeCityOptions, setLesseeHomeCityOptions] = useState([])

    const [lesseeMailStateOptions, setLesseeMailStateOptions] = useState([])
    const [lesseeMailCountyOptions, setLesseeMailCountyOptions] = useState([])
    const [lesseeMailCityOptions, setLesseeMailCityOptions] = useState([])

    const [zipHomeValidateStatus, setZipHomeValidateStatus] = useState(undefined)
    const [zipHomeErrorMessage, setZipHomeErrorMessage] = useState(undefined)

    const [zipMailValidateStatus, setZipMailValidateStatus] = useState(undefined)
    const [zipMailErrorMessage, setZipMailErrorMessage] = useState(undefined)

    const [employerStateOptions, setEmployerStateOptions] = useState([])
    const [employmentStatusOptions, setEmploymentStatusOptions] = useState([])

    const [phoneOption, setPhoneOption] = useState(1)
    const [requireEmploymentFields, setRequireEmploymentFields] = useState(false)

    const [showHomeState, setShowHomeState] = useState(null)
    const [showHomeCountyState, setShowHomeCountyState] = useState(null)
    const [showHomeCityState, setShowHomeCityState] = useState(null)
    const [showMailingState, setShowMailingState] = useState(null)
    const [showMailingCountyState, setShowMailingCountyState] = useState(null)
    const [showMailingCityState, setShowMailingCityState] = useState(null)

    const [submitError, setSubmitError] = useState(null)
    const [hasSubmitError, setHasSubmitError] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const [disableSubmitBtn, setDisableSubmitBtn] = useState(true)


    const [makesOptions, setMakesOptions] = useState([])
    const [yearsOptions, setYearsOptions] = useState([])
    const [modelsOptions, setModelsOptions] = useState([])
    const [mileageRangeOptions, setMileageRangeOptions] = useState([])
    const [creditTierOptions, setCreditTierOptions] = useState([])
    

    const [showMakeState, setShowMakeState] = useState(null)
    const [showYearState, setShowYearState] = useState(null)
    const [showModelState, setShowModelState] = useState(null)
    const [showMileageRangeState, setShowMileageRangeState] = useState(null)
    const [showCreditTierState, setShowCreditTierState] = useState(null)



    return (
        <div style={{ margin: `20px 100px` }}>
            <div style={{ textAlign: `center`,  marginBottom: 20}}>
                <Title level={2}> Applicant </Title>
                <p> Enter information about yourself to apply for a lease. </p>
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
                <Content className="content-1" style={{ backgroundColor: `white`, marginBottom: 50}}>

                    <Row gutter={[16, 40]}>
                        <Col span={24} className="cca-center-text">
                            <Title level={2}> About You </Title>
                            <br/>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Personal">
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="First Name" 
                                            name={['lesseeAttributes', 'firstName']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'First Name is required!' }]}
                                        >  
                                            <Input placeholder="First Name" className="ant-input-comp"  />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Middle Name" 
                                            name={['lesseeAttributes', 'middleName']}>  
                                                <Input placeholder="Middle Name" className="ant-input-comp" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Last Name" 
                                            name={['lesseeAttributes', 'lastName']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'Last Name is required!' }]}
                                        >  
                                            <Input placeholder="Last Name"  className="ant-input-comp" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <DobInput dateFormat={dateFormat} form={lesseeForm} />
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                                label="Social Security Number" 
                                                name={['lesseeAttributes', 'ssn']}
                                                rules={[{ required: true, message: 'Social Security Number is required!' }]}
                                            >  
                                            <Input type="hidden" />
                                            <SsnInput defaultValue="" form={lesseeForm} lesseeType="lessee"/>
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={24}> 
                                        <Form.Item label="Driver's License Number" name={['lesseeAttributes', 'driversLicenseIdNumber']}>  
                                            <InputNumber placeholder="Driver's License Number"/>
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Phone Number" 
                                            name={['lesseeAttributes', `${ phoneOption === 1 ? 'mobilePhoneNumber' : 'homePhoneNumber' }`]}
                                            rules={[{ required: true, message: 'Phone Number is required!' }]}
                                            >
                                            <MaskedInput
                                                mask="(111) 111-1111"
                                                placeholder="Phone Number"
                                                className="credit-app-phone-no"
                                                />
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row>
                                    <Col span={24}> 
                                        <Radio.Group defaultValue={1}>
                                        {/* <Radio.Group defaultValue={1} onChange={handlePhoneNumber}> */}
                                            <Radio value={1}>Mobile</Radio>
                                            <Radio value={2}>Home</Radio>
                                        </Radio.Group> 
                                    </Col> 
                                </Row>
                            </Card>
                        </Col>
                        
                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Home Address">
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Street Address (no P.O. Boxes)" 
                                            name={['lesseeAttributes', 'homeAddressAttributes','street1']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'Street Address (no P.O. Boxes) is required!' }]}
                                        >  
                                            <Input placeholder="Street Address (no P.O. Boxes)" className="ant-input-comp"  />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item label="Appartment / Unit" name={['lesseeAttributes', 'homeAddressAttributes','street2']}>  
                                            <Input placeholder="Appartment / Unit" className="ant-input-comp"  />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="ZIP Code" 
                                            name={['lesseeAttributes', 'homeAddressAttributes','zipcode']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'ZIP Code is required!' }]}
                                            validateStatus={zipHomeValidateStatus}
                                            help={zipHomeErrorMessage}
                                        >  
                                            <MaskedInput mask="11111" placeholder="ZIP Code" 
                                            // onPressEnter={handleLesseeHomeZipcodeBlur} 
                                            // onBlur={handleLesseeHomeZipcodeBlur} 
                                            className="ant-input-comp" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="State" 
                                            name={['lesseeAttributes', 'homeAddressAttributes','state']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'State is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="State" 
                                                {...showHomeState} 
                                                // onSelect={handleHomeStateChange}
                                                >
                                            {
                                                lesseeHomeStateOptions && lesseeHomeStateOptions.map(({value, label}, index) => {
                                                return <Option key={index} value={`${value}`}>{label}</Option>
                                                })
                                            }
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="County/Parish" 
                                            name={['lesseeAttributes', 'homeAddressAttributes','county']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'County/Parish is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="County/Parish" 
                                                {...showHomeCountyState} 
                                                // onSelect={handleHomeCountyStateChange} 
                                                >
                                            {
                                                lesseeHomeCountyOptions && lesseeHomeCountyOptions.map(({value, label}, index) => {
                                                return <Option key={index} value={`${value}`}>{label}</Option>
                                                })
                                            }
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="City" 
                                            name={['lesseeAttributes', 'homeAddressAttributes','cityId']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'City is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="City" 
                                                {...showHomeCityState} 
                                                // onSelect={handleHomeCityStateChange}
                                            >
                                            {
                                                lesseeHomeCityOptions && lesseeHomeCityOptions.map(({value, label}, index) => {
                                                return <Option key={index} value={`${value}`}>{label}</Option>
                                                })
                                            }
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Years at Current Address" 
                                            name={['lesseeAttributes','atAddressYears']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'Years at Current Address is required!' }]}
                                        >  
                                            <InputNumber placeholder="Years at Current Address" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item label="Months at Current Address" name={['lesseeAttributes','atAddressMonths']}>  
                                            <InputNumber placeholder="Months at Current Address" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Monthly Mortgage or Rent" 
                                            name={['lesseeAttributes','monthlyMortgage']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'Years at Current Address is required!' }]}
                                        >  
                                            <InputNumber placeholder="Monthly Mortgage or Rent" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                    <Form.Item 
                                        name={['lesseeAttributes','homeOwnership']}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Home Owenership is required!' }]}
                                    >                      
                                        <Radio.Group>
                                        <Radio value={1}>Own</Radio>
                                        <Radio value={2}>Rent</Radio>
                                        </Radio.Group> 
                                    </Form.Item>
                                    </Col> 
                                </Row>
                            </Card>
                        </Col>


                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Mailing Address">
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="Street Address (no P.O. Boxes)" 
                                            name={['lesseeAttributes', 'mailingAddressAttributes','street1']}
                                            hasFeedback
                                        >  
                                            <Input placeholder="Street Address (no P.O. Boxes)" className="ant-input-comp" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item label="Appartment / Unit" name={['lesseeAttributes', 'mailingAddressAttributes','street2']}>  
                                            <Input placeholder="Appartment / Unit" className="ant-input-comp"  />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="ZIP Code" 
                                            name={['lesseeAttributes', 'mailingAddressAttributes','zipcode']}
                                            hasFeedback
                                            validateStatus={zipMailValidateStatus}
                                            help={zipMailErrorMessage}
                                        >  
                                            <MaskedInput 
                                            mask="11111" 
                                            placeholder="ZIP Code" 
                                            // onPressEnter={handleLesseeMailZipcodeBlur} 
                                            // onBlur={handleLesseeMailZipcodeBlur} 
                                            className="ant-input-comp" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="State" 
                                            name={['lesseeAttributes', 'mailingAddressAttributes','state']}
                                            hasFeedback
                                        >  
                                            <Select showSearch placeholder="State" {...showMailingState} 
                                            // onSelect={handleMailingStateChange} 
                                            >
                                            {
                                                lesseeMailStateOptions && lesseeMailStateOptions.map(({value, label}, index) => {
                                                return <Option key={index} value={`${value}`}>{label}</Option>
                                                })
                                            }
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="County/Parish" 
                                            name={['lesseeAttributes', 'mailingAddressAttributes','county']}
                                            hasFeedback
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="County/Parish" 
                                                {...showMailingCountyState} 
                                                // onSelect={handleMailingCountyStateChange} 
                                            >
                                            {
                                                lesseeMailCountyOptions && lesseeMailCountyOptions.map(({value, label}, index) => {
                                                return <Option key={index} value={`${value}`}>{label}</Option>
                                                })
                                            }
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                    <Form.Item 
                                        label="City" 
                                        name={['lesseeAttributes', 'mailingAddressAttributes','cityId']}
                                        hasFeedback
                                    >  
                                        <Select 
                                            showSearch 
                                            placeholder="City" 
                                            {...showMailingCityState} 
                                            // onSelect={handleMailingCityStateChange}
                                            >
                                        {
                                            lesseeMailCityOptions && lesseeMailCityOptions.map(({value, label}, index) => {
                                            return <Option key={index} value={`${value}`}>{label}</Option>
                                            })
                                        }
                                        </Select>
                                    </Form.Item>
                                    </Col> 
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Content>

            
                <Content className="content-1" style={{ backgroundColor: `white`, marginBottom: 20}}>

                    <Row gutter={[16, 16]}>
                        <Col span={24} className="cca-center-text">
                            <Title level={2}> About Your Work </Title>
                            <br/>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={4}></Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Employer">
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Employer Name" 
                                        name={['lesseeAttributes', 'employerName']}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Employer Name is required!' }]}
                                        >  
                                            <Input placeholder="Employer Name"  className="ant-input-comp"  />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Phone Number" 
                                        name={['lesseeAttributes', 'employerPhoneNumber']}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Employer Name is required!' }]}
                                        >
                                            <MaskedInput
                                                mask="(111) 111-1111"
                                                placeholder="Phone Number"
                                                className="credit-app-phone-no"
                                                />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="City" 
                                        name={['lesseeAttributes', 'employmentAddressAttributes', 'city']}
                                        hasFeedback
                                        rules={[{ required: true, message: 'City is required!' }]}
                                        >  
                                            <Input placeholder="City" className="ant-input-comp"  />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                            label="State" 
                                            name={['lesseeAttributes', 'employmentAddressAttributes','state']}
                                            hasFeedback
                                            rules={[{ required: true, message: 'State is required!' }]}
                                        >  
                                                <Select 
                                                    showSearch 
                                                    placeholder="State"
                                                >
                                                {
                                                    employerStateOptions && employerStateOptions.map(({value, label}, index) => {
                                                    return <Option key={index} value={`${value}`}>{label}</Option>
                                                    })
                                                }
                                                </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <Card title="Employment Details">
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Employment Status" 
                                        name={['lesseeAttributes','employmentStatus']}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Employment Status is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="Employment Status" 
                                                // onChange={handleEmploymentStatus} 
                                                optionFilterProp="children"
                                                >
                                                {
                                                employmentStatusOptions && employmentStatusOptions.map(({value, label}, index) => {
                                                    return <Option key={index} value={`${value}`}>{label}</Option>
                                                })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Job Title" 
                                        name={['lesseeAttributes', 'jobTitle']}
                                        hasFeedback
                                        rules={[{ required: requireEmploymentFields, message: 'Job Title is required!' }]}
                                        >  
                                            <Input placeholder="Job Title"  className="ant-input-comp"  />
                                        </Form.Item>
                                    </Col> 
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}> 
                                        <Form.Item 
                                        label="Years Employed" 
                                        name={['lesseeAttributes', 'timeAtEmployerYears']}
                                        hasFeedback
                                        rules={[{ required: requireEmploymentFields, message: 'Years Employed is required!' }]}
                                        >  
                                            <InputNumber placeholder="Years Employed" />
                                        </Form.Item>
                                    </Col> 
                                    <Col span={12}> 
                                        <Form.Item 
                                        label="Months Employed" 
                                        name={['lesseeAttributes', 'timeAtEmployerMonths']}
                                        hasFeedback
                                        rules={[{ required: requireEmploymentFields, message: 'Months Employed is required!' }]}
                                        >  
                                            <InputNumber placeholder="Months Employed" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Gross Monthly Income" 
                                        name={['lesseeAttributes', 'grossMonthlyIncome']}
                                        hasFeedback
                                        rules={[{ required: requireEmploymentFields, message: 'Gross Monthly Income is required!' }]}
                                        >  
                                            <InputNumber placeholder="Gross Monthly Income" />
                                        </Form.Item>
                                    </Col> 
                                </Row>
                            </Card>

                            <div style={{ marginTop: 20, textAlign: `right`}}>
                                <Button style={{ marginRight: 10 }}>Save</Button>
                                <Button style={{ marginRight: 10 }} type="primary" onClick={() => { setStep('calculator') } } >Prev</Button>
                                <Button style={{ marginRight: 10 }} type="primary" onClick={() => { setStep('co-applicant') } } >Next</Button>
                            </div>

                        </Col>
                    </Row>
                </Content>




{/* 
                <Content className="content-2">
                    <Row >
                        <Col span={24} >
                            { hasSubmitError && <Alert type="error" message={`${submitError}`} banner />}
                        </Col>
                    </Row>
                    <Row >
                        <Col span={24} >
                            { submitSuccess && <Alert type="success" message="Your application has been submitted. We will contact you shortly." banner />}
                        </Col>
                    </Row>
                    { (hasSubmitError || submitSuccess) && <br/> }
                    <Row>
                        <Col span={24} className="cca-center-text"> 
                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={disableSubmitBtn}>
                                Submit
                                </Button>
                            </Form.Item>
                        </Col> 
                    </Row>
                </Content> */}
            </Form>


        </div>
    )
}

export default Applicant
