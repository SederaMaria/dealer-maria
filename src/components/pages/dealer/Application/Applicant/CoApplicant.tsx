import React, { useState, useEffect } from 'react'
import { Row, Col, Form,Input,Collapse, Radio, InputNumber, Select, /*Typography, */Layout, message, Checkbox, DatePicker, Space } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { logger, network } from '../../../../../utils'
import MaskedInput from 'antd-mask-input'
import ApplicationSteps from '../ApplicationSteps'
import SsnInput from './SsnInput'
import DobInput from './DobInput.js'
import { AutoCompleteAddress } from './AutoCompleteAddress'
import { useHistory } from "react-router-dom";
import '../../styles/Applicant.css'

//Material UI
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import {TextField, Typography, Paper, Grid,  Button } from '@mui/material'
import { ExpandMore} from '@mui/icons-material'


const { Option } = Select
const { RangePicker } = DatePicker
//const { Title } = Typography
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

interface Address {
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

interface employmentAddress {
  id?: number | undefined
  city?: string | undefined
  state?: string | undefined
}

interface Lessee {
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
  relationshipToLesseeId?: number | string | undefined
  isDriving: number | undefined
}

interface LeaseCalculator {
  id?: string | number | undefined
}

interface Props {
  data?: {
    id: string | number
    colessee?: Lessee | undefined
    leaseCalculator: LeaseCalculator
    relationshipToLesseeOptions?: any | undefined
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

export const CoApplicant: React.FC<Props> = ({ data }: Props) => {
  const [lesseeForm] = Form.useForm()

  let leaseApplicationId: string | number | undefined = data?.id
  let leaseCalculatorId: string | number | undefined = data?.leaseCalculator?.id

  const [requireCoApplicantFields, setRequireCoApplicantFields] = useState(false)

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

  const [relationshipToLesseeOptions, setRelationshipToLesseeOptions] = useState<Array<OptionData>>([])

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

  const [manualMonthYears, setManualMonthYear] = useState<any | undefined>(undefined)
  const [monthYears, setMonthYear] = useState<any | undefined>(undefined)
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
    //notification.open(args);
  };

  const zipCodeNotification = (zipcode:string)=> {
    if(zipcode == undefined){
      openNotification();
    }
  }


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

  const history = useHistory();

  const handleSubmit = async (values: any) => {
    values = { ...values }
    console.log("values", values)
    setDisableSubmitBtn(true)
    submitApplication(values)
    let path=`/applications/${leaseApplicationId}/summary`
    history.push(path);
  }


  const handleRelationshiptoApplicant = (value:string) => {
    const relationshipArray = ['1', '2', '3', '4', '5', '6']

    relationshipArray.forEach(value => {
      if (relationshipArray.includes(value)) {
        setRequireCoApplicantFields(true)
      }
    })
}

  const handleLesseeHomeZipcodeBlur = async () => {
    let zipcode = lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        colesseeAttributes: {
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
    let zipcode = lesseeForm.getFieldValue(['colesseeAttributes', 'mailingAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        colesseeAttributes: {
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
        colesseeAttributes: { homeAddressAttributes: { cityId: null } },
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
        colesseeAttributes: { mailingAddressAttributes: { cityId: null } },
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
      colesseeAttributes: {
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
        if (component.types.includes('postal_code')) {
          lesseeForm.setFieldsValue({
            colesseeAttributes: {
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
    let zipcode = lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        colesseeAttributes: {
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
                  colesseeAttributes: {
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
                  colesseeAttributes: {
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
                      colesseeAttributes: {
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
      colesseeAttributes: {
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
            colesseeAttributes: {
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
    let zipcode = lesseeForm.getFieldValue(['colesseeAttributes', 'mailingAddressAttributes', 'zipcode'])

    try {
      lesseeForm.setFieldsValue({
        colesseeAttributes: {
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
                  colesseeAttributes: {
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
                  colesseeAttributes: {
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
                      colesseeAttributes: {
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
    setLesseeHomeStateOptions(data?.colessee?.homeAddress?.stateOptions)
    setLesseeHomeCountyOptions(data?.colessee?.homeAddress?.countyOptions)
    setLesseeHomeCityOptions(data?.colessee?.homeAddress?.cityOptions)

    setLesseeMailStateOptions(data?.colessee?.mailingAddress?.stateOptions)
    setLesseeMailCountyOptions(data?.colessee?.mailingAddress?.countyOptions)
    setLesseeMailCityOptions(data?.colessee?.mailingAddress?.cityOptions)
    setRelationshipToLesseeOptions(data?.relationshipToLesseeOptions)
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

  const fillMailingAddress = (e: any) => {
    if (e.target.checked) {
      // Copy options
      setLesseeMailStateOptions(lesseeHomeStateOptions)
      setLesseeMailCountyOptions(lesseeHomeCountyOptions)
      setLesseeMailCityOptions(lesseeHomeCityOptions)

      // Auto fill fields
      lesseeForm.setFieldsValue({
        colesseeAttributes: {
          mailingAddressAttributes: {
            street1: lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'street1']),
            street2: lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'street2']),
            cityId: lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'cityId']),
            county: lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'county']),
            state: lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'state']),
            zipcode: lesseeForm.getFieldValue(['colesseeAttributes', 'homeAddressAttributes', 'zipcode']),
          },
        },
      })
    } else {
      // Clear options and fields
      setLesseeMailStateOptions([])
      setLesseeMailCountyOptions([])
      setLesseeMailCityOptions([])
      lesseeForm.setFieldsValue({
        colesseeAttributes: {
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

  const handleManualMonthYear = (e:any) => {
    setManualMonthYear(null)
    setMonthYear(e)
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

  lesseeForm.setFieldsValue({
    street1: mailingAddress.street1,
    street2: mailingAddress.street2,
    zipcode: mailingAddress.zipcode,
    state: mailingAddress.state,
    county: mailingAddress.county,
    city: mailingAddress.city,
  })

  console.log("data?.colessee?.employmentStatus", data?.colessee?.employmentStatus)

  return data ? (
    <>
      <ApplicationSteps stepType={`co-applicant`} leaseApplicationId={`${leaseApplicationId}`} leaseCalculatorId={`${leaseCalculatorId}`} save={null} attribute={btnAttribute} />
      <div className="title-container">
        <div className="subtitle-container">
          <Typography variant="h3">Co-Applicant</Typography>
          <p> Enter information about yourself to apply for a lease. </p>
        </div>
        <Form
          form={lesseeForm}
          {...layout}
          onFinish={handleSubmit}
          onChange={handleFormChange}
          initialValues={{
            colesseeAttributes: {
              firstName: data?.colessee?.firstName,
              middleName: data?.colessee?.middleName,
              lastName: data?.colessee?.lastName,
              dateOfBirth: data?.colessee?.dateOfBirth,
              ssn: data?.colessee?.ssn,
              driversLicenseIdNumber: data?.colessee?.driversLicenseIdNumber,
              homePhoneNumber: data?.colessee?.homePhoneNumber,
              mobilePhoneNumber: data?.colessee?.mobilePhoneNumber,
              atAddressMonths: data?.colessee?.atAddressMonths,
              atAddressYears: data?.colessee?.atAddressYears,
              monthYears: data?.colessee?.monthYears,
              monthlyMortgage: data?.colessee?.monthlyMortgage,
              homeOwnership: data?.colessee?.homeOwnership,
              employerName: data?.colessee?.employerName,
              employerPhoneNumber: data?.colessee?.employerPhoneNumber,
              employmentStatus: data?.colessee?.employmentStatus,
              jobTitle: data?.colessee?.jobTitle,
              timeAtEmployerYears: data?.colessee?.timeAtEmployerYears,
              timeAtEmployerMonths: data?.colessee?.timeAtEmployerMonths,
              grossMonthlyIncome: data?.colessee?.grossMonthlyIncome,
              relationshipToLesseeId: data?.colessee?.relationshipToLesseeId,
              isDriving: data?.colessee?.isDriving,
              homeAddressAttributes: {
                state: data?.colessee?.homeAddress?.state,
                street1: data?.colessee?.homeAddress?.street1,
                street2: data?.colessee?.homeAddress?.street2,
                zipcode: data?.colessee?.homeAddress?.zipcode,
                county: data?.colessee?.homeAddress?.county,
                cityId: data?.colessee?.homeAddress?.cityId,
              },
              mailingAddressAttributes: {
                state: data?.colessee?.mailingAddress?.state,
                street1: data?.colessee?.mailingAddress?.street1,
                street2: data?.colessee?.mailingAddress?.street2,
                zipcode: data?.colessee?.mailingAddress?.zipcode,
                county: data?.colessee?.mailingAddress?.county,
                cityId: data?.colessee?.mailingAddress?.cityId,
              },
              employmentAddressAttributes: {
                id: data?.colessee?.employmentAddress?.id,
                city: data?.colessee?.employmentAddress?.city,
                state: data?.colessee?.employmentAddress?.state,
              },
            },
          }}
        >
          {/*<Content className="content-1">*/}
          <Paper
            sx={{
              p: 2,
              margin: 2,
              marginBottom: 5,
              padding: 5,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
          >
            <Row gutter={[16, 40]}>
              <Col span={24} className="cca-center-text">
                <Typography variant='h3'>About you</Typography>
              </Col>
            </Row>

            <div className="collapse-container">
            <Collapse defaultActiveKey={['1']}>
                  <Panel header="Personal" key="1">
                  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="flex-start" alignItems="flex-end">
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="Relationship To Applicant"
                        name={['colesseeAttributes', 'relationshipToLesseeId']}
                      >
                        <Select showSearch placeholder="Relationship To Applicant" onChange={handleRelationshiptoApplicant}>
                          {relationshipToLesseeOptions &&
                            relationshipToLesseeOptions.map(({ value, label }, index) => {
                              return (
                                <Option key={index} value={`${value}`}>
                                  {label}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>
                    </Grid>

                    <Grid item xs={2} sm={4} md={4} >
                      <Form.Item
                        name={['colesseeAttributes', 'firstName']}
                      >
                        <TextField
                            label="First Name"
                            variant="standard"
                            required={requireCoApplicantFields}
                            fullWidth
                            size="small"
                            />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item name={['colesseeAttributes', 'middleName']}>
                      <TextField 
                            label="Middle Name"
                            variant="standard"
                            fullWidth
                            size="small"
                            />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item name={['colesseeAttributes', 'lastName']}>
                      <TextField 
                            label="Last Name"
                            required={requireCoApplicantFields}
                            variant="standard"
                            fullWidth
                            size="small"
                          />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <DobInput dateFormat={dateFormat} form={lesseeForm} requireCoApplicantFields={requireCoApplicantFields}/>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="Social Security Number" name={['colesseeAttributes', 'ssn']} className="space-down" rules={[{ required: requireCoApplicantFields, message: 'Social Security Number is required!' }]}>
                        <Input type="hidden" />
                      </Form.Item>
                      <Form.Item>
                        <SsnInput defaultValue={(data?.colessee && data?.colessee?.ssn?.replace(/-/g, '')) || ''} form={lesseeForm} lesseeType="colessee" />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="Phone Number" name={['colesseeAttributes', `${phoneOption === 1 ? 'mobilePhoneNumber' : 'homePhoneNumber'}`]} rules={[{ required: requireCoApplicantFields, message: 'Phone Number is required!' }]}>
                        <MaskedInput mask="(111) 111-1111" placeholder="Phone Number" className="credit-app-phone-no" onChange={handleFormChange} />
                      </Form.Item>
                      <Radio.Group>
                        {/* <Radio.Group defaultValue={1} onChange={handlePhoneNumber}> */}
                        <Radio value={1}>Mobile</Radio>
                        <Radio value={2}>Home</Radio>
                      </Radio.Group>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="Will this applicant also be riding the motorcycle?"
                        name={['colesseeAttributes', 'isDriving']}
                        rules={[{ required: requireCoApplicantFields, message: 'Please pick option if co-applicant is driving or not.' }]}
                      >
                        <Radio.Group>
                          <Radio value={1}>Yes</Radio>
                          <Radio value={0}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Grid>
                  </Grid>
                </Panel>

                <Panel header="Home Address" key="2">
                  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="flex-start" alignItems="flex-end">
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="Search Address">
                        <AutoCompleteAddress beforePlacesGetDetails={autoCompleteLesseeHomeBeforePlacesGetDetails} onPlacesGetDetailsResult={autoCompleteLesseeHomeOnPlacesGetDetailsResult} />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="Street Address (no P.O. Boxes)"
                        name={['colesseeAttributes', 'homeAddressAttributes', 'street1']}
                        className="street-address"
                        rules={[{ required: requireCoApplicantFields, message: 'Street Address (no P.O. Boxes) is required!' }]}
                      >
                        <Input placeholder="Street Address (no P.O. Boxes)" onChange={handleChange} className="ant-input-comp space-up" />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item name={['colesseeAttributes', 'homeAddressAttributes', 'street2']}>
                      <TextField 
                           label="Apartment / Unit"
                           variant="standard"
                           fullWidth
                            size="small"
                            />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="ZIP Code"
                        name={['colesseeAttributes', 'homeAddressAttributes', 'zipcode']}
                        validateStatus={zipHomeValidateStatus}
                        help={zipHomeErrorMessage}
                        rules={[{ required: requireCoApplicantFields, message: 'ZIP Code is required!' }]}
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
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="State" name={['colesseeAttributes', 'homeAddressAttributes', 'state']} rules={[{ required: requireCoApplicantFields, message: 'State is required!' }]}>
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
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="County/Parish"
                        name={['colesseeAttributes', 'homeAddressAttributes', 'county']}
                        rules={[{ required: requireCoApplicantFields, message: 'County/Parish is required!' }]}
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
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="City" name={['colesseeAttributes', 'homeAddressAttributes', 'cityId']} rules={[{ required: requireCoApplicantFields, message: 'City is required!' }]}>
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
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="Length of Stay at Current Address" name={['colesseeAttributes', 'monthYears']} rules={[{ required: requireCoApplicantFields && nullMonthYear, message: 'Length of Stay required!' }]}>
                        <Space direction="horizontal">
                          <DatePicker onChange={handleMonthYear} disabledDate={disabledDate}> </DatePicker>
                          <span>to Present</span>
                          <InputNumber placeholder="Length of Stay at Current Address" onChange={handleManualMonthYear} value={(monthYears)}/>
                        </Space>
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="Monthly Mortgage or Rent"
                        name={['colesseeAttributes', 'monthlyMortgage']}
                        rules={[{ required: requireCoApplicantFields, message: 'Monthly Mortgage or Rent is required!' }]}
                      >
                        <InputNumber className="space-up monthly-mortgage" placeholder="Monthly Mortgage or Rent" />
                      </Form.Item>
                      <Form.Item name={['colesseeAttributes', 'homeOwnership']} rules={[{ required: requireCoApplicantFields, message: 'Ownership is required!' }]}>
                        <Radio.Group className="space-up">
                          <Radio value={1}>Own</Radio>
                          <Radio value={2}>Rent</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Grid>
                  </Grid>
                </Panel>

                <Panel header="Mailing Address" key="3">
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="flex-start" alignItems="flex-end">
                    <Grid item xs={2} sm={4} md={4}>
                      <Checkbox style={{ fontSize: `13px`, marginTop: `5px` }} onChange={fillMailingAddress}>
                        Is Home Address Same as Mailing Address?
                      </Checkbox>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="Search Address">
                        <AutoCompleteAddress beforePlacesGetDetails={autoCompleteLesseeMailingBeforePlacesGetDetails} onPlacesGetDetailsResult={autoCompleteLesseeMailingOnPlacesGetDetailsResult} />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                    <Form.Item
                      label="Street Address (no P.O. Boxes)"
                      name={['colesseeAttributes', 'mailingAddressAttributes', 'street1']}
                      className="street-address"
                    >
                      <Input placeholder="Street Address (no P.O. Boxes)" className="ant-input-comp space-up" />
                    </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item name={['colesseeAttributes', 'mailingAddressAttributes', 'street2']}>
                      <TextField 
                              variant="standard" 
                              label="Appartment / Unit" 
                              placeholder="Appartment / Unit" 
                              fullWidth
                              size="small"
                            />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="ZIP Code"
                        name={['colesseeAttributes', 'mailingAddressAttributes', 'zipcode']}
                        validateStatus={zipMailValidateStatus}
                        help={zipMailErrorMessage}
                      >
                        <MaskedInput mask="11111" placeholder="ZIP Code" onPressEnter={handleLesseeMailZipcodeBlur} onBlur={handleLesseeMailZipcodeBlur} className="ant-input-comp space-up" />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="State" name={['colesseeAttributes', 'mailingAddressAttributes', 'state']}>
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
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="County/Parish" name={['colesseeAttributes', 'mailingAddressAttributes', 'county']}>
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
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="City" name={['colesseeAttributes', 'mailingAddressAttributes', 'cityId']}>
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
                    </Grid> 
                  </Grid>
                </Panel>
                </Collapse>
            </div>
          </Paper>
          

          <Paper
            sx={{
              p: 2,
              margin: 2,
              marginBottom: 5,
              padding: 5,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24} className="cca-center-text">
                <Typography variant='h3'>About Your Work</Typography>
                <br />
              </Col>
            </Row>
            
            <div className="collapse-container">
            <Collapse>
              <Panel header="Employer" key="1">
                  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="flex-start" alignItems="flex-end">
                    {data?.colessee?.employmentAddress && (
                      <Grid item xs={2} sm={3} md={8}>
                        <Form.Item style={{ display: 'none' }} name={['colesseeAttributes', 'employmentAddressAttributes', 'id']}>
                          <Input className="space-up" />
                        </Form.Item>
                      </Grid>
                    )}
                    <Grid item xs={2} sm={4} md={6}>
                      <Form.Item
                        name={['colesseeAttributes', 'employerName']}
                        rules={[{ required: requireEmploymentFields, message: 'Employer Name is required!' }]}
                      >
                        <TextField 
                            label="Employer Name" 
                            variant="standard" 
                            placeholder="Employer Name" 
                            fullWidth
                            size="small"
                            required
                            />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item name={['colesseeAttributes', 'employmentAddressAttributes', 'city']} rules={[{ required: requireEmploymentFields, message: 'City is required!' }]}>
                      <TextField 
                            label="City"
                            variant="standard" 
                            placeholder="City" 
                            fullWidth
                            size="small"
                            required
                          />
                      </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={6}>
                      <Form.Item label="State" name={['colesseeAttributes', 'employmentAddressAttributes', 'state']} rules={[{ required: requireEmploymentFields, message: 'State is required!' }]}>
                      <Select
                          showSearch
                          placeholder="State"
                          className="space-up"
                      >
                          {
                              usStates && usStates.map(({name, abbreviation}, index) => {
                                  return <Option key={index} value={`${name}`}>{abbreviation}</Option>
                              })
                          }
                      </Select>
                      </Form.Item>
                    </Grid>

                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="Phone Number"
                        name={['colesseeAttributes', 'employerPhoneNumber']}
                        rules={[{ required: requireEmploymentFields, message: 'Phone Number is required!' }]}
                      >
                        <MaskedInput mask="(111) 111-1111" placeholder="Phone Number" className="credit-app-phone-no space-up" onChange={handleFormChange} />
                      </Form.Item>
                    </Grid>
                  </Grid>
                </Panel>

                <Panel header="Employment Details" key="2">
                  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="flex-start" alignItems="flex-end">
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item label="Employment Status" name={['colesseeAttributes', 'employmentStatus']} rules={[{ required: requireCoApplicantFields, message: 'Status is required!' }]}>
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
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                        <Form.Item name={['colesseeAttributes', 'jobTitle']} rules={[{ required: requireEmploymentFields, message: 'Job Tile is required!' }]}>
                        <TextField 
                            label="Job Title"
                            variant="standard" 
                            placeholder="Job Title" 
                            fullWidth
                            size="small"
                            required
                              />
                        </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                          <Form.Item
                            name={['colesseeAttributes', 'timeAtEmployerYears']}
                            rules={[{ required: requireEmploymentFields, message: 'Years Employed is required!' }]}

                          >
                            <TextField 
                                label="Years Employed"
                                variant="standard" 
                                placeholder="Years Employed" 
                                fullWidth
                                size="small"
                                required
                              />
                          </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                          <Form.Item label="Months Employed" name={['colesseeAttributes', 'timeAtEmployerMonths']}>
                            <InputNumber className="space-up" placeholder="Months Employed" />
                          </Form.Item>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                      <Form.Item
                        label="Gross Monthly Income"
                        name={['colesseeAttributes', 'grossMonthlyIncome']}
                        rules={[{ required: requireEmploymentFields, message: 'Gross Monthly Income is required!' }]}
                      >
                        <InputNumber className="space-up" placeholder="Gross Monthly Income" />
                      </Form.Item>
                    </Grid>
                  </Grid>
                  </Panel>
                </Collapse>
             </div>
                <div className="button-container">
                  {/* <Button className={btnClass} disabled={disableSubmitBtn} htmlType="submit">
                    Save
                  </Button> */}
                  {/* <Button>
                    <Link to={`/applications/${leaseApplicationId}/applicant`}> prev </Link>
                  </Button> */}
                  {/* <Button className="button" type="primary" disabled={btnAttribute}>
                    <Link to={`/applications/${leaseApplicationId}/summary`}> Next </Link>
                  </Button> */}
                  <Button variant="contained" style={{backgroundColor: "#e93b1b"}} type="submit">
                      Go To Summary Page
                  </Button>
                </div>
              
            </Paper>

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

export default CoApplicant