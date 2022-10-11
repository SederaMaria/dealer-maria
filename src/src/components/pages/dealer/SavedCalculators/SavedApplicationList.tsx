import React, { useState, useEffect } from 'react'
import { Table, Spin, Menu, Dropdown, Button } from 'antd';
import {DownOutlined} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { logger, network } from '../../../../utils';

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
    render(val) {
      return (
        <a href="#"> {val} </a>
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
  {
    title: '',
    dataIndex: '',
    key: 'x',
    render() {
      return (
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            <Button>Action <DownOutlined style={{marginLeft: 5, marginRight: -8, padding: 0}}/> </Button>
          </a>
        </Dropdown>
      )
    }

  },
]

const menu = (
  <Menu>
    <Menu.Item>
      <a href="#">View Payment Calculator</a>
    </Menu.Item>
    <Menu.Item>
      <a href="#">View Credit Application</a>
    </Menu.Item>
    <Menu.Item>
      <a href="#">View / Add References</a>
    </Menu.Item>
    <Menu.Item>
      <a href="#">Submit Bank Information</a>
    </Menu.Item>
  </Menu>
)

function SavedApplicationList() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Data[] | any>([])

  useEffect(() => {
    // Fetch data
    setLoading(false)
  },[]);

  return (
    <Spin spinning={loading}>
      <Table columns={columns} dataSource={data} rowKey={(val) => val.id} />
    </Spin>
  )
}

export default SavedApplicationList
