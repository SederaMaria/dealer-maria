import React, { useState, useEffect } from 'react'
import {
  Table,
  Spin,
  Menu,
  Dropdown,
  Button,
  Form,
  Select,
  Drawer,
  Input,
  Row,
  Col,
  message,
} from 'antd';
import { DownOutlined, FilterOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { logger, network } from '../../../../utils';
import '../styles/ApplicationList.css';


const { Option } = Select;

interface Applications {
  key: number;
  name: string;
  id: number;
  actionPermission: ActionPermission;
}

interface Data {
  applicationIdentifier: string;
  applicant: string;
  coApplicant: string;
  modelAndYear: string;
  creditStatus: string;
  documentStatus: string;
  daysSubmitted: string;
  lastUpdated: string;
}

interface ActionPermission {
  canAddCoapplicant: boolean;
  canChangeBikes: boolean;
  canOpenCreditApplication: boolean;
  canOpenPaymentCalculator: boolean;
  canRemoveCoapplicant: boolean;
  canRequestLeaseDocuments: boolean;
  canSubmitBankInfo: boolean;
  canSwapApplicants: boolean;
  expired: boolean;
  submitted: boolean;
  canArchive: boolean;
}

type StatesForSelect = [string, string]


const filterFormLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

function ApplicationList() {

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Data[] | any>([])

  const [visibleDrawer, setDrawerVisible] = useState<boolean>(false)

  const [filterForm] = Form.useForm()
  const [filterOptionsLoading, setFilterOptionsLoading] = useState<boolean>(true)
  const [filterData, setFilterData] = useState<object>({})

  const [creditStatusOptions, setCreditStatusOptions] = useState<Array<StatesForSelect> | Array<any>>([])
  const [documentStatusOptions, setDocumentStatusOptions] = useState<Array<StatesForSelect> | Array<any>>([])

  const [paginationProps, setPaginationProps] = useState<object>({ total: 0 })
  const [paginationData, setPaginationData] = useState<object>({})


  const menu = (actionPermission: ActionPermission, record: Applications) => {
    let paymentCalcNode;

    if (actionPermission.canOpenPaymentCalculator) {
      paymentCalcNode = <Link to={`/applications/${record.id}/calculators/:calculatorID/calculator`}>Open Payment Calculator</Link>;
    } else if (actionPermission.canChangeBikes) {
      paymentCalcNode = <Link to={`/applications/${record.id}/calculators/:calculatorID/calculator`}>Open Payment Calculator</Link>;
    } else {
      paymentCalcNode = <a href="#">View Payment Calculator</a>;
    }

    return (
      <Menu>
        <Menu.Item className='hovering'>
          {paymentCalcNode}
        </Menu.Item>
        <Menu.Item className='hovering'>
          {
            actionPermission.canOpenCreditApplication ?
              <a href="#">Open Credit Application</a>
              :
              <Link to={`/applications/${record.id}/applicant`}>View Credit Application</Link>
          }
        </Menu.Item>
        {
          actionPermission.canSwapApplicants &&
            <Menu.Item className='hovering'>
              <a href="#">Swap Applicants</a>
            </Menu.Item>
        }
        {
          actionPermission.canAddCoapplicant &&
            <Menu.Item className='hovering'>
              <Link to={`/applications/${record.id}/co-applicant`}>Add Co-applicant</Link>
            </Menu.Item>
        }
        {
          !actionPermission.expired &&
            <Menu.Item className='hovering'>
              <Link to={`/applications/${record.id}/attachments`}>Add Attachment</Link>
            </Menu.Item>
        }
        {
          actionPermission.canChangeBikes &&
            <>
              <Menu.Item className='hovering'>
                <a href="#">Bike Change</a>
              </Menu.Item>

              <Menu.Item className='hovering'>
                <a href="#">Change Tax Jurisdiction</a>
              </Menu.Item>
              <Menu.Item className='hovering'>
                <a href="#">Change Mileage</a>
              </Menu.Item>
            </>
        }
        {
          actionPermission.canRequestLeaseDocuments &&
            <Menu.Item className='hovering'>
              <a href="#">Request Lease Documents</a>
            </Menu.Item>
        }
        {
          actionPermission.canRemoveCoapplicant &&
            <Menu.Item className='hovering'>
              <a href="#">Remove Co-applicant</a>
            </Menu.Item>
        }
        {
          actionPermission.canSubmitBankInfo &&
            <Menu.Item className='hovering'>
              <Link to={`/applications/${record.id}/banking-information`}>Submit Bank Information</Link>
            </Menu.Item>
        }
        {
          actionPermission.canArchive && 
            <Menu.Item className='hovering'>
              <a href="#" onClick={(event: any) => archiveApplication(event, record.id)}>Archive Application</a>
            </Menu.Item>
        }
      </Menu>
    )
  }

  
  const showDrawer = () => {
    setDrawerVisible(true);
  }

  const onDrawerClose = () => {
    setDrawerVisible(false);
  }

  const onDrawerVisibleChange = (visible: boolean) => {
    if (visible) {
      if (creditStatusOptions.length === 0
        && documentStatusOptions.length === 0) {
        getFilterOptions()
      }
    }
  }

  const onFilterReset = () => {
    filterForm.resetFields()
    setDrawerVisible(false)
    setFilterData({})
  }

  const onFilterSubmit = (values: any) => {
    setDrawerVisible(false)
    setFilterData(values)
  }

  const onPaginationChange = (page: any, pageSize: any) => {
    setPaginationData({
      page: page,
      pageSize: pageSize,
    })
  }

  const filterParams = () => {
    if (filterData && Object.keys(filterData).length > 0) {
      return { filter: { ...filterData } }
    } else {
      return {}
    }
  }

  const paginationParams = () => {
    if (paginationData && Object.keys(paginationData).length > 0) {
      return { pagination: { ...paginationData } }
    } else {
      return {}
    }
  }

  const getApplications = async () => {
    if (!loading) { setLoading(true) }

    try {
      await network.POST(`/api/v1/dealers/applications`, {
        ...filterParams(),
        ...paginationParams(),
      }).then(response => {
        setData(response.data.data.leaseApplications)
        setPaginationProps({
          ...paginationProps,
          total: response.data.pagination.total
        })
      }).catch(error => {
        logger.error("Error fetching Applications", error)
      })
    } catch (e) {
      logger.error("Error fetching Applications", e)
    }

    setLoading(false)
  }

  const getFilterOptions = async () => {
    if (!filterOptionsLoading) { setFilterOptionsLoading(true) }

    try {
      await network.GET('/api/v1/dealers/applications/filter-options').then(response => {
        setCreditStatusOptions(response.data.credit_status)
        setDocumentStatusOptions(response.data.document_status)
      }).catch(error => {
        logger.error("Error fetching filter options", error)
      })
    } catch (e) {
      logger.error("Error fetching filter options", e)
    }

    setFilterOptionsLoading(false)
  }

  const archiveApplication = async (event: any, id: number) => {
    if (!loading) { setLoading(true) }

    try {
      await network.POST(`/api/v1/dealers/applications/${id}/archive`, {}).then(response => {
        message.success(response.data.message)
        getApplications()
      }).catch(error => {
        logger.error("Error fetching filter options", error)
      })
    } catch (e) {
      logger.error("Error fetching filter options", e)
    }

    setLoading(false)
  }

  useEffect(() => {
    getApplications()
  },[filterData, paginationData]);


  const getUniqueBy = (arr:Array<Object>, prop:any) => {
    return arr.reduce((a:any, d:any) => {
    if (!a.includes(d[prop])) { a.push(d[prop]); }
       return a;
    }, []);
  }

  const convertToObj = (prop:String) => {
    return data ? getUniqueBy(data, prop).map( (val:any) =>  { return val ? { text: val, value: val } : null } ).filter( (val:any) => { return val !== null; } ) : []
  }

  const columns: ColumnsType<Applications | any> = [
    {
      key: 'applicationIdentifier',
      title: 'Application Identifier',
      dataIndex: 'applicationIdentifier',
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
      render(val, row) {
        return (
          <Link to={`/applications/${row.id}/summary`}> { val == null ? 'N/A' : val } </Link>
        )
      },
      responsive: ['lg'],
      onFilter: (value, record) => record.applicationIdentifier && record.applicationIdentifier.includes(value),
      filters: convertToObj('applicationIdentifier'),
      filterSearch: true,
      className:'identifier'
    },
    {
      key: 'applicant',
      title: 'Applicant',
      dataIndex: 'applicant',
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
      onFilter: (value, record) => record.applicant && record.applicant.includes(value),
      filters: convertToObj('applicant'),
      filterSearch: true,
    },
    {
      key: 'coApplicant',
      title: 'Co-Applicant',
      dataIndex: 'coApplicant',
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
      onFilter: (value, record) => record.coApplicant && record.coApplicant.includes(value),
      filters: convertToObj('coApplicant'),
      filterSearch: true,
    },
    {
      key: 'modelAndYear',
      title: 'Model and Year',
      dataIndex: 'modelAndYear',
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
      onFilter: (value, record) => record.modelAndYear && record.modelAndYear.includes(value),
      filters: convertToObj('modelAndYear'),
      filterSearch: true,
    },
    {
      key: 'creditStatus',
      title: 'Credit Status',
      dataIndex: 'creditStatus',
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
      onFilter: (value, record) => record.creditStatus && record.creditStatus.includes(value),
      filters: convertToObj('creditStatus'),
      filterSearch: true,
    },
    {
      key: 'documentStatus',
      title: 'Document Status',
      dataIndex: 'documentStatus',
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
      onFilter: (value, record) => record.documentStatus && record.documentStatus.includes(value),
      filters: convertToObj('documentStatus'),
      filterSearch: true,
    },
    {
      key: 'daysSubmitted',
      title: 'Days Submitted',
      dataIndex: 'daysSubmitted',
      sorter: {
        compare: (a, b) => a.id - b.id,
      }, 
      responsive: ['lg'],
      onFilter: (value, record) => record.daysSubmitted && record.daysSubmitted.includes(value),
      filters: convertToObj('daysSubmitted'),
      filterSearch: true,
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      sorter: {
        compare: (a, b) => a.id - b.id,
      }, 
      responsive: ['lg'],
      onFilter: (value: any, record: any) => record.lastUpdated && record.lastUpdated.includes(value),
      filters: convertToObj('lastUpdated'),
      filterSearch: true,
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render(text, record, index) {
        return (
          <Dropdown className='dropdown-field' overlay={menu(record.actionPermission, record)} trigger={['click']} >
            <a className="ant-dropdown-link" href="#">
              <Button>Action <DownOutlined style={{marginLeft: 5, marginRight: -8, padding: 0}} /></Button>
            </a>
          </Dropdown>
        )
      }
    },
  ]

  return (
    <Spin spinning={loading}>
      <Row>
        <Col flex="auto"></Col>
        <Col flex="none">
          <Button
            onClick={showDrawer}
            icon={<FilterOutlined style={{margin: 0}} />}
            style={{marginBottom: "0.5em"}}
          >
            Filter
          </Button>
        </Col>
      </Row>
      
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(val) => val.id}
        pagination={{
          defaultPageSize: 20,
          onChange: onPaginationChange,
          pageSizeOptions: ["20","50", "100"],
           ...paginationProps
        }}
        size="small"
        scroll={{y:685}} 
        className='table-wrapper'
      />
      <Drawer
      title="Filters"
        placement="right"
        afterVisibleChange={onDrawerVisibleChange}
        onClose={onDrawerClose}
        visible={visibleDrawer}
        width={400}
      >
        <Form
          form={filterForm}
          colon={false}
          onFinish={onFilterSubmit}
          {...filterFormLayout}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Credit Status" name="creditStatus">
            <Select allowClear loading={filterOptionsLoading}>
              {
                creditStatusOptions && creditStatusOptions.map((item, index) => {
                  return <Option key={index} value={item[1]}>{item[0]}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="Document Status" name="documentStatus">
            <Select allowClear loading={filterOptionsLoading}>
              {
                documentStatusOptions && documentStatusOptions.map((item, index) => {
                  return <Option key={index} value={item[1]}>{item[0]}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="Can Change Bikes?" name="canChangeBikes">
            <Select allowClear>
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{marginTop: "15px"}}>
            <Button type="primary" htmlType="submit" style={{marginRight: "5px"}}>
              Filter
            </Button>
            <Button htmlType="button" onClick={onFilterReset}>
              Clear Filters
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Spin>
  )
}

export default ApplicationList
