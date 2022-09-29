import React, { useState, useEffect } from 'react';
import { logger, network } from '../../../../utils';
import { useDebouncedCallback } from 'use-debounce';

import { Row, Col, Card, Button, Form, Input, Select, Typography, Layout, InputNumber, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApplicationSteps from './ApplicationSteps';
import CalculatorHead from '../../../layouts/CalculatorHead';

import '../styles/Calculator.css'


const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;

interface Lessee {
  ssn?: string | undefined
}

interface LeaseCalculator {
  id?: string | number | undefined
  usState?: number | undefined
  taxJurisdiction?: number | undefined
  newUsed?: number | undefined
  assetMake?: number | undefined
  assetYear?: number | undefined
  assetModel?: number | undefined
  mileageTier?: number | undefined
  creditTierId?: number | undefined
  term?: number | undefined
  dealerSalesPrice?: number | undefined
  dealerFreightAndSetup?: number | undefined
  titleLicenseAndLienFee?: number | undefined
  dealerDocumentationFee?: number | undefined
  guaranteedAutoProtectionCost?: number | undefined
  prepaidMaintenanceCost?: number | undefined
  extendedServiceContractCost?: number | undefined
  tireAndWheelContractCost?: number | undefined
  grossTradeInAllowance?: number | undefined
  tradeInPayoff?: number | undefined
  cashDownPayment?: number | undefined
}

interface RootLeaseCalculator {
  leaseCalculator?: LeaseCalculator
}

interface Props {
  data?: {
    id: string | number,
    lessee: Lessee,
    leaseCalculator?: LeaseCalculator
  }
}

interface CalculatorDataProps {
  nadaRental?: string,
  purchaseOption?: string,
  totalBikePrice?: string,
  upfrontTax?: string,
  netTradeInAllowance?: string,
  totalCapCostReduction?: string,
  netDueOnMtorcycle?: string,
  acquisitionFee?: string,
  totalCapCost?: string,
  totalGrossCapCost?: string,
  baseMonthlyPayment?: string,
  monthlySaleTax?: string,
  totalMonthlyPayment?: string,
  firstMonthlyPayment?: string,
  refundableSecurityDeposit?: string,
  additionalCashDown?: string,
  totalCashAtSignIn?: string,
  cashIn?: string,
  bikeMinimum?: string,
  totalDealerParticipation?: string,
  totalTransactionPrice?: string,
  minusTradeIn?: string,
  minusDownPayment?: string,
  minusFirstMonthlyPayment?: string,
  minuseSecurityDeposit?: string,
  cashOnDeliveryBike?: string,
  plusDealerParticipation?: string,
  remitToDealer?: string,
  frontEndMaxAdvance?: string,
  backEndMaxAdvance?: string,
}

interface ActiveStatesOption {
  label: string,
  value: string,
  tax_label: string
}

interface OptionProps {
  value?: string | number,
  label?: string,
  id?: number,
}

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
}

