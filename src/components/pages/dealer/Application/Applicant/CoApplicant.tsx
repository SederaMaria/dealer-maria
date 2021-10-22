import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Input, Radio, InputNumber, Select, Typography, Layout } from "antd";
import { Link } from 'react-router-dom';
import { logger, network } from '../../../../../utils';
import MaskedInput from 'antd-mask-input'
import ApplicationSteps from '../ApplicationSteps';
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

interface OptionData {
    value: string | number,
    label: string,
    parentId?: number
}

export const CoApplicant: React.FC<Props> = ({ data }: Props) => {


    const { lessee } = data || {};

    const [lesseeForm] = Form.useForm();

    let leaseApplicationId: string | number | undefined = data?.id
    let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.leaseCalculator?.id

    const [lesseeHomeStateOptions, setLesseeHomeStateOptions] = useState<Array<OptionData>>([])
    const [lesseeHomeCountyOptions, setLesseeHomeCountyOptions] = useState<Array<OptionData>>([])
    const [lesseeHomeCityOptions, setLesseeHomeCityOptions] = useState<Array<OptionData>>([])
    const [lesseeHomeCityOptionsData, setLesseeHomeCityOptionsData] = useState<Array<OptionData>>([])

    const [lesseeMailStateOptions, setLesseeMailStateOptions] = useState<Array<OptionData>>([])
    const [lesseeMailCountyOptions, setLesseeMailCountyOptions] = useState<Array<OptionData>>([])
    const [lesseeMailCityOptions, setLesseeMailCityOptions] = useState<Array<OptionData>>([])
    const [lesseeMailCityOptionsData, setLesseeMailCityOptionsData] = useState<Array<OptionData>>([])

    const [zipHomeValidateStatus, setZipHomeValidateStatus] = useState<any | undefined>(undefined)
    const [zipHomeErrorMessage, setZipHomeErrorMessage] = useState<string | undefined>(undefined)

    const [zipMailValidateStatus, setZipMailValidateStatus] = useState<any | undefined>(undefined)
    const [zipMailErrorMessage, setZipMailErrorMessage] = useState<string | undefined>(undefined)

    const [employerStateOptions, setEmployerStateOptions] = useState([])
    const [employmentStatusOptions, setEmploymentStatusOptions] = useState([])

    const [phoneOption, setPhoneOption] = useState(1)
    const [requireEmploymentFields, setRequireEmploymentFields] = useState(false)

    const [showHomeState, setShowHomeState] = useState<object | null>(null)
    const [showHomeCountyState, setShowHomeCountyState] = useState<object | null>(null)
    const [showHomeCityState, setShowHomeCityState] = useState<object | null>(null)
    const [showMailingState, setShowMailingState] = useState<object | null>(null)
    const [showMailingCountyState, setShowMailingCountyState] = useState<object | null>(null)
    const [showMailingCityState, setShowMailingCityState] = useState<object | null>(null)

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

    const handleLesseeHomeZipcodeBlur = async () => {
        let zipcode = lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'zipcode'])

        try {
            lesseeForm.setFieldsValue({
                lesseeAttributes: {
                    homeAddressAttributes: {
                        state: null,
                        county: null,
                        cityId: null
                    }
                }
            })

            await network.GET(`/api/v1/address/city-details?zipcode=${zipcode}`).then(response => {
                if (response.data.is_state_active_on_calculator) {
                    setLesseeHomeStateOptions(formatOptions({ options: (response.data.state || []), type: 'state' }))
                    setLesseeHomeCountyOptions(formatOptions({ options: (response.data.county || []), type: 'county' }))
                    setLesseeHomeCityOptionsData(formatOptions({ options: (response.data.city || []), type: 'city' }))
                    setShowHomeState({ "open": true })
                }
                if (!response.data.is_state_active_on_calculator || (response.data.city.length < 1 || response.data.city === undefined)) {
                    setZipHomeValidateStatus("error")
                    setZipHomeErrorMessage("Speed Leasing currently does not lease to residents of this state.")
                    setShowHomeState(null)
                } else {
                    setZipHomeValidateStatus(undefined)
                    setZipHomeErrorMessage(undefined)
                }
            }).catch(error => {
                logger.error("handleLesseeHomeZipcodeBlur.Request Error", error);
            });
        } catch (e) {
            logger.error("handleLesseeHomeZipcodeBlur Error", e);
        }
    }

    const handleLesseeMailZipcodeBlur = async () => {
        let zipcode = lesseeForm.getFieldValue(['lesseeAttributes', 'mailingAddressAttributes','zipcode'])

        try {
            lesseeForm.setFieldsValue({
                lesseeAttributes: {
                    mailingAddressAttributes: {
                        state: null,
                        county: null,
                        cityId: null
                    }
                }
            })

            await network.GET(`/api/v1/address/city-details?zipcode=${zipcode}`).then(response => {
                if (response.data.is_state_active_on_calculator) {
                    setLesseeMailStateOptions(formatOptions({ options: (response.data.state || []), type: 'state' }))
                    setLesseeMailCountyOptions(formatOptions({ options: (response.data.county || []), type: 'county' }))
                    setLesseeMailCityOptionsData(formatOptions({ options: (response.data.city || []), type: 'city' }))
                    setShowMailingState({ "open": true })
                }
                if (!response.data.is_state_active_on_calculator || response.data.city.length < 1 || response.data.city === undefined) {
                    setZipMailValidateStatus("error")
                    setZipMailErrorMessage("Speed Leasing currently does not lease to residents of this state.")
                    setShowMailingState(null)
                } else {
                    setZipMailValidateStatus(undefined)
                    setZipMailErrorMessage(undefined)
                }
            }).catch(error => {
                logger.error("handleLesseeMailZipcodeBlur.Request Error", error);
            });
        } catch (e) {
            logger.error("handleLesseeMailZipcodeBlur Error", e);
        }
    }

    const formatOptions = (params: { options: Array<any>, type?: string }) => {
        switch (params.type) {
            case 'city': {
                return params.options.map((value: any) => {
                    return {
                        value: value['id'],
                        label: value['name'],
                        parentId: value['countyId']
                    }
                })
            }
            default: {
                return params.options.map((value: any) => {
                    return {
                        value: value['id'],
                        label: value['abbreviation'] ? value['abbreviation'] : value['name']
                    }
                })
            }
        }
    }

    const handleHomeStateChange = () => {
        setShowHomeState(null)
        setShowHomeCountyState({ "open": true })
    }

    const handleHomeCountyStateChange = (countyStateId: any) => {
        if (countyStateId) {
            lesseeForm.setFieldsValue({ lesseeAttributes: { homeAddressAttributes: { cityId: null } } })
            setLesseeHomeCityOptions(lesseeHomeCityOptionsData.filter((obj: OptionData) => obj.parentId === parseInt(countyStateId)))
        }

        setShowHomeCountyState(null)
        setShowHomeCityState({ "open": true })
    }

    const handleHomeCityStateChange = () => {
        setShowHomeCityState(null)
    }

    const handleMailingStateChange = () => {
        setShowMailingState(null)
        setShowMailingCountyState({ "open": true })
    }

    const handleMailingCountyStateChange = (countyStateId: any) => {
        if (countyStateId) {
            lesseeForm.setFieldsValue({ lesseeAttributes: { mailingAddressAttributes: { cityId: null } } })
            setLesseeMailCityOptions(lesseeMailCityOptionsData.filter((obj: OptionData) => obj.parentId === parseInt(countyStateId)))
        }

        setShowMailingCountyState(null)
        setShowMailingCityState({ "open": true })
    }

    const handleMailingCityStateChange = () => {
        setShowMailingCityState(null)
    }

    const getEmployerStatus = async () => {
        try {
            await network.GET(`/api/v1/employment-status`).then(response => {
                if (response.data.employment_status) {
                    setEmploymentStatusOptions(response.data.employment_status.map((item: [string, string | number]) => {
                        return {
                            value: item[1],
                            label: item[0]
                        }
                    }))
                } else {
                    setEmploymentStatusOptions([])
                }
            })
        } catch (e) {
            logger.error("Request Error", e);
        }
    }

    const handleEmploymentStatus = (value: string) => {
        if (value === '0' || value === '1') {
            setRequireEmploymentFields(true)
        } else {
            setRequireEmploymentFields(false)
        }
    }

    useEffect(() => {
        getEmployerStatus()
    }, []);

    return (
        <>
              <ApplicationSteps 
                stepType={`co-applicant`} 
                leaseApplicationId={`${leaseApplicationId}`} 
                leaseCalculatorId={`${leaseCalculatorId}`}  
                save={null} 
            />
            <div style={{ margin: `20px 100px` }}>
                <div style={{ textAlign: `center`,  marginBottom: 20}}>
                    <Title level={2}> Co Applicant </Title>
                    <p> Enter information about yourself to apply for a lease. </p>
                </div>
            <Form 
                    form={lesseeForm}
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
                                                onPressEnter={handleLesseeHomeZipcodeBlur}
                                                onBlur={handleLesseeHomeZipcodeBlur}
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
                                                    onSelect={handleHomeStateChange}
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
                                                    onSelect={handleHomeCountyStateChange}
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
                                                    onSelect={handleHomeCityStateChange}
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
                                                onPressEnter={handleLesseeMailZipcodeBlur}
                                                onBlur={handleLesseeMailZipcodeBlur}
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
                                                onSelect={handleMailingStateChange}
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
                                                    onSelect={handleMailingCountyStateChange}
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
                                                onSelect={handleMailingCityStateChange}
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
                                                    onChange={handleEmploymentStatus}
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
                                    <Button style={{ marginRight: 10 }} type="primary" >
                                        <Link to={`/applications/${leaseApplicationId}/applicant`}> prev </Link>
                                    </Button>
                                    <Button style={{ marginRight: 10 }} type="primary" >
                                        <Link to={`/applications/${leaseApplicationId}/summary`}> Next </Link>
                                    </Button>
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
        </>
    )
}

export default CoApplicant
