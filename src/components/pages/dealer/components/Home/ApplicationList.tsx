import React from 'react'
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface Applications {
    key: number;
    name: string;
  }
  
  const columns: ColumnsType<Applications> = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
  ];


function ApplicationList() {
    return (
        <Table columns={columns} dataSource={[]} />
    )
}

export default ApplicationList