export const Calculator: React.FC<Props> = ({data}: Props) => {
  const [lesseeForm] = Form.useForm();

  let leaseApplicationId: string | number | undefined = data?.id
  let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.id

  const [calculatorData, setCalculatorData] = useState<CalculatorDataProps>({})

  const [activeStatesOptions, setActiveStatesOptions] = useState<Array<ActiveStatesOption>>([])
  const [taxJurisdictionLabel, setTaxJurisdictionLabel] = useState<string>("Customer County/Tax Jurisdiction")
  const [taxJurisdictionOptions, setTaxJurisdictionOptions] = useState<string[]>([])

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

  const debouncedHandleOnFieldsChange = useDebouncedCallback(
    (changedValues: any, allValues: any) => {
      handleOnValuesChange(changedValues, allValues);
    },
    1000
  )

  const handleMakes = (value: any) => {
    getYears(value)
  }

  const handleYear = (value: any) => {
    let year = value
    let make = lesseeForm.getFieldValue(['leaseCalculatorAttributes', 'assetMake'])
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
      }
    })
    hideBikeSelectOptions()
    setTimeout(() => {
      setShowYearState({ "open": true })
    }, 500)
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

  const handleCreditTierStateChange = () => {
    hideBikeSelectOptions()
  }

  const getMakes = async ( ) => {
    try {
      let result = await network.GET('/api/v1/bike-information/makes-name-options');
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
      setModelsOptions(formatOptions((result.data.models || []), 'collection'))
    } catch (e) {
      logger.error("Request Error", e);
    }
  }

  const formatOptions = (options: Object[], type?: string) => {
    let newOptions: Array<object> = [];
    if (type === 'collection') {
      options.map((value: any) => { newOptions.push({ value: value[1], label: value[0] }) })
    } else {
      options.map((value: any) => { newOptions.push({ value: value, label: value})})
    }
    return newOptions
  }

  const handleDealershipStateChange =  (value: any, option: any) => {
    getTaxJurisdiction(value)
    setTaxJurisdictionLabel(option.taxLabel)
    getMakes()
  }

  const getTaxJurisdiction = async (usState: string) => {
    try {
      await network.GET(`/api/v1/calculators/tax-jurisdiction-select-option?us_state=${usState}`).then(response => {
        setTaxJurisdictionOptions(response.data.tax_jurisdiction_select_option)
      }).catch(error => {
        logger.error("getTaxJurisdiction.Request Error", error);
      });
    } catch (e) {
      logger.error("Request Error", e);
    }
  }

  const generateRandomNDigits = (n: number) => {
    let num: any = new Intl.NumberFormat().format( Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n)) )
    return `$${num}`
  }

  const setDealershipState = async () => {
    try {
      await network.GET('/api/v1/calculators/active-state-select-option').then(response => {
        setActiveStatesOptions(response.data.active_state_select_option)
      }).catch(error => {
        logger.error("setDealershipState.Request Error", error);
      });
    } catch (e) {
      logger.error("setDealershipState Error", e);
    }
  }

  const setCalculatorFromResult = (responseObj: any) => {
    let calculations: any = responseObj.data.calculations
    let calData: Object = {
      nadaRental: calculations.nada_retail_value,
      purchaseOption: calculations.customer_purchase_option, // NEEDS TRACING
      upfrontTax: calculations.upfront_tax,
      totalBikePrice: calculations.total_sales_price, // NEEDS TRACING
      netTradeInAllowance: calculations.net_trade_in_allowance,
      totalCapCostReduction: 0, // NO EXACT MATCH
      netDueOnMtorcycle: 0, // NO EXACT MATCH
      acquisitionFee: calculations.acquisition_fee,
      totalCapCost: calculations.adjusted_capitalized_cost, // NEEDS TRACING
      totalGrossCapCost: calculations.gross_capitalized_cost, // NEEDS TRACING
      baseMonthlyPayment: calculations.base_monthly_payment,
      monthlySaleTax: calculations.monthly_sales_tax,
      totalMonthlyPayment: calculations.total_monthly_payment,
      firstMonthlyPayment: calculations.base_monthly_payment, // NEEDS TRACING
      refundableSecurityDeposit: calculations.refundable_security_deposit,
      additionalCashDown: 0, // NEEDS TRACING
      totalCashAtSignIn: calculations.total_cash_at_signing,
      cashIn: 0, // NO EXACT MATCH
      bikeMinimum: 0, // NO EXACT MATCH
      totalDealerParticipation: 0, // NO EXACT MATCH
      totalTransactionPrice: 0, // NO EXACT MATCH
      minusTradeIn: 0, // NO EXACT MATCH
      minusDownPayment: 0, // NO EXACT MATCH
      minusFirstMonthlyPayment: 0, // NO EXACT MATCH
      minuseSecurityDeposit: 0, // NO EXACT MATCH
      cashOnDeliveryBike: 0, // NO EXACT MATCH
      plusDealerParticipation: 0, // NO EXACT MATCH
      remitToDealer: calculations.remit_to_dealer,
      frontEndMaxAdvance: calculations.frontend_max_advance,
      backEndMaxAdvance: calculations.backend_max_advance,
    }
    setCalculatorData(calData)
  }

  const randomRange = () => {
    var myArray = [2,3,5];
    return myArray[(Math.random() * myArray.length) | 0]
  }

  const submitCalculator = async (values: any) => {
    try {
      await network.POST('/api/v1/calculators', values).then(response => {
        setCalculatorFromResult(response)
      }).catch(error => {
      })
    } catch (e) {
      logger.error("Request Error", e);
    }
  }

  const handleSubmit = async (values: any) => {
    values = { ...values };
    submitCalculator(values)
  }

  const handleOnValuesChange = async (changedValues: any, allValues: any) => {
    let values: any = {}

    allValues.map((data: any) => {
      values[`${data.name[1]}`] = data.value
    })

    submitCalculator({ lease_calculator: values })
  }

  const dealerFundingBreakdownInfo = () => {
    Modal.info({
      title: '',
      content: (
        <>
          <Paragraph>
            Please remember that you keep the cash collected from the customer, you don’t have to forward that to us.
          </Paragraph>
          <Paragraph>
            Please add the customer’s Total Cash Due at Signing to your Funding amount to determine your total proceeds.
          </Paragraph>
          <Paragraph>
            Also, remember to include an trades/pay-offs included in the deal.
          </Paragraph>
          <Paragraph>
            Thanks, call if questions.
          </Paragraph>
        </>
      ),
      onOk() {},
    })
  }

  useEffect(() => {
    setDealershipState()
  },[]);

  return (
    <>
      {/* <ApplicationSteps
        stepType={'calculator'}
        leaseApplicationId={`${leaseApplicationId}`}
        leaseCalculatorId={`${leaseCalculatorId}`}
        save={null}
      /> */}
      <CalculatorHead />
      <div style={{ margin: '10px 50px' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2}> Calculator </Title>
          <p> Add your bike's purchase price and options to  calculate your payments. </p>
        </div>

        <Form
          form={lesseeForm}
          // colon={false}
          // onFinish={handleSubmit}
          onFieldsChange={(changedValues, allValues) => debouncedHandleOnFieldsChange(changedValues, allValues)}
          // scrollToFirstError={true}
          initialValues={{
            leaseCalculatorAttributes: {
              id: data?.leaseCalculator?.id,
              usState: data?.leaseCalculator?.usState,
              taxJurisdiction: data?.leaseCalculator?.taxJurisdiction,
              newUsed: data?.leaseCalculator?.newUsed,
              assetMake: data?.leaseCalculator?.assetMake,
              assetYear: data?.leaseCalculator?.assetYear,
              assetModel: data?.leaseCalculator?.assetModel,
              mileageTier: data?.leaseCalculator?.mileageTier,
              creditTierId: data?.leaseCalculator?.creditTierId,
              term: data?.leaseCalculator?.term,
              dealerSalesPrice: data?.leaseCalculator?.dealerSalesPrice,
              dealerFreightAndSetup: data?.leaseCalculator?.dealerFreightAndSetup,
              titleLicenseAndLienFee: data?.leaseCalculator?.titleLicenseAndLienFee,
              dealerDocumentationFee: data?.leaseCalculator?.dealerDocumentationFee,
              guaranteedAutoProtectionCost: data?.leaseCalculator?.guaranteedAutoProtectionCost,
              prepaidMaintenanceCost: data?.leaseCalculator?.prepaidMaintenanceCost,
              extendedServiceContractCost: data?.leaseCalculator?.extendedServiceContractCost,
              tireAndWheelContractCost: data?.leaseCalculator?.tireAndWheelContractCost,
              grossTradeInAllowance: data?.leaseCalculator?.grossTradeInAllowance,
              tradeInPayoff: data?.leaseCalculator?.tradeInPayoff,
              cashDownPayment: data?.leaseCalculator?.cashDownPayment,
            }
          }}
          {...layout}
        >
          {
            data?.leaseCalculator?.id &&
              <Form.Item
                style={{display: 'none'}}
                name={['leaseCalculatorAttributes', 'id']}
              >
                <Input />
              </Form.Item>
          }
          <Content className="content-1">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                <Card title="Customer and Bike Information">
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Customer State"
                        name={['leaseCalculatorAttributes', 'usState']}
                        hasFeedback
                        rules={[{ required: true, message: 'Customer State is required' }]}
                      >
                        <Select
                          showSearch
                          onChange={handleDealershipStateChange}
                        >
                          {
                            activeStatesOptions && activeStatesOptions.map(({value, label, tax_label}, index) => {
                              return <Option key={index} value={`${value}`} taxLabel={`${tax_label}`}>{label}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label={`${taxJurisdictionLabel}`}
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'taxJurisdiction']}
                        rules={[{ required: true, message: `${taxJurisdictionLabel} is required` }]}
                      >
                        <Select
                          showSearch
                        >
                          {
                            taxJurisdictionOptions && taxJurisdictionOptions.map((value, index) => {
                              return <Option key={index} value={`${value}`}>{value}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
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
                          onChange={handleMakes}
                          onSelect={handleMakesStateChange}
                          onBlur={hideBikeSelectOptions}
                          {...showMakeState}
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
                          <Row style={{ marginTop: 10, marginBottom: 0 }}>
                            <Col span={24}>
                              Make
                            </Col>
                            <Col span={24}>
                              { showViaVIN && <Text>{vinMake}</Text> }
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
                          onChange={handleYear}
                          onSelect={handleYearStateChange}
                          onBlur={hideBikeSelectOptions}
                          {...showYearState}
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
                              { showViaVIN && <Text>{vinYear}</Text> }
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
                          onSelect={handleModelStateChange}
                          onBlur={hideBikeSelectOptions}
                          {...showModelState}
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
                              { showViaVIN && <Text>{vinModel}</Text> }
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
                          onSelect={handleMileageRangeStateChange}
                          onBlur={hideBikeSelectOptions}
                          {...showMileageRangeState}
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
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Credit Tier"
                        name={['leaseCalculatorAttributes', 'creditTierId']}
                        rules={[{ required: true, message: 'Credit Tier is required!' }]}
                      >
                        <Select
                          showSearch
                          placeholder="Credit Tier"
                          onSelect={handleCreditTierStateChange}
                          onBlur={hideBikeSelectOptions}
                          {...showCreditTierState}
                        >
                          {
                            creditTierOptions && creditTierOptions.map(({value, label, id}, index) => {
                              return <Option key={index} value={id}>{label}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        hasFeedback
                        label="Lessee Term"
                        name={['leaseCalculatorAttributes', 'term']}
                        rules={[{ required: true, message: ' is required' }]}
                      >
                        <Select showSearch>
                          <Option value="24">24 Months</Option>
                          <Option value="36">36 Months</Option>
                          <Option value="48">48 Months</Option>
                          <Option value="60">60 Months</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1 top-spacer-1'}>
                    <Col span={12}>
                      NADA Retail Value
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.nadaRental}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-2'}>
                    <Col span={12}>
                      Purchase Option (Residual)
                    </Col>
                    <Col span={12} style={{ textAlign: 'right', fontWeight: 700 }}>
                      <span>{calculatorData.purchaseOption}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={24}>
                      <Title level={4}> Total Sale Price Calculation </Title>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Bike Price
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        name={['leaseCalculatorAttributes', 'dealerSalesPrice']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Dealer Freight and Setup Cost
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'dealerFreightAndSetup']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Total Bike Price
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.totalBikePrice}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Up-Front Sale or Use Tax
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.upfrontTax}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Title, License, and Lien Fee
                    </Col>
                      <Col span={8} style={{ textAlign: 'right' }}>
                        <Form.Item
                          hasFeedback
                          name={['leaseCalculatorAttributes', 'titleLicenseAndLienFee']}
                        >
                          <InputNumber
                            formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                            precision={2}
                            style={{ textAlign: 'right' }}
                          />
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Dealer Documentation Fee
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'dealerDocumentationFee']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      GAP
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'guaranteedAutoProtectionCost']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Pre-Paid Maintenance
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'prepaidMaintenanceCost']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Service Contract
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'extendedServiceContractCost']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Tire and Wheel
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'tireAndWheelContractCost']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={16}>
                      GPS
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'gpsCost']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Total Sales Price
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.upfrontTax}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}></Col>
                    <Col span={12} style={{ textAlign: 'right', fontWeight: 700 }}>
                      <span>Subject to Credit Approval </span>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                <Card title="Cap Cost Reduction (Customer Down Payment)">
                  <Row>
                    <Col span={16}>
                      Gross Trade Allowance
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'grossTradeInAllowance']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={16}>
                      Trade-in Payoff
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'tradeInPayoff']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Net Trade-In Allowance
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.netTradeInAllowance}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Cash
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item
                        hasFeedback
                        name={['leaseCalculatorAttributes', 'cashDownPayment']}
                      >
                        <InputNumber
                          formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value: any | undefined) => value.replace(/\$\s?|(,*)/g, '')}
                          precision={2}
                          style={{ textAlign: 'right' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Total Cap Cost Reduction
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.totalCapCostReduction}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Net Due on Motorcycle
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.netDueOnMtorcycle}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={16}>
                      Acquisition Fee
                    </Col>
                    <Col span={8} style={{ textAlign: 'right', borderBottom: '2px solid grey' }}>
                      <span>{calculatorData.acquisitionFee}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Total Cap Cost
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.totalCapCost}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Total Gross Cap Cost
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.totalGrossCapCost}</span>
                    </Col>
                  </Row>
                  <div style={{ padding: 20, backgroundColor: '#F5F6F8' }}>
                    <Title level={4}> Customer Monthly Payment </Title>
                    <Row className={'bot-spacer-1'}>
                      <Col span={12}>
                        Base Monthly Payment
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <span>{calculatorData.baseMonthlyPayment}</span>
                      </Col>
                    </Row>
                    <Row className={'bot-spacer-1'}>
                      <Col span={12}>
                        Monthly Sales Tax
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <span>{calculatorData.monthlySaleTax}</span>
                      </Col>
                    </Row>
                    <Row style={{ color: '#1890ff' }}>
                      <Col span={12}>
                        Total Monthly Payment
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <span>{calculatorData.totalMonthlyPayment}</span>
                      </Col>
                    </Row>
                    <Title level={4}> Cash Paid at Signing </Title>
                    <Row className={'bot-spacer-1'}>
                      <Col span={12}>
                        First Monthly Payment
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <span>{calculatorData.firstMonthlyPayment}</span>
                      </Col>
                    </Row>
                    <Row className={'bot-spacer-1'}>
                      <Col span={12}>
                        Refundable Security Deposit
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <span>{calculatorData.refundableSecurityDeposit}</span>
                      </Col>
                    </Row>
                    <Row className={'bot-spacer-1'}>
                      <Col span={12}>
                        Additional Cash Down
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <span>{calculatorData.additionalCashDown}</span>
                      </Col>
                    </Row>
                    <Row style={{ color: '#1890ff' }}>
                      <Col span={12}>
                        Total Cash at Signing
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <span>{calculatorData.totalCashAtSignIn}</span>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                <Card title="Cash Out of Pocket Helper">
                  <Row>
                    <Col span={16}>
                      Put This Amount in Cash
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item hasFeedback>
                        <Input style={{ textAlign: 'right' }} ></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={16}>
                      First Monthly Payment
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.firstMonthlyPayment}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={16}>
                      Refundable Security Deposit
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.refundableSecurityDeposit}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={16} style={{ fontWeight: 700 }}>
                      Total Due at Signing
                    </Col>
                    <Col span={8} style={{ textAlign: 'right', fontWeight: 700 }}>
                      <span>{calculatorData.cashIn}</span>
                    </Col>
                  </Row>
                  <Title level={4}> Dealer Participation (Reserve) </Title>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Bike Minimum
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.bikeMinimum}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16}>
                      Dealer Participation Markup
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Form.Item hasFeedback>
                        <Select style={{ textAlign: 'right' }} ></Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      Total Dealer Participation
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.totalDealerParticipation}</span>
                    </Col>
                  </Row>
                  <Title level={4}> Dealer Funding Breakdown <InfoCircleOutlined onClick={dealerFundingBreakdownInfo} style={{ fontSize: '0.75em' }} /> </Title>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Total Transaction Price
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.totalTransactionPrice}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Minus Trade-in
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.minusTradeIn}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Minus Down Payment
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.minusDownPayment}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Minus Down Security Deposit
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.minuseSecurityDeposit}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Minus First Monthly Payment
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.minusFirstMonthlyPayment}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Minus Security Deposit
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.minuseSecurityDeposit}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Cash on Delivery on Bike
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.cashOnDeliveryBike}</span>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Plus Dealer Participation
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.plusDealerParticipation}</span>
                    </Col>
                  </Row>
                  <Row style={{ color: '#1890ff' }}>
                    <Col span={12}>
                      Remit to Dealer
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.remitToDealer}</span>
                    </Col>
                  </Row>
                  <Title level={4}> Maximum Advances </Title>
                  <Row className={'bot-spacer-1'}>
                    <Col span={12}>
                      Front-End Max Advance
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.frontEndMaxAdvance}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      Back-End Max Advance
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span>{calculatorData.backEndMaxAdvance}</span>
                    </Col>
                  </Row>
                  <Title level={4}> Current Stipulations </Title>
                  <Row className={'bot-spacer-1'}>
                    <Col span={24}>
                      <a href="#">
                        May be subject to payment limit (send POL and we'll determine the exact limit if any)
                      </a>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={24}>
                      <a href="#">
                        Subject to Pre-Funding verification call(s)
                      </a>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={24}>
                      <a href="#">
                        Proof of Residence (Matching Application & Within 30 Days)
                      </a>
                    </Col>
                  </Row>
                  <Row className={'bot-spacer-1'}>
                    <Col span={24}>
                      You may email documents satisfying these stipulations to:
                      <a href="#">
                        2012070002@lease.speedleasing.com
                      </a>
                    </Col>
                  </Row>
                </Card>
                <div style={{ marginTop: 20, textAlign: 'right' }}>
                  <Button style={{ marginRight: 10 }}>Save</Button>
                  {/* <Button style={{ marginRight: 10 }} type="primary">
                    <Link to={`/applications/${leaseApplicationId}/calculators/${leaseCalculatorId}/bike`}> prev </Link>
                  </Button> */}
                  <Button style={{ marginRight: 10 }} type="primary">
                    <Link to={`/applications/${leaseApplicationId}/applicant`}> Next </Link>
                  </Button>
                </div>
              </Col>
            </Row>
          </Content>
        </Form>
      </div>
    </>
  )
}

export default Calculator
