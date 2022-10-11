import React, { useState, ChangeEvent, MouseEvent, FormEvent, useEffect } from 'react'
<<<<<<< HEAD
import { Row, Col, Form, Layout, Button, Input, message, Spin } from 'antd'
=======
import { Row, Col, Form, Select, Layout, Button, Input, message, Spin } from 'antd'
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from "@material-ui/core/TextField";
<<<<<<< HEAD
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { Stack, Autocomplete } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Controller, useForm } from "react-hook-form";
import { logger, network } from '../../../../utils';
import ApplicationSteps from './ApplicationSteps';
//import '../styles/BikeInformation.css';
=======
import { logger, network } from '../../../../utils';
import ApplicationSteps from './ApplicationSteps';
import '../styles/BikeInformation.css';
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547


// const { Title, Text } = Typography
const { Content } = Layout
// const { Option } = Select

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
}

interface Lessee {
  ssn?: string | undefined
}

interface LeaseCalculator {
  id?: string | number | undefined
}

interface RootLeaseCalculator {
  leaseCalculator?: LeaseCalculator
  assetMake?: string
  assetModel?: string
  assetYear?: number
  mileageTier?: string
  newUsed?: string
}

interface Props {
  data?: {
    id: string | number
    lessee: Lessee
    leaseCalculator: RootLeaseCalculator
  }
  dataCheck: any
}
interface OptionProps {
  value?: string | number
  label?: string
}

type Asset = {
  index: number
  label: string
}

