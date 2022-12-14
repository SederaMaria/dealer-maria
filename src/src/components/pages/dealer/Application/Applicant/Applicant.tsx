import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Form, Input, Radio, InputNumber, Select, Typography, Layout, message, Checkbox, DatePicker, Space, Collapse, notification } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { logger, network } from '../../../../../utils'
import MaskedInput from 'antd-mask-input'
import ApplicationSteps from '../ApplicationSteps'
import SsnInput from './SsnInput'
import DobInput from './DobInput'
import { AutoCompleteAddress } from './AutoCompleteAddress'
import '../../styles/Applicant.css'
import { start } from 'repl'

const { Option } = Select
const { RangePicker } = DatePicker
const { Title } = Typography
const { Content } = Layout
const { Panel } = Collapse
const dateFormat = 'MM/DD/YYYY'
const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
}

const formLayouts = {
  horizontal: {
    container: {
      placeholderCol: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
      formCol: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
    },
    field: {
      col: { xs: 24, sm: 24, md: 8, lg: 9, xl: 8 },
      colgroup: {
        2: { xs: 24, sm: 24, md: 16, lg: 10, xl: 8 },
      },
      colmem: {
        2: { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 },
      },
    },
  },
  vertical: {
    container: {
      placeholderCol: { xs: 24, sm: 24, md: 24, lg: 24, xl: 4 },
      formCol: { xs: 24, sm: 24, md: 24, lg: 12, xl: 8 },
    },
    field: {
      col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
      colgroup: {
        2: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
      },
      colmem: {
        2: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 },
      },
    },
  },
}

const formLayout = formLayouts.horizontal

export interface Address {
  id?: number | undefined
  state?: string | undefined
  street1?: string | undefined
  street2?: string | undefined
  zipcode?: string | undefined
  county?: string | undefined
  cityId?: string | undefined
  cityOptions?: OptionData | any
  countyOptions?: OptionData | any
  stateOptions?: OptionData | any
}

export interface employmentAddress {
  id?: number | undefined
  city?: string | undefined
  state?: string | undefined
}

export interface Lessee {
  firstName?: string | undefined
  middleName?: string | undefined
  lastName?: string | undefined
  dateOfBirth?: string | undefined
  ssn?: string | undefined
  driversLicenseIdNumber?: string | undefined
  homePhoneNumber?: string | undefined
  mobilePhoneNumber?: string | undefined
  homeAddress?: Address
  mailingAddress?: Address
  atAddressMonths?: number | string | undefined
  atAddressYears?: number | string | undefined
  monthYears?: number | string | undefined
  monthlyMortgage?: number | string | undefined
  homeOwnership?: number | undefined
  employerName?: string | undefined
  employerPhoneNumber?: string | undefined
  employmentAddress?: employmentAddress
  employmentStatus?: string | undefined
  jobTitle?: string | undefined
  timeAtEmployerYears?: number | string | undefined
  timeAtEmployerMonths?: number | string | undefined
  grossMonthlyIncome?: number | string | undefined
  motorcycleLicence?: boolean | undefined
  firstTimeRider?: boolean | undefined
}

interface LeaseCalculator {
  id?: string | number | undefined
}

interface Props {
  data?: {
    id: string | number
    lessee: Lessee
    leaseCalculator: LeaseCalculator
  }
}

interface OptionData {
  value?: string | number
  label?: string
  parentId?: number
}

const formatOptions = (params: { options: Array<any>; type?: string }) => {
  switch (params.type) {
    case 'city': {
      return params.options.map((value: any) => {
        return {
          value: value['id'],
          label: value['name'],
          parentId: value['countyId'],
        }
      })
    }
    default: {
      return params.options.map((value: any) => {
        return {
          value: value['id'],
          label: value['abbreviation'] ? value['abbreviation'] : value['name'],
        }
      })
    }
  }
}

