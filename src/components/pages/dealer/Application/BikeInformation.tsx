import React, { useState, MouseEvent, useEffect } from 'react'
import { Row, Col, Form, Layout, Input, message, Spin } from 'antd'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { Stack, Autocomplete, Grid, Button, styled, Box, Paper, Divider} from "@mui/material";
import { logger, network } from '../../../../utils';
import ApplicationSteps from './ApplicationSteps';

import '../styles/BikeInformation.css';


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
  const history = useHistory();

  const handleSubmit = async (values: any) => {
    const myValues = {
      leaseCalculatorAttributes: {
        assetMake:makeValue,
        assetYear: yearValue,
        mileageTier: mileageValue,
        newUsed: assetState,
        vin: undefined
      }
    }
    submitApplication(myValues)
    setBtnAttribute(false)
    let path=`/applications/${leaseApplicationId}/applicant`
    history.push(path);
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
        // form={lesseeForm}
        // {...layout}
        // // colon={false}
        onFinish={handleSubmit}
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

        <Box sx={{ flexGrow: 1 }}>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item xs={7}>
              <Paper
                sx={{
                  p: 2,
                  margin: 2,
                  marginBottom: 5,
                  padding: 8,
              }}
              >
                <Grid container direction="row" justifyContent="space-between" spacing={2} >
                <Grid item>
                  <Form.Item
                    name={['leaseCalculatorAttributes', 'vin']}
                    validateStatus={validateVIN ? (validateVIN === 'error' ? 'error' : 'success') : undefined}
                    help={validateVIN && (validateVIN === 'error' ? 'VIN not found' : ' ')}
                  >
                    {/* <Input allowClear maxLength={17} onChange={(e) => handleVin(e)} style={{ marginBottom: 10 }} /> */}
                    <TextField
                      id="filled-input"
                      sx={{input: {
                        color: "red",
                        background: "green"}}}
                      label="your vin number here"
                      variant="filled"
                      fullWidth
                      style={{marginTop:4}}
                      onChange={(e) => handleVin(e)}
                    />
                    <Button variant="text" onClick={handleNoVin} style={{marginRight:"65px"}} >
                      I don't know the VIN
                    </Button>
                  </Form.Item>
                </Grid>
                <Divider orientation="vertical" flexItem variant='middle' sx={{color:"#e82512"}}>
                  OR
                </Divider>
                <Grid item >
                  {showBikeForm && (
                    <Grid container direction="column">
                        <Grid item>
                            
                              <Autocomplete 
                                 sx={{ width: 400, marginTop: 2 }}
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
                                  
                          {showViaVIN && (
                            <Row style={{ marginTop: 10, marginBottom: 0 }}>
                              <Col span={24}>
                                <b>New/Used</b> : {showViaVIN && <p>{year - vinYear < 3 ? 'New' : 'Used'}</p>}
                              </Col>
                            </Row>
                          )}
                        </Grid>
                        <Grid item>
                              <Autocomplete 
                                sx={{ width: 400, marginTop: 2 }}
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
                                    
                            {showViaVIN && (
                            <Row style={{ marginTop: 10, marginBottom: 0 }}>
                              <Col span={24}>
                                <b>Make</b> : {showViaVIN && <p>{vinMake}</p>}
                              </Col>
                            </Row>
                          )}
                      </Grid>
                      <Grid item>
                              <Autocomplete 
                              sx={{ width: 400, marginTop: 2 }}
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
                          {showViaVIN && (
                            <Row style={{ marginTop: 10, marginBottom: 0 }}>
                              <Col span={24}>
                                <b>Year</b> : {showViaVIN && <p>{vinYear}</p>}
                              </Col>
                            </Row>
                          )}
                        </Grid>
                        <Grid item>
                          {showViaVIN && (
                            <Row style={{ marginTop: 10, marginBottom: 10 }}>
                              <Col span={24}>
                                <b>Model</b> : {showViaVIN && <p>{vinModel}</p>}
                              </Col>
                            </Row>
                          )}
                        </Grid>
                        <Grid item>
                              <Autocomplete 
                              sx={{ width: 400, marginTop: 2 }}
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
                        </Grid>
                    </Grid>
                  )}
                </Grid>
              
            
                <div style={{ marginTop: 50, width:"198%", textAlign: "right" }}>
                  <Button variant="contained" style={{backgroundColor: "#e93b1b"}} type="submit">
                      {/* <Link  style={{color: "white"}} to={`/applications/${leaseApplicationId}/co-applicant`}> Go to Applicant Page </Link> */}
                      Go to Applicant Page
                  </Button>
                </div>

                </Grid>
              </Paper>
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
      </Form>
</Spin>
  )
}

export default BikeInformation
