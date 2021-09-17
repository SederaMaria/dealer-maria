import React from 'react'
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface Applications {
    key: number;
    name: string;
  }
  interface Datas {
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
      dataIndex: 'co-applicant',
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

  const data: any = [
    {
      applicationIdentifier: "20009280003",
      applicant: 'Alvin Testco',
      coApplicant: '',
      modelAndYear: '2013 FLHX Street Glide',
      creditStatus: 'Awaiting Credit Decision',
      documentStatus: 'No Documents',
      daysSubmitted: '1',
      lastUpdated: 'Sept 28, 2020 at 11:28 a.m EDT',
    },
    {
      applicationIdentifier: "20009280003",
      applicant: 'Debbie Delinquent',
      coApplicant: '',
      modelAndYear: '2018 XL883L',
      creditStatus: 'Approved',
      documentStatus: 'Funded',
      daysSubmitted: '5',
      lastUpdated: 'Sept 24, 2020 at 9:24 am EDT',
    },
    {
      applicationIdentifier: "20009280003",
      applicant: 'Mark S. Credco',
      coApplicant: 'Deborah Credco',
      modelAndYear: '2017 XG750A Street Rod',
      creditStatus: 'Approved with Contingencies',
      documentStatus: 'No Documents',
      daysSubmitted: '15',
      lastUpdated: 'Sep 22, 2020 at 12:45 p.m EDT',
    },
  ];





function ApplicationList() {
    return (
        <Table columns={columns} dataSource={data} />
    )
}

export default ApplicationList
