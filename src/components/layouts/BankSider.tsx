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
  const id = '123'
    return (
        <Sider {...SiderProps as object} >
          <Menu
            defaultSelectedKeys={[`${activeKey}`]}
          >
            <Menu.Item key="banking-information">
                <Link id="banking-icon" to={`/applications/${id}/banking-information`}><BankOutlined /> Banking</Link>
            </Menu.Item>

          </Menu>
        </Sider>
    )
}
