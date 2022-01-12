import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logger, network } from '../../../../utils';

import {
  Table,
  Spin,
  Menu,
  Dropdown,
  Button,
  Drawer,
  Row,
  Col,
  Form,
  Input,
  Select
} from 'antd';
import { DownOutlined, FilterOutlined } from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';

import '../styles/ArchivedApplicationList.css';

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
}

type StatesForSelect = [string, string]

const columns: ColumnsType<Applications> = [
  {
    key: 'applicationIdentifier',
    title: 'Application Identifier',
    dataIndex: 'applicationIdentifier',
    render(val, row) {
      return (
        <Link to={`/applications/${row.id}/summary`}> { val == null ? 'N/A' : val } </Link>
      )
    }
  },
  {
    key: 'applicant',
    title: 'Applicant',
    dataIndex: 'applicant',
  },
  {
    key: 'coApplicant',
    title: 'Co-Applicant',
    dataIndex: 'coApplicant',
  },
  {
    key: 'modelAndYear',
    title: 'Model and Year',
    dataIndex: 'modelAndYear',
  },
  {
    key: 'creditStatus',
    title: 'Credit Status',
    dataIndex: 'creditStatus',
  },
  {
    key: 'documentStatus',
    title: 'Document Status',
    dataIndex: 'documentStatus',
  },
  {
    key: 'daysSubmitted',
    title: 'Days Submitted',
    dataIndex: 'daysSubmitted',
  },
  {
    key: 'lastUpdated',
    title: 'Last Updated',
    dataIndex: 'lastUpdated',
  },
]

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
      <Menu.Item>
        {paymentCalcNode}
      </Menu.Item>
      <Menu.Item>
        {
          actionPermission.canOpenCreditApplication ?
            <a href="#">Open Credit Application</a>
            :
            <Link to={`/applications/${record.id}/applicant`}>View Credit Application</Link>
        }
      </Menu.Item>
      {
        actionPermission.canSwapApplicants &&
          <Menu.Item>
            <a href="#">Swap Applicants</a>
          </Menu.Item>
      }
      {
        actionPermission.canAddCoapplicant &&
          <Menu.Item>
            <Link to={`/applications/${record.id}/co-applicant`}>Add Co-applicant</Link>
          </Menu.Item>
      }
      {
        !actionPermission.expired &&
          <Menu.Item>
            <Link to={`/applications/${record.id}/attachments`}>Add Attachment</Link>
          </Menu.Item>
      }
      {
        actionPermission.canChangeBikes &&
          <>
            <Menu.Item>
              <a href="#">Bike Change</a>
            </Menu.Item>
            <Menu.Item>
              <a href="#">Change Tax Jurisdiction</a>
            </Menu.Item>
            <Menu.Item>
              <a href="#">Change Mileage</a>
            </Menu.Item>
          </>
      }
      {
        actionPermission.canRequestLeaseDocuments &&
          <Menu.Item>
            <a href="#">Request Lease Documents</a>
          </Menu.Item>
      }
      {
        actionPermission.canRemoveCoapplicant &&
          <Menu.Item>
            <a href="#">Remove Co-applicant</a>
          </Menu.Item>
      }
      {
        actionPermission.canSubmitBankInfo &&
          <Menu.Item>
            <Link to={`/applications/${record.id}/banking-information`}>Submit Bank Information</Link>
          </Menu.Item>
      }
    </Menu>
  )
}

function ArchivedApplicationList() {

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Data[] | any>([])

  const [paginationProps, setPaginationProps] = useState<object>({ total: 0 })
  const [paginationData, setPaginationData] = useState<object>({})

  const onPaginationChange = (page: any, pageSize: any) => {
    setPaginationData({
      page: page,
      pageSize: pageSize,
    })
  }

  const filterParams = () => {
    return 
  }

  const paginationParams = () => {
    if (paginationData && Object.keys(paginationData).length > 0) {
      return { pagination: { ...paginationData } }
    } else {
      return {}
    }
  }

  const getArchivedApplications = async () => {
    if (!loading) { setLoading(true) }

    try {
      await network.POST(`/api/v1/dealers/applications`, {
        filter: { archived: true },
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

  useEffect(() => {
    getArchivedApplications()
  },[paginationData]);

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(val) => val.id}
        pagination={{
          onChange: onPaginationChange,
          pageSizeOptions: ["10", "20", "50"],
          ...paginationProps,
        }}
        size='small'
        scroll={{ y: 375 }}
        className='table-wrapper'
      />
    </Spin>
  )
}

export default ArchivedApplicationList
