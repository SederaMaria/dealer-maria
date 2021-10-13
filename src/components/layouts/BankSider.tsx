import React from 'react'
import { Layout, Menu } from "antd";
import { Link } from 'react-router-dom';
import { SiderProps } from './props';
import { BankOutlined } from '@ant-design/icons';

import './styles/MainSider.css';

const { Sider } = Layout;

interface Props {
    activeKey: string | undefined;
  }

export const BankSider: React.FC<Props> = ({activeKey}: Props) => {
    return (
        <Sider {...SiderProps as object} >
          <Menu
            defaultSelectedKeys={[`${activeKey}`]}
          >
            <Menu.Item key="applications/:id/banking-information">
                <Link to={`/applications/:id/banking-information`}><BankOutlined /> Banking</Link>
            </Menu.Item>

          </Menu>
        </Sider>
    )
}
