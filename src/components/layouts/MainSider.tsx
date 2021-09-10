import React from 'react'
import { Layout, Menu } from "antd";
import { Link } from 'react-router-dom';
import { SiderProps } from './props'
import './styles/MainSider.css';

const { Sider } = Layout;

interface Props {
    activeKey: string | undefined;
  }

export const MainSider: React.FC<Props> = ({activeKey}: Props) => {
    return (
        <Sider {...SiderProps as object} >
          <Menu
            defaultSelectedKeys={[`${activeKey}`]}
          >
            <Menu.Item key="home">
            <Link to={`/home`}>Home</Link>
            </Menu.Item>

            <Menu.Item key="new-application">
                <Link to={`/new-application`}>New Application</Link>
            </Menu.Item>

            <Menu.Item key="saved-calculators">
                <Link to={`/saved-calculators`}>Saved Calculators</Link>
            </Menu.Item>

          </Menu>
        </Sider>
    )
}
