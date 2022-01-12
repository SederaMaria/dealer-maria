import React, {useState} from 'react'
import { Layout, Menu, Button } from "antd";
import { Link } from 'react-router-dom';
import { SiderProps} from './props';
import { CollapseProps } from './props/collapseProps';

import { 
  HomeOutlined, 
  ProfileOutlined,
  CalculatorOutlined,
  MenuOutlined
 }
from '@ant-design/icons';
import './styles/MainSider.css';

const { Sider } = Layout;

interface Props {
    activeKey: string | undefined;
  }

export const MainSider: React.FC<Props> = ({activeKey}: Props) => {
  
  const [collapsed, setCollapsed]= useState(CollapseProps);
 
  const handleClick = () => {
    if(collapsed == CollapseProps) {
      setCollapsed(SiderProps)
    }else if(collapsed == SiderProps) {
      setCollapsed(CollapseProps)
    } 
  }

    return (
        <Sider {...collapsed as object}>
          <Button onClick={handleClick} className='collapseButton'>
            <MenuOutlined />
          </Button>
          <Menu
            defaultSelectedKeys={[`${activeKey}`]}
            mode="inline"
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to={`/home`}> Home</Link>
            </Menu.Item>
            <Menu.Item key="application" icon={<ProfileOutlined />}>
              <Link to={`/application`}> New Application</Link>
            </Menu.Item>
            <Menu.Item key="saved-calculators" icon={<CalculatorOutlined />}>
              <Link to={`/saved-calculators`}> Saved Calculators</Link>
            </Menu.Item>
          </Menu> 
        </Sider>
    )
}