export const BikeInformation: React.FC<Props> = ({ data, dataCheck }) => {
  const [lesseeForm] = Form.useForm()

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

  const [vinMake, setVinMake] = useState<string | undefined>('')
  const [vinYear, setVinYear] = useState<any>('')
  const [vinModel, setVinModel] = useState<string | undefined>('')

  const [validateVIN, setValidateVIN] = useState<string | null>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const [rules, setRules] = useState<boolean>(false)  

  const [modelCall, setModelCall] = useState<string>('')
  const [makeValue, setMakevalue] = useState<any>(null)
  const [yearValue, setYearValue] = useState<any>(null)
  const [assetState, setAssetState] = useState<any>(null)
  const [mileageValue, setMileageValue] = useState<any>(null)


  useEffect(() => {
    if (dataCheck !== null) {
      setShowBikeForm(true)
      setSaveBtnAttribute(false)
      setAssetState(data?.leaseCalculator?.newUsed,)
      setMakevalue(data?.leaseCalculator?.assetMake)
      setYearValue(data?.leaseCalculator?.assetYear)
      setMileageValue(data?.leaseCalculator?.mileageTier)
    }
  }, [])

  const handleVin = async (e:any) => {
    if (e.target.value.length === 17) {
      let vin = e.target.value
      setLoading(true)
      try {
        await network
          .GET(`/api/v1/vin_verification/verify-vin?vin=${vin}`)
          .then((res) => {
            lesseeForm.setFieldsValue({
              leaseCalculatorAttributes: {
                assetMake: res.data.vehicleInfo.make,
                assetYear: res.data.vehicleInfo.year,
                assetModel: res.data.vehicleInfo.model[0],
              },
            })
            setVinMake(res.data.vehicleInfo.make)
            setVinYear(res.data.vehicleInfo.year)
            setVinModel(res.data.vehicleInfo.model)
            setShowViaVIN(true)
            setShowBikeForm(true)
            setLoading(false)
            getMakes()
            setSaveBtnAttribute(false)
          })
          .catch((e) => {
            if (e && e.response.status === 404) {
              setValidateVIN('error')
            } else {
              setValidateVIN('success')
            }
            setLoading(false)
          })
      } catch (e) {
        logger.error('Error verifying vin', e)
        setLoading(false)
      }
    }
  }

  const getMakes = async () => {
    try {
      let result = await network.GET(`/api/v1/bike-information/makes-name-options`)
      setMakesOptions(formatOptions(result.data.makes || []))
      setMileageRangeOptions(formatOptions(result.data.mileage_range || []))
    } catch (e) {
      logger.error('Request Error', e)
    }
  }

  const getYears = async (make: string) => {
    try {
      let result = await network.GET(`/api/v1/bike-information/years-options?make=${make}`)
      setYearsOptions(formatOptions(result.data.years || []))
      setCreditTierOptions(result.data.credit_tiers || [])
    } catch (e) {
      logger.error('Request Error', e)
    }
  }

  const getModels = async (make: string, year: string | number) => {
    try {
      let result = await network.GET(`/api/v1/bike-information/models-options?make=${make}&year=${year}`)
      setModelsOptions(formatOptions(result.data.models || [], 'collection'))
    } catch (e) {
      logger.error('Request Error', e)
    }
  }

  

  const handleNoVin = (e: MouseEvent<HTMLElement>) => {
    setShowBikeForm(true)
    getMakes()
    setShowViaVIN(false)
    setRules(true)
    setSaveBtnAttribute(false)
  }

  const handleAssetState = (e: any, newValue:any) =>{
      setAssetState(newValue.label)
  }

  const handleMakes = (e: any, newValue:any) => {
    setModelCall(newValue.label)
    getYears(newValue.label)
    setMakevalue(newValue.label)
  }

  const handleYear = (value:any, newValue:any) => {
    let year = newValue.label
    // let make = lesseeForm.getFieldValue(['leaseCalculatorAttributes', 'assetMake'])
    let make = modelCall;
    getModels(make, year)
    setYearValue(newValue.label)
  }

  const hideBikeSelectOptions = () => {
    setShowMakeState(null)
    setShowYearState(null)
    setShowModelState(null)
    setShowMileageRangeState(null)
    setShowCreditTierState(null)
  }

  const handleNewUsedStateChange = () => {
    hideBikeSelectOptions()
  }

  const handleMakesStateChange = () => {
    lesseeForm.setFieldsValue({
      leaseCalculatorAttributes: {
        assetYear: '',
        assetModel: '',
      },
    })
    hideBikeSelectOptions()
  }

  const handleYearStateChange = () => {
    hideBikeSelectOptions()
  }

  const handleModelStateChange = () => {
    hideBikeSelectOptions()
  }

  const handleMileageRangeStateChange = (e:any, newValue:any) => {
    setMileageValue(newValue.label)
    hideBikeSelectOptions()
  }

  const formatOptions = (options: Object[], type?: string) => {
    let newOptions: Array<object> = []
    if (type === 'collection') {
      options.map((value: any) => {
        newOptions.push({ value: value[1], label: value[0] })
      })
    } else {
      options.map((value: any) => {
        newOptions.push({ value: value, label: value })
      })
    }
    return newOptions
  }

  const submitApplication = async (values: any) => {
    try {
      await network.PUT(`/api/v1/dealers/update-details?id=${leaseApplicationId}`, values)
      message.success('Save Successfully')
    } catch (e) {
      logger.error('Request Error', e)
      message.error('Error saving details')
    }
  }

  const [btnAttribute, setBtnAttribute] = useState(true)
  const [saveBtnAttribute, setSaveBtnAttribute] = useState(true)

  const handleSubmit = async (values: any) => {
    const myValues = {
      leaseCalculatorAttributes:{
        assetMake : makeValue,
        assetYear : yearValue,
        mileageTier : mileageValue,
        newUsed : assetState,
        vin: undefined
      }
    }
    //values = { ...values }
    submitApplication(myValues)
    setBtnAttribute(false)
    console.log("Values : ", myValues)
  }

  let today = new Date()
  let year = today.getFullYear()

  const assetOption = [
    { label: 'New', id: 1 },
    { label: 'Used', id: 2 }
  ]

  const makeOption = makesOptions.map(({ value, label }, index) => {
    return (
       {label}
    )
  })

  const yearOption = yearsOptions.map(({ value, label }, index) => {
    return (
       {label}
    )
  })

  const mileageOption = mileageRangeOptions.map(({ value, label }, index) => {
    return (
       {label}
    )
  })


  return (
    <Spin spinning={loading}>
      <ApplicationSteps stepType={`bike`} leaseApplicationId={`${leaseApplicationId}`} leaseCalculatorId={`${leaseCalculatorId}`} save={null} attribute={btnAttribute} />
      <Form
        onFinish={handleSubmit}
        form={lesseeForm}
        // {...layout}
        // // colon={false}
        // scrollToFirstError={true}
        // initialValues={{
        //   leaseCalculatorAttributes: {
        //     newUsed: data?.leaseCalculator?.newUsed,
        //     assetMake: data?.leaseCalculator?.assetMake,
        //     assetModel: data?.leaseCalculator?.assetModel,
        //     assetYear: data?.leaseCalculator?.assetYear,
        //     mileageTier: data?.leaseCalculator?.mileageTier,
        //   },
        // }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24} className="cca-center-text" style={{ marginTop: 20 }}>
            {/* <Title level={2}> Bike Information </Title> */}
            <Typography variant="h4" gutterBottom >
                Bike Information
            </Typography>
          </Col>  
        </Row>

        <Content className="content-1">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}></Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Card variant="outlined" sx={{ minWidth: 275, border:'2px solid orange', borderRadius: '5px' }}>
                <CardContent>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name={['leaseCalculatorAttributes', 'vin']}
                          validateStatus={validateVIN ? (validateVIN === 'error' ? 'error' : 'success') : undefined}
                          help={validateVIN && (validateVIN === 'error' ? 'VIN not found' : ' ')}
                        >
                          {/* <Input allowClear maxLength={17} onChange={(e) => handleVin(e)} style={{ marginBottom: 10 }} /> */}
                          <TextField
                            id="filled-input"
                            label="your vin number here"
                            variant="filled"
                            onChange={(e) => handleVin(e)}
                          />
<<<<<<< HEAD
=======

>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                          <Button type="link" block onClick={handleNoVin} style={{ textAlign: `left`, padding: `4px 0px` }}>
                            I don't know the VIN
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>

                    {showBikeForm && (
                      <div>
                        <Row>
                          <Col span={24}>
<<<<<<< HEAD
                          {/* <FormControl variant="standard">
=======
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                            <Form.Item
                              label="New/Used"
                              name={['leaseCalculatorAttributes', 'newUsed']}
                              rules={[
                                {
                                  required: rules,
                                  message: 'New/Used is required!',
                                },
                              ]}
                              hidden={showViaVIN}
<<<<<<< HEAD
                              className='new_used'
                            > */}
                              {/* <Select showSearch placeholder="New/Used" onSelect={handleNewUsedStateChange} onBlur={hideBikeSelectOptions}>
=======
                            >
                              <Select showSearch placeholder="New/Used" onSelect={handleNewUsedStateChange} onBlur={hideBikeSelectOptions}>
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                                <Option key="1" value="New">
                                  New
                                </Option>
                                <Option key="2" value="Used">
                                  Used
                                </Option>
<<<<<<< HEAD
                               </Select> */}
                              
                              {/* <Select>
                                <MenuItem value="new"><span className="select-option">New</span></MenuItem>
                                <MenuItem value="used"><span className="select-option">Used</span></MenuItem>
                              </Select>
                            </Form.Item>      
                          </FormControl> */}

                              <Stack spacing={2} width='250px'>
                                <Autocomplete 
                                   options={assetOption}
                                   renderInput={(params)=> {
                                     return <TextField 
                                              {...params} 
                                              label='New/Used'
                                             
                                            />
                                  }}
                                  value={assetState ? assetState : null}
                                  onChange={handleAssetState}
                                 />
                              </Stack>
                
=======
                              </Select>
                            </Form.Item>
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                            {showViaVIN && (
                              <Row style={{ marginTop: 10, marginBottom: 0 }}>
                                <Col span={24}>
                                  <b>New/Used</b> : {showViaVIN && <p>{year - vinYear < 3 ? 'New' : 'Used'}</p>}
                                </Col>
                              </Row>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
<<<<<<< HEAD
                          
                              {/* <Form.Item label="Make" name={['leaseCalculatorAttributes', 'assetMake']} rules={[{ required: true, message: 'Make is required!' }]} hidden={showViaVIN}> */}
                              {/* <Select showSearch placeholder="Make" {...showMakeState} onChange={handleMakes} onSelect={handleMakesStateChange} onBlur={hideBikeSelectOptions}>
=======
                            <Form.Item label="Make" name={['leaseCalculatorAttributes', 'assetMake']} rules={[{ required: true, message: 'Make is required!' }]} hidden={showViaVIN}>
                              <Select showSearch placeholder="Make" {...showMakeState} onChange={handleMakes} onSelect={handleMakesStateChange} onBlur={hideBikeSelectOptions}>
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                                {makesOptions &&
                                  makesOptions.map(({ value, label }, index) => {
                                    return (
                                      <Option key={index} value={`${value}`}>
                                        {label}
                                      </Option>
                                    )
                                  })}
<<<<<<< HEAD
                              </Select> */}
                              {/* </Form.Item> */}

                              <Stack spacing={2} width='250px'>
                                <Autocomplete 
                                   options={makeOption}
                                   renderInput={(params)=> {
                                     return <TextField 
                                              {...params} 
                                              label='Make'
                                             
                                            />
                                  }}
                                  value={makeValue ? makeValue : null}
                                  onChange={handleMakes}
                                 />
                              </Stack>
                           
                              {showViaVIN && (
=======
                              </Select>
                            </Form.Item>
                            {showViaVIN && (
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                              <Row style={{ marginTop: 10, marginBottom: 0 }}>
                                <Col span={24}>
                                  <b>Make</b> : {showViaVIN && <p>{vinMake}</p>}
                                </Col>
                              </Row>
                            )}
<<<<<<< HEAD
                        </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                          {/* <FormControl variant="standard" fullWidth>   */}
                            {/* <Form.Item label="Year" name={['leaseCalculatorAttributes', 'assetYear']} rules={[{ required: true, message: 'Year is required!' }]} hidden={showViaVIN}> */}
                              {/* <Select showSearch placeholder="Year" {...showYearState} onChange={handleYear} onSelect={handleYearStateChange} onBlur={hideBikeSelectOptions}>
=======
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item label="Year" name={['leaseCalculatorAttributes', 'assetYear']} rules={[{ required: true, message: 'Year is required!' }]} hidden={showViaVIN}>
                              <Select showSearch placeholder="Year" {...showYearState} onChange={handleYear} onSelect={handleYearStateChange} onBlur={hideBikeSelectOptions}>
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                                {yearsOptions &&
                                  yearsOptions.map(({ value, label }, index) => {
                                    return (
                                      <Option key={index} value={`${value}`}>
                                        {label}
                                      </Option>
                                    )
                                  })}
<<<<<<< HEAD
                              </Select> */}
                              
                                {/* <Select {...showYearState} onChange={handleYear}>
                                  {yearsOptions &&
                                    yearsOptions.map(({ value, label }, index) => {
                                     return (
                                      <MenuItem value={`${value}`}  key={index}>
                                        <span className="select-option">{label}</span>
                                      </MenuItem>
                                    )
                                  })}
                                </Select> */}
                              
                            {/* </Form.Item> */}
                          {/* </FormControl>       */}

                              <Stack spacing={2} width='250px'>
                                <Autocomplete 
                                   options={yearOption}
                                   renderInput={(params)=> {
                                     return <TextField 
                                              {...params} 
                                              label='Year'
                                             
                                            />
                                  }}
                                  autoSelect 
                                  value={yearValue ? yearValue : null}
                                  onChange={handleYear}
                                 />
                              </Stack>
=======
                              </Select>
                            </Form.Item>
                                
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                            {showViaVIN && (
                              <Row style={{ marginTop: 10, marginBottom: 0 }}>
                                <Col span={24}>
                                  <b>Year</b> : {showViaVIN && <p>{vinYear}</p>}
                                </Col>
                              </Row>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
<<<<<<< HEAD
                          {/* <FormControl variant="standard" fullWidth> */}
                            {/* <Form.Item label="Model" name={['leaseCalculatorAttributes', 'assetModel']} rules={[{ required: true, message: 'Model is required!' }]} hidden={showViaVIN}> */}
                              {/* <Select showSearch placeholder="Model" {...showModelState} onSelect={handleModelStateChange} onBlur={hideBikeSelectOptions}>
=======
                            <Form.Item label="Model" name={['leaseCalculatorAttributes', 'assetModel']} rules={[{ required: true, message: 'Model is required!' }]} hidden={showViaVIN}>
                              <Select showSearch placeholder="Model" {...showModelState} onSelect={handleModelStateChange} onBlur={hideBikeSelectOptions}>
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                                {modelsOptions &&
                                  modelsOptions.map(({ value, label }, index) => {
                                    return (
                                      <Option key={index} value={`${value}`}>
                                        {label}
                                      </Option>
                                    )
                                  })}
<<<<<<< HEAD
                              </Select> */}
                              
                                {/* <Select {...showModelState}  onSelect={handleModelStateChange} >
                                  {modelsOptions &&
                                  modelsOptions.map(({ value, label }, index) => {
                                    return (
                                      <MenuItem value={`${value}`}  key={index}>
                                        <span className="select-option">{label}</span>
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                               */}
                            {/* </Form.Item> */}
                          {/* </FormControl>       */}
=======
                              </Select>
                            </Form.Item>
                                
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                            {showViaVIN && (
                              <Row style={{ marginTop: 10, marginBottom: 10 }}>
                                <Col span={24}>
                                  <b>Model</b> : {showViaVIN && <p>{vinModel}</p>}
                                </Col>
                              </Row>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
<<<<<<< HEAD
                          {/* <FormControl variant="standard" fullWidth> */}
                            {/* <Form.Item
=======
                            <Form.Item
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                              label="Mileage Range"
                              name={['leaseCalculatorAttributes', 'mileageTier']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Mileage Range is required!',
                                },
                              ]}
<<<<<<< HEAD
                            > */}
                              {/* <Select showSearch placeholder="Mileage Range" {...showMileageRangeState} onSelect={handleMileageRangeStateChange} onBlur={hideBikeSelectOptions}>
=======
                            >
                              <Select showSearch placeholder="Mileage Range" {...showMileageRangeState} onSelect={handleMileageRangeStateChange} onBlur={hideBikeSelectOptions}>
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                                {mileageRangeOptions &&
                                  mileageRangeOptions.map(({ value, label }, index) => {
                                    return (
                                      <Option key={index} value={`${value}`}>
                                        {label}
                                      </Option>
                                    )
                                  })}
<<<<<<< HEAD
                              </Select> */}
                              
                                {/* <Select {...showMileageRangeState} onSelect={handleMileageRangeStateChange} >
                                  {mileageRangeOptions &&
                                    mileageRangeOptions.map(({ value, label }, index) => {
                                    return (
                                      <MenuItem value={`${value}`}  key={index}>
                                        <span className="select-option">{label}</span>
                                      </MenuItem>
                                    )
                                  })}
                                </Select> */}
                            {/* </Form.Item> */}
                          {/* </FormControl> */}
                              <Stack spacing={2} width='250px'>
                                <Autocomplete 
                                   options={mileageOption}
                                   renderInput={(params)=> {
                                     return <TextField 
                                              {...params} 
                                              label='Mileage Range'
                                             
                                            />
                                  }}
                                  autoSelect 
                                  value={mileageValue ? mileageValue : null}
                                  onChange={handleMileageRangeStateChange}
                                 />
                              </Stack>
=======
                              </Select>
                            </Form.Item>
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                          </Col>
                        </Row>
                      </div>
                    )}
                </CardContent>
              </Card>

              <div style={{ marginTop: 20, textAlign: `right` }}>
                <Button style={{ marginRight: 10 }} type="primary" htmlType="submit" disabled={saveBtnAttribute}>
<<<<<<< HEAD
                  {' '}
                  Save
=======
>>>>>>> 83e033e687bd1b7fbbf85f046f6e4947631fb547
                  {' '}
                </Button>
                <Button style={{ marginRight: 10 }} type="primary" disabled={btnAttribute}>
                  <Link to={`/applications/${leaseApplicationId}/applicant`}> Next </Link>
                </Button>
              </div>
            </Col>
          </Row>
        </Content>
      </Form>
    </Spin>
  )
}

export default BikeInformation