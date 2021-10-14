import React, { useState, useEffect } from 'react'
import { Table, Spin, Menu, Dropdown, Button } from 'antd';
import {DownOutlined} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { logger, network } from '../../../../utils';

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
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render(text, record, index) {
          return (
          <Dropdown overlay={menu(record.actionPermission)} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              <Button>Action <DownOutlined style={{marginLeft: 5, marginRight: -8, padding: 0}}/> </Button>
            </a>
          </Dropdown>
          )
      }

    },
  ];

const menu = (actionPermission: ActionPermission) => {
  let paymentCalcNode;

  if (actionPermission.canOpenPaymentCalculator) {
    paymentCalcNode = <a href="#">Open Payment Calculator</a>;
  } else if (actionPermission.canChangeBikes) {
    paymentCalcNode = <a href="#">Open Payment Calculator</a>;
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
            <a href="#">View Credit Application</a>
        }
      </Menu.Item>
      {
        !actionPermission.submitted &&
          <Menu.Item>
            <a href="#">Submit to Speed Leasing</a>
          </Menu.Item>
      }
      {
        actionPermission.canSwapApplicants &&
          <Menu.Item>
            <a href="#">Swap Applicants</a>
          </Menu.Item>
      }
      {
        actionPermission.canAddCoapplicant &&
          <Menu.Item>
            <a href="#">Add Co-applicant</a>
          </Menu.Item>
      }
      <Menu.Item>
        <a href="#">View / Add References</a>
      </Menu.Item>
      {
        !actionPermission.expired &&
          <Menu.Item>
            <a href="#">Add Attachment</a>
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
            <a href="#">Submit Bank Information</a>
          </Menu.Item>
      }
    </Menu>
  )
}

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
        <Table columns={columns} dataSource={data} rowKey={(val) => val.id} />
      </Spin>
    )
}

export default ApplicationList