export const Applicant: React.FC<Props> = ({ data }: Props) => {

  const { lessee } = data || {}

  const [lesseeForm] = Form.useForm()

  let leaseApplicationId: string | number | undefined = data?.id
  let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.id

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

  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)

  const [homeAddress, setHomeAddress] = useState({
    street1: '',
    street2: '',
    zipcode: '',
  })

  const [type, setType] = useState('month')

  const [stateTarget, setStateTarget] = useState('')
  const [countyTarget, setCountytarget] = useState('')
  const [cityTarget, setCityTarget] = useState('')

  const [mailingAddress, setMailingAddress] = useState<any>({
    street1: '',
    street2: '',
    zipcode: '',
    state: '',
    county: '',
    city: '',
  })

  const [monthYears, setMonthYear] = useState<any | undefined>(undefined)
  const [manualMonthYears, setManualMonthYear] = useState<any | undefined>(undefined)
  const [nullMonthYear, setNullMonthYear] = useState(true)

  const [btnAttribute, setBtnAttribute] = useState(true)
  const [btnClass, setBtnClass] = useState('button')

  const openNotification = () => {
    const args = {
      message: 'Your attention please!',
      description:
        'The system doesn\'t have the zip code for this address, please add it manually',
      duration: 0,
    };
    notification.open(args);
  };

  const validStateArr = ["AL", "AZ", "CA", "DE", "FL", "GA", "IL", "IN", "LA", "MD",
      "MI", "MS", "MO", "NV", "NJ", "NM", "NC", "OH", "OK", "PA", "SC", "TN", "TX", "VA" ]  
      
  let isStateValid; 

  

  const submitApplication = async (values: any) => {
    try {
      await network.PUT(`/api/v1/dealers/update-details?id=${leaseApplicationId}`, values)
      setHasSubmitError(false)
      setDisableSubmitBtn(true)
      setSubmitSuccess(true)
      setBtnAttribute(false)
      setBtnClass('button')
      message.success('Save Successfully')
    } catch (e) {
      logger.error('Request Error', e)
      message.error('Error saving details')
      setHasSubmitError(true)
      setDisableSubmitBtn(false)
    }
    setDisableSubmitBtn(false)
  }

  const handleSubmit = async (values: any) => {
    values = { ...values }
    setDisableSubmitBtn(true)
    submitApplication(values)
  }

  const handleLesseeHomeZipcodeBlur = async () => {
    let zipcode = lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        lesseeAttributes: {
          homeAddressAttributes: {
            state: null,
            county: null,
            cityId: null,
          },
        },
      })

      await network
        .GET(`/api/v1/address/city-details?zipcode=${zipcode}`)
        .then((response) => {
          isStateValid = validStateArr.includes(response.data.state[0]?.abbreviation);
          if (response.data.is_state_active_on_calculator) {
            setLesseeHomeStateOptions(
              formatOptions({
                options: response.data.state || [],
                type: 'state',
              })
            )
            setLesseeHomeCountyOptions(
              formatOptions({
                options: response.data.county || [],
                type: 'county',
              })
            )
            setLesseeHomeCityOptionsData(formatOptions({ options: response.data.city || [], type: 'city' }))
          }
          if (!isStateValid || !response.data.is_state_active_on_calculator || response.data.city.length < 1 || response.data.city === undefined) {
            setZipHomeValidateStatus('error')
            setZipHomeErrorMessage('Speed Leasing currently does not lease to residents of this state.')
            setShowHomeState(null)
            
            setLesseeHomeStateOptions(
              formatOptions({
                options: [],
                type: 'state',
              })
            )
            setLesseeHomeCountyOptions(
              formatOptions({
                options: [],
                type: 'county',
              })
            )
            setLesseeHomeCityOptionsData(formatOptions({ options: [], type: 'city' }))
          } else {
            setZipHomeValidateStatus(undefined)
            setZipHomeErrorMessage(undefined)
          }
        })
        .catch((error) => {
          logger.error('handleLesseeHomeZipcodeBlur.Request Error', error)
        })
    } catch (e) {
      logger.error('handleLesseeHomeZipcodeBlur Error', e)
    }
  }

  const handleLesseeMailZipcodeBlur = async () => {
    let zipcode = lesseeForm.getFieldValue(['lesseeAttributes', 'mailingAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        lesseeAttributes: {
          mailingAddressAttributes: {
            state: null,
            county: null,
            cityId: null,
          },
        },
      })

      await network
        .GET(`/api/v1/address/city-details?zipcode=${zipcode}`)
        .then((response) => {
          isStateValid = validStateArr.includes(response.data.state[0]?.abbreviation);
          if (response.data.is_state_active_on_calculator) {
            setLesseeMailStateOptions(
              formatOptions({
                options: response.data.state || [],
                type: 'state',
              })
            )
            setLesseeMailCountyOptions(
              formatOptions({
                options: response.data.county || [],
                type: 'county',
              })
            )
            setLesseeMailCityOptionsData(formatOptions({ options: response.data.city || [], type: 'city' }))
          }
          if (!isStateValid || !response.data.is_state_active_on_calculator || response.data.city.length < 1 || response.data.city === undefined) {
            setZipMailValidateStatus('error')
            setZipMailErrorMessage('Speed Leasing currently does not lease to residents of this state.')
            setShowMailingState(null)

           setLesseeMailStateOptions(
              formatOptions({
                options: [],
                type: 'state',
              })
            )
            setLesseeMailCountyOptions(
              formatOptions({
                options: [],
                type: 'county',
              })
            )
            setLesseeMailCityOptionsData(formatOptions({ options: [], type: 'city' }))
          } else {
            setZipMailValidateStatus(undefined)
            setZipMailErrorMessage(undefined)
          }
        })
        .catch((error) => {
          logger.error('handleLesseeMailZipcodeBlur.Request Error', error)
        })
    } catch (e) {
      logger.error('handleLesseeMailZipcodeBlur Error', e)
    }
  }

  const handleHomeStateChange = () => {
    setShowHomeState(null)
  }

  const handleHomeCountyStateChange = (countyStateId: any) => {
    if (countyStateId) {
      lesseeForm.setFieldsValue({
        lesseeAttributes: { homeAddressAttributes: { cityId: null } },
      })
      setLesseeHomeCityOptions(lesseeHomeCityOptionsData.filter((obj: OptionData) => obj.parentId === parseInt(countyStateId)))
    }

    setShowHomeCountyState(null)
  }

  const handleHomeCityStateChange = () => {
    setShowHomeCityState(null)
  }

  const handleMailingStateChange = () => {
    setShowMailingState(null)
  }

  const handleMailingCountyStateChange = (countyStateId: any) => {
    if (countyStateId) {
      lesseeForm.setFieldsValue({
        lesseeAttributes: { mailingAddressAttributes: { cityId: null } },
      })
      setLesseeMailCityOptions(lesseeMailCityOptionsData.filter((obj: OptionData) => obj.parentId === parseInt(countyStateId)))
    }

    setShowMailingCountyState(null)
  }

  const handleMailingCityStateChange = () => {
    setShowMailingCityState(null)
  }

  const autoCompleteLesseeHomeBeforePlacesGetDetails = (value: any, option: any) => {   
    lesseeForm.setFieldsValue({
      lesseeAttributes: {
        homeAddressAttributes: {
          street1: option.data.structured_formatting.main_text,
        },
      },
    })
  }

  const autoCompleteLesseeHomeOnPlacesGetDetailsResult = (placeResult: any, placeServiceStatus: any) => {
    
    let addressLength = placeResult.address_components.length-1
    let addressToTest = placeResult.address_components[addressLength]

    if (placeServiceStatus == 'OK') {
      placeResult.address_components.map((component: any) => {
        if (component.types.includes('postal_code')){
          lesseeForm.setFieldsValue({
            lesseeAttributes: {
              homeAddressAttributes: { zipcode: component.long_name },
            },
          })
          autoCompleteLesseeHomeZipcodeStateCountyCity(placeResult.address_components)
        }
      })
      
      if (!addressToTest.types.includes('postal_code')){
        openNotification();   
      }
      
    }
  }

  const autoCompleteLesseeHomeZipcodeStateCountyCity = async (addressComponents: any) => {
    
    let zipcode = lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        lesseeAttributes: {
          homeAddressAttributes: {
            state: null,
            county: null,
            cityId: null,
          },
        },
      })

      await network
        .GET(`/api/v1/address/city-details?zipcode=${zipcode}`)
        .then((response) => {
          if (response.data.is_state_active_on_calculator) {
            setLesseeHomeStateOptions(
              formatOptions({
                options: response.data.state || [],
                type: 'state',
              })
            )
            let countyParishOptions: any = formatOptions({
              options: response.data.county || [],
              type: 'county',
            })
            setLesseeHomeCountyOptions(countyParishOptions)
            let cityOptions: any = formatOptions({
              options: response.data.city || [],
              type: 'city',
            })
            setLesseeHomeCityOptionsData(cityOptions)

            setShowHomeState(null)
            setShowHomeCountyState(null)
            setShowHomeCityState(null)

            // Try to autocomplete state
            addressComponents.map((component: any) => {
              if (component.types.includes('administrative_area_level_1')) {
                lesseeForm.setFieldsValue({
                  lesseeAttributes: {
                    homeAddressAttributes: { state: component.short_name },
                  },
                })
              }
            })

            // Try to autocomplete county
            addressComponents.map((component: any) => {
              if (component.types.includes('administrative_area_level_2')) {
                let countyName: string = component.short_name.toLowerCase().replace(' county', '').toUpperCase()
                lesseeForm.setFieldsValue({
                  lesseeAttributes: {
                    homeAddressAttributes: { county: countyName },
                  },
                })

                // Find state id from countyParishOptions using countyName
                countyParishOptions.map((option: any) => {
                  if (option.label == countyName) {
                    setLesseeHomeCityOptions(cityOptions.filter((obj: OptionData) => obj.parentId === parseInt(option.value)))
                  }
                })
              }
            })

            // Try to autocomplete city
            addressComponents.map((component: any) => {
              if (component.types.includes('locality')) {
                cityOptions.map((option: any) => {
                  if (option.label == component.long_name.toUpperCase()) {
                    lesseeForm.setFieldsValue({
                      lesseeAttributes: {
                        homeAddressAttributes: { cityId: option.label },
                      },
                    })
                  }
                })
              }
            })
          }
          if (!response.data.is_state_active_on_calculator || response.data.city.length < 1 || response.data.city === undefined) {
            setZipHomeValidateStatus('error')
            setZipHomeErrorMessage('Speed Leasing currently does not lease to residents of this state.')
            setShowHomeState(null)
          } else {
            setZipHomeValidateStatus(undefined)
            setZipHomeErrorMessage(undefined)
          }
        })
        .catch((error) => {
          logger.error('autoCompleteLesseeHomeZipcodeStateCountyCity.Request Error', error)
        })
    } catch (e) {
      logger.error('autoCompleteLesseeHomeZipcodeStateCountyCity Error', e)
    }
  }

  const autoCompleteLesseeMailingBeforePlacesGetDetails = (value: any, option: any) => {
    lesseeForm.setFieldsValue({
      lesseeAttributes: {
        mailingAddressAttributes: {
          street1: option.data.structured_formatting.main_text,
        },
      },
    })
  }

  const autoCompleteLesseeMailingOnPlacesGetDetailsResult = (placeResult: any, placeServiceStatus: any) => {

    let addressLength = placeResult.address_components.length-1
    let addressToTest = placeResult.address_components[addressLength]

    if (placeServiceStatus == 'OK') {
      placeResult.address_components.map((component: any) => {
        if (component.types.includes('postal_code')) {
          lesseeForm.setFieldsValue({
            lesseeAttributes: {
              mailingAddressAttributes: { zipcode: component.long_name },
            },
          })
          autoCompleteLesseeMailingZipcodeStateCountyCity(placeResult.address_components)
        }
      })

      if (!addressToTest.types.includes('postal_code')){
        openNotification();   
      }
    }
  }

  const autoCompleteLesseeMailingZipcodeStateCountyCity = async (addressComponents: any) => {
    let zipcode = lesseeForm.getFieldValue(['lesseeAttributes', 'mailingAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        lesseeAttributes: {
          mailingAddressAttributes: {
            state: null,
            county: null,
            cityId: null,
          },
        },
      })

      await network
        .GET(`/api/v1/address/city-details?zipcode=${zipcode}`)
        .then((response) => {
          if (response.data.is_state_active_on_calculator) {
            setLesseeMailStateOptions(
              formatOptions({
                options: response.data.state || [],
                type: 'state',
              })
            )
            let countyParishOptions: any = formatOptions({
              options: response.data.county || [],
              type: 'county',
            })
            setLesseeMailCountyOptions(countyParishOptions)
            let cityOptions: any = formatOptions({
              options: response.data.city || [],
              type: 'city',
            })
            setLesseeMailCityOptionsData(cityOptions)

            setShowMailingState(null)
            setShowMailingCountyState(null)
            setShowMailingCityState(null)

            // Try to autocomplete state
            addressComponents.map((component: any) => {
              if (component.types.includes('administrative_area_level_1')) {
                lesseeForm.setFieldsValue({
                  lesseeAttributes: {
                    mailingAddressAttributes: { state: component.short_name },
                  },
                })
              }
            })

            // Try to autocomplete county
            addressComponents.map((component: any) => {
              if (component.types.includes('administrative_area_level_2')) {
                let countyName: string = component.short_name.toLowerCase().replace(' county', '').toUpperCase()
                lesseeForm.setFieldsValue({
                  lesseeAttributes: {
                    mailingAddressAttributes: { county: countyName },
                  },
                })

                // Find state id from countyParishOptions using countyName
                countyParishOptions.map((option: any) => {
                  if (option.label == countyName) {
                    setLesseeMailCityOptions(cityOptions.filter((obj: OptionData) => obj.parentId === parseInt(option.value)))
                  }
                })
              }
            })

            // Try to autocomplete city
            addressComponents.map((component: any) => {
              if (component.types.includes('locality')) {
                cityOptions.map((option: any) => {
                  if (option.label == component.long_name.toUpperCase()) {
                    lesseeForm.setFieldsValue({
                      lesseeAttributes: {
                        mailingAddressAttributes: { cityId: option.label },
                      },
                    })
                  }
                })
              }
            })
          }
          if (!response.data.is_state_active_on_calculator || response.data.city.length < 1 || response.data.city === undefined) {
            setZipMailValidateStatus('error')
            setZipMailErrorMessage('Speed Leasing currently does not lease to residents of this state.')
            setShowMailingState(null)
          } else {
            setZipMailValidateStatus(undefined)
            setZipMailErrorMessage(undefined)
          }
        })
        .catch((error) => {
          logger.error('autoCompleteLesseeMailingZipcodeStateCountyCity.Request Error', error)
        })
    } catch (e) {
      logger.error('autoCompleteLesseeMailingZipcodeStateCountyCity Error', e)
    }
  }

  const getEmployerStatus = async () => {
    try {
      await network.GET(`/api/v1/employment-status`).then((response) => {
        if (response.data.employment_status) {
          setEmploymentStatusOptions(
            response.data.employment_status.map((item: [string, string | number]) => {
              return {
                value: item[1],
                label: item[0],
              }
            })
          )
        } else {
          setEmploymentStatusOptions([])
        }
      })
    } catch (e) {
      logger.error('Request Error', e)
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
    window.addEventListener('beforeunload', alertUser)
    window.addEventListener('unload', handleTabClosing)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
      window.removeEventListener('unload', handleTabClosing)
    }
  }, [])

  useEffect(() => {
    setLesseeHomeStateOptions(data?.lessee?.homeAddress?.stateOptions)
    setLesseeHomeCountyOptions(data?.lessee?.homeAddress?.countyOptions)
    setLesseeHomeCityOptions(data?.lessee?.homeAddress?.cityOptions)

    setLesseeMailStateOptions(data?.lessee?.mailingAddress?.stateOptions)
    setLesseeMailCountyOptions(data?.lessee?.mailingAddress?.countyOptions)
    setLesseeMailCityOptions(data?.lessee?.mailingAddress?.cityOptions)
  }, [data])

  const handleTabClosing = () => {
    // lesseeForm.submit()
  }

  const alertUser = (event: any) => {
    // lesseeForm.submit()
    event.preventDefault()
    event.returnValue = ''
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setHomeAddress({
      ...homeAddress,
      [name]: value,
    })
  }

  const handleFormChange = () => {
    setBtnClass('green-border')
  }

  const handleStateTarget = (e: any, f: any) => {
    setStateTarget(f.children)
  }

  const handleCountyTarget = (e: any, f: any) => {
    setCountytarget(f.children)
  }

  const handleCityTarget = (e: any, f: any) => {
    setCityTarget(f.children)
  }

  const handleManualMonthYear = (e:any) => {
    setManualMonthYear(null)
    setMonthYear(e)
    setNullMonthYear(true)
  }

  const handleMonthYear = (e:any) => {
    if (e !== null) {
        let startDate = e._d
        let newDate : any = moment().toDate()
        let monthYearDiff = newDate - startDate
        const toMonthYears = Number((monthYearDiff/(365)/(86400000)).toFixed(2))
        setMonthYear(toMonthYears)
        setManualMonthYear(null)
        setNullMonthYear(false)
    } else {
        if (manualMonthYears !== null) {
          setMonthYear(manualMonthYears)
          setNullMonthYear(false)
        }
    }
  }

  const disabledDate = (current:any) => {
    return current && current > moment().endOf('day');
  }

  const fillMailingAddress = (e: any) => {
    if (e.target.checked) {
      // Copy options
      setLesseeMailStateOptions(lesseeHomeStateOptions)
      setLesseeMailCountyOptions(lesseeHomeCountyOptions)
      setLesseeMailCityOptions(lesseeHomeCityOptions)

      // Auto fill fields
      lesseeForm.setFieldsValue({
        lesseeAttributes: {
          mailingAddressAttributes: {
            street1: lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'street1']),
            street2: lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'street2']),
            cityId: lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'cityId']),
            county: lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'county']),
            state: lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'state']),
            zipcode: lesseeForm.getFieldValue(['lesseeAttributes', 'homeAddressAttributes', 'zipcode']),
          },
        },
      })
    } else {
      // Clear options and fields
      setLesseeMailStateOptions([])
      setLesseeMailCountyOptions([])
      setLesseeMailCityOptions([])
      lesseeForm.setFieldsValue({
        lesseeAttributes: {
          mailingAddressAttributes: {
            street1: null,
            street2: null,
            cityId: null,
            county: null,
            state: null,
            zipcode: null,
          },
        },
      })
    }
  }

  lesseeForm.setFieldsValue({
    street1: mailingAddress.street1,
    street2: mailingAddress.street2,
    zipcode: mailingAddress.zipcode,
    state: mailingAddress.state,
    county: mailingAddress.county,
    city: mailingAddress.city,
  })

  const usStates = [
    { name: 'ALABAMA', abbreviation: 'AL' },
    { name: 'ALASKA', abbreviation: 'AK' },
    { name: 'AMERICAN SAMOA', abbreviation: 'AS' },
    { name: 'ARIZONA', abbreviation: 'AZ' },
    { name: 'ARKANSAS', abbreviation: 'AR' },
    { name: 'CALIFORNIA', abbreviation: 'CA' },
    { name: 'COLORADO', abbreviation: 'CO' },
    { name: 'CONNECTICUT', abbreviation: 'CT' },
    { name: 'DELAWARE', abbreviation: 'DE' },
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC' },
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM' },
    { name: 'FLORIDA', abbreviation: 'FL' },
    { name: 'GEORGIA', abbreviation: 'GA' },
    { name: 'GUAM', abbreviation: 'GU' },
    { name: 'HAWAII', abbreviation: 'HI' },
    { name: 'IDAHO', abbreviation: 'ID' },
    { name: 'ILLINOIS', abbreviation: 'IL' },
    { name: 'INDIANA', abbreviation: 'IN' },
    { name: 'IOWA', abbreviation: 'IA' },
    { name: 'KANSAS', abbreviation: 'KS' },
    { name: 'KENTUCKY', abbreviation: 'KY' },
    { name: 'LOUISIANA', abbreviation: 'LA' },
    { name: 'MAINE', abbreviation: 'ME' },
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH' },
    { name: 'MARYLAND', abbreviation: 'MD' },
    { name: 'MASSACHUSETTS', abbreviation: 'MA' },
    { name: 'MICHIGAN', abbreviation: 'MI' },
    { name: 'MINNESOTA', abbreviation: 'MN' },
    { name: 'MISSISSIPPI', abbreviation: 'MS' },
    { name: 'MISSOURI', abbreviation: 'MO' },
    { name: 'MONTANA', abbreviation: 'MT' },
    { name: 'NEBRASKA', abbreviation: 'NE' },
    { name: 'NEVADA', abbreviation: 'NV' },
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH' },
    { name: 'NEW JERSEY', abbreviation: 'NJ' },
    { name: 'NEW MEXICO', abbreviation: 'NM' },
    { name: 'NEW YORK', abbreviation: 'NY' },
    { name: 'NORTH CAROLINA', abbreviation: 'NC' },
    { name: 'NORTH DAKOTA', abbreviation: 'ND' },
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP' },
    { name: 'OHIO', abbreviation: 'OH' },
    { name: 'OKLAHOMA', abbreviation: 'OK' },
    { name: 'OREGON', abbreviation: 'OR' },
    { name: 'PALAU', abbreviation: 'PW' },
    { name: 'PENNSYLVANIA', abbreviation: 'PA' },
    { name: 'PUERTO RICO', abbreviation: 'PR' },
    { name: 'RHODE ISLAND', abbreviation: 'RI' },
    { name: 'SOUTH CAROLINA', abbreviation: 'SC' },
    { name: 'SOUTH DAKOTA', abbreviation: 'SD' },
    { name: 'TENNESSEE', abbreviation: 'TN' },
    { name: 'TEXAS', abbreviation: 'TX' },
    { name: 'UTAH', abbreviation: 'UT' },
    { name: 'VERMONT', abbreviation: 'VT' },
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI' },
    { name: 'VIRGINIA', abbreviation: 'VA' },
    { name: 'WASHINGTON', abbreviation: 'WA' },
    { name: 'WEST VIRGINIA', abbreviation: 'WV' },
    { name: 'WISCONSIN', abbreviation: 'WI' },
    { name: 'WYOMING', abbreviation: 'WY' },
  ]

  return data ? (
    <>
      <ApplicationSteps stepType={`applicant`} leaseApplicationId={`${leaseApplicationId}`} leaseCalculatorId={`${leaseCalculatorId}`} save={null} attribute={btnAttribute} />
      <div className="title-container">
        <div className="subtitle-container">
          <Title level={2}> Applicant </Title>
          <p> Enter information about yourself to apply for a lease TEST. </p>
        </div>
        <Form
          form={lesseeForm}
          {...layout}
          onFinish={handleSubmit}
          // scrollToFirstError={true}
          onChange={handleFormChange}
          initialValues={{
            lesseeAttributes: {
              firstName: data?.lessee?.firstName,
              middleName: data?.lessee?.middleName,
              lastName: data?.lessee?.lastName,
              dateOfBirth: data?.lessee?.dateOfBirth,
              ssn: data?.lessee?.ssn,
              driversLicenseIdNumber: data?.lessee?.driversLicenseIdNumber,
              homePhoneNumber: data?.lessee?.homePhoneNumber,
              mobilePhoneNumber: data?.lessee?.mobilePhoneNumber,
              atAddressMonths: data?.lessee?.atAddressMonths,
              atAddressYears: data?.lessee?.atAddressYears,
              monthYears: data?.lessee?.monthYears,
              monthlyMortgage: data?.lessee?.monthlyMortgage,
              homeOwnership: data?.lessee?.homeOwnership,
              employerName: data?.lessee?.employerName,
              employerPhoneNumber: data?.lessee?.employerPhoneNumber,
              employmentStatus: data?.lessee?.employmentStatus,
              jobTitle: data?.lessee?.jobTitle,
              timeAtEmployerYears: data?.lessee?.timeAtEmployerYears,
              timeAtEmployerMonths: data?.lessee?.timeAtEmployerMonths,
              grossMonthlyIncome: data?.lessee?.grossMonthlyIncome,
              motorcycleLicence: data?.lessee?.motorcycleLicence,
              firstTimeRider: data?.lessee?.firstTimeRider,
              homeAddressAttributes: {
                state: data?.lessee?.homeAddress?.state,
                street1: data?.lessee?.homeAddress?.street1,
                street2: data?.lessee?.homeAddress?.street2,
                zipcode: data?.lessee?.homeAddress?.zipcode,
                county: data?.lessee?.homeAddress?.county,
                cityId: data?.lessee?.homeAddress?.cityId,
              },
              mailingAddressAttributes: {
                state: data?.lessee?.mailingAddress?.state,
                street1: data?.lessee?.mailingAddress?.street1,
                street2: data?.lessee?.mailingAddress?.street2,
                zipcode: data?.lessee?.mailingAddress?.zipcode,
                county: data?.lessee?.mailingAddress?.county,
                cityId: data?.lessee?.mailingAddress?.cityId,
              },
              employmentAddressAttributes: {
                id: lessee?.employmentAddress?.id,
                city: lessee?.employmentAddress?.city,
                state: lessee?.employmentAddress?.state,
              },
            },
          }}
        >
          <Content className="content-1">
            <Row gutter={[16, 40]}>
              <Col span={24} className="cca-center-text">
                <Title level={2}> About You </Title>
                <br />
              </Col>
            </Row>
            <div className="collapse-container">
              <Collapse defaultActiveKey={['1', '2', '3']}>
                <Panel header="Personal" key="1">
                  <Col {...formLayout.container.formCol}>
                    <Row gutter={[16, 0]}>
                      <Col {...formLayout.field.col}>
                        <Form.Item
                          label="First Name"
                          name={['lesseeAttributes', 'firstName']}
                          rules={[
                            {
                              required: true,
                              message: 'First Name is required!',
                            },
                          ]}
                        >
                          <Input placeholder="First Name" className="ant-input-comp" />
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="Middle Name" name={['lesseeAttributes', 'middleName']}>
                          <Input placeholder="Middle Name" className="ant-input-comp" />
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="Last Name" name={['lesseeAttributes', 'lastName']} rules={[{ required: true, message: 'Last Name is required!' }]}>
                          <Input placeholder="Last Name" className="ant-input-comp" />
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col} className="space-up dob">
                      <DobInput dateFormat={dateFormat} form={lesseeForm} requireCoApplicantFields={true}/>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="Social Security Number" name={['lesseeAttributes', 'ssn']} className="space-down" rules={[{ required: true, message: 'SSN is required!' }]}>
                          <Input type="hidden" />
                        </Form.Item>
                        <Form.Item>
                          <SsnInput defaultValue={(data?.lessee && data?.lessee?.ssn?.replace(/-/g, '')) || ''} form={lesseeForm} lesseeType="lessee" />
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="First Motorcycle Purchase/Lease?" name={['lesseeAttributes', 'firstTimeRider']}>
                          <Radio.Group defaultValue={true}>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="Motorcycle License ?" name={['lesseeAttributes', 'motorcycleLicence']}>
                          <Radio.Group defaultValue={false}>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="Phone Number" name={['lesseeAttributes', `${phoneOption === 1 ? 'mobilePhoneNumber' : 'homePhoneNumber'}`]} rules={[{ required: true, message: 'Phone Number is required!' }]}>
                          <MaskedInput mask="(111) 111-1111" placeholder="Phone Number" className="credit-app-phone-no" onChange={handleFormChange} />
                        </Form.Item>
                        <Radio.Group defaultValue={1}>
                          {/* <Radio.Group defaultValue={1} onChange={handlePhoneNumber}> */}
                          <Radio value={1}>Mobile</Radio>
                          <Radio value={2}>Home</Radio>
                        </Radio.Group>
                      </Col>
                    </Row>
                  </Col>
                  </Panel>

                  <Panel header="Home Address" key="2">
                  <Col {...formLayout.container.formCol}>
                      <Row gutter={[16, 0]}>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="Search Address">
                            <AutoCompleteAddress beforePlacesGetDetails={autoCompleteLesseeHomeBeforePlacesGetDetails} onPlacesGetDetailsResult={autoCompleteLesseeHomeOnPlacesGetDetailsResult} />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                            label="Street Address (no P.O. Boxes)"
                            name={['lesseeAttributes', 'homeAddressAttributes', 'street1']}
                            className="street-address"
                            rules={[
                              {
                                required: true,
                                message: 'Street Address (no P.O. Boxes) is required!',
                              },
                            ]}
                          >
                            <Input placeholder="Street Address (no P.O. Boxes)" onChange={handleChange} className="ant-input-comp space-up" />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="Apartment / Unit" name={['lesseeAttributes', 'homeAddressAttributes', 'street2']}>
                            <Input placeholder="Apartment / Unit" onChange={handleChange} className="ant-input-comp space-up" />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                            label="ZIP Code"
                            name={['lesseeAttributes', 'homeAddressAttributes', 'zipcode']}
                            validateStatus={zipHomeValidateStatus}
                            help={zipHomeErrorMessage}
                            rules={[{ required: true, message: 'ZIP Code is required!' }]}
                          >
                            <MaskedInput
                              mask="11111"
                              placeholder="ZIP Code"
                              onPressEnter={handleLesseeHomeZipcodeBlur}
                              onBlur={handleLesseeHomeZipcodeBlur}
                              className="ant-input-comp space-up"
                              onChange={handleChange}
                            />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="State" name={['lesseeAttributes', 'homeAddressAttributes', 'state']} rules={[{ required: true, message: 'State is required!' }]}>
                            <Select showSearch placeholder="State" {...showHomeState} onSelect={handleHomeStateChange} onChange={handleStateTarget} className="space-up">
                              {lesseeHomeStateOptions &&
                                lesseeHomeStateOptions.map(({ value, label }, index) => {
                                  return (
                                    <Option key={index} value={`${value}`}>
                                      {label}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                            label="County/Parish"
                            name={['lesseeAttributes', 'homeAddressAttributes', 'county']}
                            rules={[
                              {
                                required: true,
                                message: 'County/Parish is required!',
                              },
                            ]}
                          >
                            <Select showSearch placeholder="County/Parish" {...showHomeCountyState} onSelect={handleHomeCountyStateChange} onChange={handleCountyTarget} className="space-up">
                              {lesseeHomeCountyOptions &&
                                lesseeHomeCountyOptions.map(({ value, label }, index) => {
                                  return (
                                    <Option key={index} value={`${value}`}>
                                      {label}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="City" name={['lesseeAttributes', 'homeAddressAttributes', 'cityId']} rules={[{ required: true, message: 'City is required!' }]}>
                            <Select showSearch placeholder="City" {...showHomeCityState} onSelect={handleHomeCityStateChange} onChange={handleCityTarget} className="space-up">
                              {lesseeHomeCityOptions &&
                                lesseeHomeCityOptions.map(({ value, label }, index) => {
                                  return (
                                    <Option key={index} value={`${value}`}>
                                      {label}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                          label="Length of Stay at Current Address"
                          name={['lesseeAttributes', 'monthYears']}
                          rules={[{ required: nullMonthYear, message: 'Length of Stay is required!' }]}
                          >
                            <Space direction="horizontal">
                            <DatePicker onChange={handleMonthYear} disabledDate={disabledDate}></DatePicker>
                            <span>to Present</span>
                            <InputNumber placeholder="Length of Stay at Current Address" onChange={handleManualMonthYear} value={(monthYears)}/>
                            </Space>
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                            label="Monthly Mortgage or Rent"
                            name={['lesseeAttributes', 'monthlyMortgage']}
                            rules={[
                              {
                                required: true,
                                message: 'Monthly Mortgage or Rent is required!',
                              },
                            ]}
                          >
                            <InputNumber className="space-up monthly-mortgage" placeholder="Monthly Mortgage or Rent" />
                          </Form.Item>
                          <Form.Item name={['lesseeAttributes', 'homeOwnership']} rules={[{ required: true, message: 'Ownership is required!' }]}>
                            <Radio.Group className="space-up">
                              <Radio value={1}>Own</Radio>
                              <Radio value={2}>Rent</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      </Row>
                  </Col>
                  </Panel>

                  <Panel header="Mailing Address" key="3">
                  <Col {...formLayout.container.formCol}>
                      <Row gutter={[16, 0]}>
                        <Col {...formLayout.field.col}>
                          <Checkbox style={{ fontSize: `13px`, marginTop: `5px` }} onChange={fillMailingAddress}>
                            Is Home Address Same as Mailing Address?
                          </Checkbox>
                        </Col>

                        <Col {...formLayout.field.col}>
                          <Form.Item label="Search Address">
                            <AutoCompleteAddress beforePlacesGetDetails={autoCompleteLesseeMailingBeforePlacesGetDetails} onPlacesGetDetailsResult={autoCompleteLesseeMailingOnPlacesGetDetailsResult} />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                            label="Street Address (no P.O. Boxes)"
                            name={['lesseeAttributes', 'mailingAddressAttributes', 'street1']}
                            className="street-address"
                          >
                            <Input placeholder="Street Address (no P.O. Boxes)" className="ant-input-comp space-up" />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="Appartment / Unit" name={['lesseeAttributes', 'mailingAddressAttributes', 'street2']}>
                            <Input placeholder="Appartment / Unit" className="ant-input-comp space-up" />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                            label="ZIP Code"
                            name={['lesseeAttributes', 'mailingAddressAttributes', 'zipcode']}
                            validateStatus={zipMailValidateStatus}
                            help={zipMailErrorMessage}
                          >
                            <MaskedInput mask="11111" placeholder="ZIP Code" onPressEnter={handleLesseeMailZipcodeBlur} onBlur={handleLesseeMailZipcodeBlur} className="ant-input-comp space-up" />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="State" name={['lesseeAttributes', 'mailingAddressAttributes', 'state']}>
                            <Select showSearch placeholder="State" {...showMailingState} onSelect={handleMailingStateChange} className="space-up">
                              {lesseeMailStateOptions &&
                                lesseeMailStateOptions.map(({ value, label }, index) => {
                                  return (
                                    <Option key={index} value={`${value}`}>
                                      {label}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="County/Parish" name={['lesseeAttributes', 'mailingAddressAttributes', 'county']}>
                            <Select showSearch placeholder="County/Parish" {...showMailingCountyState} onSelect={handleMailingCountyStateChange} className="space-up">
                              {lesseeMailCountyOptions &&
                                lesseeMailCountyOptions.map(({ value, label }, index) => {
                                  return (
                                    <Option key={index} value={`${value}`}>
                                      {label}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="City" name={['lesseeAttributes', 'mailingAddressAttributes', 'cityId']}>
                            <Select showSearch placeholder="City" {...showMailingCityState} onSelect={handleMailingCityStateChange} className="space-up">
                              {lesseeMailCityOptions &&
                                lesseeMailCityOptions.map(({ value, label }, index) => {
                                  return (
                                    <Option key={index} value={`${value}`}>
                                      {label}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                  </Col>
                </Panel>
              </Collapse>
            </div>
          </Content>

          <Content className="content-1">
            <Row gutter={[16, 16]}>
              <Col span={24} className="cca-center-text">
                <Title level={2}> About Your Work </Title>
                <br />
              </Col>
            </Row>

            <div className="collapse-container">
              <Collapse defaultActiveKey={['1', '2']}>
                <Col {...formLayout.container.placeholderCol}></Col>
                <Panel header="Employer" key="1">
                  <Col {...formLayout.container.formCol}>
                    <Row gutter={[16, 0]}>
                      {lessee?.employmentAddress && (
                        <Col {...formLayout.field.col}>
                          <Form.Item style={{ display: 'none' }} name={['lesseeAttributes', 'employmentAddressAttributes', 'id']}>
                            <Input className="space-up" />
                          </Form.Item>
                        </Col>
                      )}
                      <Col {...formLayout.field.col}>
                        <Form.Item
                          label="Employer Name"
                          name={['lesseeAttributes', 'employerName']}
                          rules={[{ required: requireEmploymentFields, message: 'Employer Name is required!' }]}
                        >
                          <Input placeholder="Employer Name" className="ant-input-comp space-up" />
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item
                          label="Phone Number"
                          name={['lesseeAttributes', 'employerPhoneNumber']}
                          rules={[{ required: requireEmploymentFields, message: 'Phone Number is required!' }]}
                        >
                          <MaskedInput mask="(111) 111-1111" placeholder="Phone Number" className="credit-app-phone-no space-up" onChange={handleFormChange} />
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="City" name={['lesseeAttributes', 'employmentAddressAttributes', 'city']} rules={[{ required: requireEmploymentFields, message: 'City is required!' }]}>
                          <Input placeholder="City" className="ant-input-comp space-up" />
                        </Form.Item>
                      </Col>
                      <Col {...formLayout.field.col}>
                        <Form.Item label="State" name={['lesseeAttributes', 'employmentAddressAttributes', 'state']} rules={[{ required: requireEmploymentFields, message: 'State is required!' }]}>
                          <Select showSearch placeholder="State" className="space-up">
                            {usStates &&
                              usStates.map(({ name, abbreviation }, index) => {
                                return (
                                  <Option key={index} value={`${name}`}>
                                    {abbreviation}
                                  </Option>
                                )
                              })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Panel>

                <Panel header="Employment Details" key="2">
                  <Col {...formLayout.container.formCol}>
                      <Row gutter={[16, 0]}>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="Employment Status" name={['lesseeAttributes', 'employmentStatus']} rules={[{ required: true, message: 'Status is required!' }]}>
                            <Select showSearch placeholder="Employment Status" onChange={handleEmploymentStatus} optionFilterProp="children" className="space-up">
                              {employmentStatusOptions &&
                                employmentStatusOptions.map(({ value, label }, index) => {
                                  return (
                                    <Option key={index} value={`${value}`}>
                                      {label}
                                    </Option>
                                  )
                                })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item label="Job Title" name={['lesseeAttributes', 'jobTitle']} rules={[{ required: requireEmploymentFields, message: 'Job Tile is required!' }]}>
                            <Input placeholder="Job Title" className="ant-input-comp space-up" />
                          </Form.Item>
                        </Col>
                        <Col {...formLayout.field.colgroup[2]}>
                          <Row gutter={[16, 0]}>
                            <Col {...formLayout.field.colmem[2]}>
                              <Form.Item
                                label="Years Employed"
                                name={['lesseeAttributes', 'timeAtEmployerYears']}
                                rules={[{ required: requireEmploymentFields, message: 'Years Employed is required!' }]}
                              >
                                <InputNumber className="space-up" placeholder="Years Employed" />
                              </Form.Item>
                            </Col>
                            <Col {...formLayout.field.colmem[2]}>
                              <Form.Item label="Months Employed" name={['lesseeAttributes', 'timeAtEmployerMonths']}>
                                <InputNumber className="space-up" placeholder="Months Employed" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col {...formLayout.field.col}>
                          <Form.Item
                            label="Gross Monthly Income"
                            name={['lesseeAttributes', 'grossMonthlyIncome']}
                            rules={[{ required: requireEmploymentFields, message: 'Gross Monthly Income is required!' }]}
                          >
                            <InputNumber className="space-up" placeholder="Gross Monthly Income" />
                          </Form.Item>
                        </Col>
                      </Row>
                  </Col>
                </Panel>
              </Collapse>
              <div className="button-container">
                <Button className={btnClass} disabled={disableSubmitBtn} htmlType="submit">
                  Save
                </Button>
                <Button className="button" type="primary">
                  <Link to={`/applications/${leaseApplicationId}/calculators/${leaseCalculatorId}/bike`}> prev </Link>
                </Button>
                <Button className="button" type="primary" disabled={btnAttribute}>
                  <Link to={`/applications/${leaseApplicationId}/co-applicant`}> Next </Link>
                </Button>
              </div>
            </div>
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
  ) : null
}

export default Applicant