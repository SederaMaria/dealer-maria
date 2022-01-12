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
