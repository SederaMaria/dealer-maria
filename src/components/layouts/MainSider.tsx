import React from 'react'
import { Layout, Menu } from "antd";
import { Link } from 'react-router-dom';
import { SiderProps } from './props';
import { HomeOutlined, ProfileOutlined, CalculatorOutlined } from '@ant-design/icons';

import './styles/MainSider.css';

const { Sider } = Layout;

interface Props {
    activeKey: string | undefined;
  }

export const MainSider: React.FC<Props> = ({activeKey}: Props) => {
    return (
        <Sider {...SiderProps as object}>
          <Menu
            defaultSelectedKeys={[`${activeKey}`]}
          >
            <Menu.Item key="home">
            <Link to={`/home`}><HomeOutlined /> Home</Link>
            </Menu.Item>

            <Menu.Item key="application">
                <Link to={`/application`}><ProfileOutlined /> New Application</Link>
            </Menu.Item>

            <Menu.Item key="saved-calculators">
                <Link to={`/saved-calculators`}><CalculatorOutlined /> Saved Calculators</Link>
            </Menu.Item>

          </Menu>
        </Sider>
    )
}
