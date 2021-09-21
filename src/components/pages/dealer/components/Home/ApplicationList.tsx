import React, { useState, useEffect } from 'react'
import { Table, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { logger, network } from '../../../../../utils';
interface Applications {
    key: number;
    name: string;
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
            <a href="#"> { val} </a>
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
  ];

function ApplicationList() {

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Data[] | any>([])

  useEffect(() => {
    getApplications();
  },[]);
  
  const getApplications = async () => {
    if (!loading) {
      setLoading(true)
    }
    try {
        let data = await network.GET('/api/v1/dealers/applications')
        setData(data.data.leaseApplication)
    } catch (e) {
      logger.error("Error fetching Applicatins", e);
    }
    setLoading(false)
  }

  
    return (
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={data} />
      </Spin>
    )
}

export default ApplicationList
