import React, { useState, ChangeEvent, MouseEvent, FormEvent } from 'react'
import { Row, Col, Card, Form, Select, Typography, Layout, Button, Input } from "antd";
import { Link } from 'react-router-dom';
import { logger, network } from '../../../../utils';
import ApplicationSteps from './ApplicationSteps';
const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

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
interface OptionProps {
    value?: string | number,
    label?: string,
}

export const BikeInformation: React.FC<Props> = ({data}) => {

    const [lesseeForm] = Form.useForm();

    let leaseApplicationId: string | number | undefined = data?.id
    let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.leaseCalculator?.id

    const [makesOptions, setMakesOptions] = useState<OptionProps[]>([])
    const [yearsOptions, setYearsOptions] = useState<OptionProps[]>([])
    const [modelsOptions, setModelsOptions] = useState<OptionProps[]>([])
    const [mileageRangeOptions, setMileageRangeOptions] = useState<OptionProps[]>([])
    const [creditTierOptions, setCreditTierOptions] = useState<OptionProps[]>([])

    const [showBikeForm, setShowBikeForm] = useState<boolean>(false)
    const [showViaVIN, setShowViaVIN] = useState<boolean>(false)

    const [showMakeState, setShowMakeState] = useState<object | null>(null)
    const [showYearState, setShowYearState] = useState<object | null>(null)
    const [showModelState, setShowModelState] = useState<object | null>(null)
    const [showMileageRangeState, setShowMileageRangeState] = useState<object | null>(null)
    const [showCreditTierState, setShowCreditTierState] = useState<object | null>(null)

    const [vinMake, setVinMake] = useState<string | undefined>("")
    const [vinYear, setVinYear] = useState<string | number | undefined>("")
    const [vinModel, setVinModel] = useState<string | undefined>("")

    const [validateVIN, setValidateVIN] = useState<string | null>(null)

    const handleVin = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 17){
            let vin = e.target.value
            try {
                await  network.GET(`/api/v1/vin_verification/verify-vin?vin=${vin}`
                ).then(res => {
                    lesseeForm.setFieldsValue({ 
                        leaseCalculatorAttributes: { 
                            assetMake: res.data.vehicleInfo.make, 
                            assetYear: res.data.vehicleInfo.year, 
                            assetModel: res.data.vehicleInfo.model[0] 
                    } });
                    setVinMake(res.data.vehicleInfo.make)
                    setVinYear(res.data.vehicleInfo.year)
                    setVinModel(res.data.vehicleInfo.model[0])
                    setShowViaVIN(true)
                    setShowBikeForm(true)
                }).catch(e => {
                    if (e && e.response.status === 404){
                        setValidateVIN("error")
                    } else {
                        setValidateVIN("success")
                    }
                })
            } catch (e) {
                logger.error("Error verifying vin", e);
            };
        }
    }

    const getMakes = async ( ) => {
        try {
          let result = await network.GET(`/api/v1/bike-information/makes-name-options`);
          setMakesOptions(formatOptions(result.data.makes || []))
          setMileageRangeOptions(formatOptions((result.data.mileage_range || [])))
        } catch (e) {
          logger.error("Request Error", e);
        }
      }

      const getYears = async (make: string) => {
        try {
          let result = await network.GET(`/api/v1/bike-information/years-options?make=${make}`);
          setYearsOptions(formatOptions(result.data.years || []))
          setCreditTierOptions(result.data.credit_tiers || [])
        } catch (e) {
          logger.error("Request Error", e);
        }
      }

      const getModels = async (make: string, year: string | number) => {
        try {
          let result = await network.GET(`/api/v1/bike-information/models-options?make=${make}&year=${year}`);
          console.log(result)
          setModelsOptions(formatOptions((result.data.models || []), 'collection'))
          console.log(formatOptions((result.data.models || []), 'collection'))
        } catch (e) {
          logger.error("Request Error", e);
        }
      }


      const handleNoVin = (e: MouseEvent<HTMLElement>) => {
        setShowBikeForm(true)
        getMakes()
        setShowViaVIN(false)
      }



      const handleMakes = (value: any) => {
        getYears(value)
      }
      
      const handleYear = (value: any) => {
        let year = value
        let make = lesseeForm.getFieldValue(['leaseCalculatorAttributes', 'assetMake'])
        console.log(year)
        console.log(make)
        getModels(make, year)
      }

      
      const hideBikeSelectOptions = () => {
        setShowMakeState(null)
        setShowYearState(null)
        setShowModelState(null)
        setShowMileageRangeState(null)
        setShowCreditTierState(null)
    }

      const handleNewUsedStateChange= () => {
        hideBikeSelectOptions()
        setShowMakeState({ "open": true })
    }


    const handleMakesStateChange = () => {
        lesseeForm.setFieldsValue({ 
            leaseCalculatorAttributes: { 
                assetYear: "", 
                assetModel: "", 
        } });
        hideBikeSelectOptions()
        setTimeout(() => {
            setShowYearState({ "open": true })
        }, 500);
        

    }

    const handleYearStateChange = () => {
        hideBikeSelectOptions()
        setTimeout(() => {
            setShowModelState({ "open": true })
        }, 500);
    }


    const handleModelStateChange = () => {
        hideBikeSelectOptions()
        setShowMileageRangeState({ "open": true })
    }

    const handleMileageRangeStateChange = () => {
        hideBikeSelectOptions()
        setShowCreditTierState({ "open": true })
    }


      const formatOptions = (options: Object[], type?: string) => {
        let newOptions: Array<object> = [];
        if (type === 'collection'){
          options.map((value: any) => { newOptions.push({ value: value[1], label: value[0]})})
        }else{
          options.map((value: any) => { newOptions.push({ value: value, label: value})})
        }
        return newOptions
      }



    return (
        <div>
             <ApplicationSteps 
                stepType={`bike`} 
                leaseApplicationId={`${leaseApplicationId}`} 
                leaseCalculatorId={`${leaseCalculatorId}`}  
                save={null} 
            />
            <Form 
                form={lesseeForm} 
                {...layout}  
                // colon={false}
                // onFinish={handleSubmit}
                scrollToFirstError={true}
                // initialValues={{
                //     applicationDisclosureAgreement: 'unchecked'
                // }}
            >


            <Row gutter={[16, 16]}>
                    <Col span={24} className="cca-center-text" style={{ marginTop: 20 }}>
                        <Title level={2}> Bike Information </Title>
                    </Col>
                </Row>
            
                <Content className="content-1">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8}></Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                            <Card>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="VIN" 
                                        name={['leaseCalculatorAttributes', 'vin']} 
                                        validateStatus={validateVIN ? (validateVIN === "error" ? "error" : "success") : undefined}
                                        help={validateVIN && (validateVIN === "error" ? "VIN not found" : " ")}
                                        >  
                                            <Input allowClear maxLength={17} onChange={(e) => handleVin(e)} style={{marginBottom: 10}} />
                                            <Button type="link" block onClick={handleNoVin} style={{textAlign: `left`, padding: `4px 0px`}}>
                                                I don't know the VIN 
                                            </Button>
                                        </Form.Item>
                                    </Col> 
                                </Row>


                                { showBikeForm && 
                                    <div>

                                        <Row>
                                            <Col span={24}> 
                                                <Form.Item 
                                                label="New/Used" 
                                                name={['leaseCalculatorAttributes', 'newUsed']} 
                                                rules={[{ required: true, message: 'New/Used is required!' }]}
                                                >  
                                                    <Select 
                                                        showSearch 
                                                        placeholder="New/Used" 
                                                        onSelect={handleNewUsedStateChange} 
                                                        onBlur={hideBikeSelectOptions}
                                                        >
                                                            <Option key="1" value="New">New</Option>
                                                            <Option key="2" value="Used">Used</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col> 
                                        </Row>
                                        <Row>
                                            <Col span={24}> 
                                                <Form.Item 
                                                label="Make"
                                                name={['leaseCalculatorAttributes', 'assetMake']} 
                                                rules={[{ required: true, message: 'Make is required!' }]}
                                                hidden={showViaVIN}
                                                >  
                                                    <Select 
                                                        showSearch 
                                                        placeholder="Make" 
                                                        {...showMakeState}
                                                        onChange={handleMakes}
                                                        onSelect={handleMakesStateChange}
                                                        onBlur={hideBikeSelectOptions}
                                                        >
                                                        {
                                                            makesOptions && makesOptions.map(({value, label}, index) => {
                                                            return <Option key={index} value={`${value}`}>{label}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                    {
                                                        showViaVIN && 
                                                        <Row style={{marginTop: 10, marginBottom: 0}}>
                                                            <Col span={24}>
                                                                Make
                                                            </Col>
                                                            <Col span={24}>
                                                                { showViaVIN && <Text>{vinMake}</Text>}
                                                            </Col>
                                                        </Row>
                                                    }
                                            </Col> 
                                        </Row>
                                        <Row>
                                            <Col span={24}> 
                                                <Form.Item 
                                                label="Year" 
                                                name={['leaseCalculatorAttributes', 'assetYear']} 
                                                rules={[{ required: true, message: 'Year is required!' }]}
                                                hidden={showViaVIN}
                                                >  

                                                    <Select 
                                                        showSearch 
                                                        placeholder="Year" 
                                                        {...showYearState}
                                                        onChange={handleYear}
                                                        onSelect={handleYearStateChange}
                                                        onBlur={hideBikeSelectOptions}

                                                        >
                                                            {
                                                            yearsOptions && yearsOptions.map(({value, label}, index) => {
                                                            return <Option key={index} value={`${value}`}>{label}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>

                                                {
                                                        showViaVIN && 
                                                        <Row style={{marginTop: 10, marginBottom: 0}}>
                                                            <Col span={24}>
                                                                Year
                                                            </Col>
                                                            <Col span={24}>
                                                                { showViaVIN && <Text>{vinYear}</Text>}
                                                            </Col>
                                                        </Row>
                                                }
                                            </Col> 
                                        </Row>
                                        <Row>
                                            <Col span={24}> 
                                                <Form.Item 
                                                label="Model" 
                                                name={['leaseCalculatorAttributes', 'assetModel']} 
                                                rules={[{ required: true, message: 'Model is required!' }]}
                                                hidden={showViaVIN}
                                                >  

                                                <Select 
                                                    showSearch 
                                                    placeholder="Model" 
                                                    {...showModelState}
                                                    onSelect={handleModelStateChange}
                                                    onBlur={hideBikeSelectOptions}
                                                    >
                                                    {
                                                        modelsOptions && modelsOptions.map(({value, label}, index) => {
                                                        return <Option key={index} value={`${value}`}>{label}</Option>
                                                        })
                                                    }
                                                </Select>

                                                </Form.Item>
                                                    
                                                {
                                                        showViaVIN && 
                                                        <Row style={{marginTop: 10, marginBottom: 10}}>
                                                            <Col span={24}>
                                                                Year
                                                            </Col>
                                                            <Col span={24}>
                                                                { showViaVIN && <Text>{vinModel}</Text>}
                                                            </Col>
                                                        </Row>
                                                }
                                            </Col> 
                                        </Row>
                                        <Row>
                                            <Col span={24}> 
                                                <Form.Item 
                                                label="Mileage Range" 
                                                name={['leaseCalculatorAttributes', 'mileageTier']} 
                                                rules={[{ required: true, message: 'Mileage Range is required!' }]}
                                                >  
                                                    <Select 
                                                        showSearch 
                                                        placeholder="Mileage Range" 
                                                        {...showMileageRangeState}
                                                        onSelect={handleMileageRangeStateChange}
                                                        onBlur={hideBikeSelectOptions}
                                                        >
                                                        {
                                                            mileageRangeOptions && mileageRangeOptions.map(({value, label}, index) => {
                                                            return <Option key={index} value={`${value}`}>{label}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col> 
                                        </Row>
                                    
                                    </div>
                                }
                            </Card>

                            <div style={{ marginTop: 20, textAlign: `right`}}>
                                <Button style={{ marginRight: 10 }}> Save </Button>
                                <Button style={{ marginRight: 10 }} type="primary" >
                                    <Link to={`/applications/${leaseApplicationId}/calculators/${leaseCalculatorId}/calculator`}> Next </Link>
                                </Button>
                            </div>

                        </Col>
                    </Row>
                </Content>
            
            </Form>

        </div>
    )
}

export default BikeInformation
