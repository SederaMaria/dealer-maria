import React, {useContext} from 'react'
import { Avatar, Col, Layout, Row, Popover } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

import { UserDataContext } from "../../contexts/UserDataContext";

import logo from '../../assets/speed-leasing.png';
import './styles/MainHeader.css'

const { Header } = Layout;

const AvatarContent = (
  <div>
    <a href={`/logout`}> Logout </a>
  </div>
);

function MainHeader() {

  const {fullName} = useContext(UserDataContext);

    return (
        <Header className="main-header-layout" id='main-menu'>
        <Row>
          <Col flex='1 1 200px'>          
            <div className="logo" >
              <img className="logo-img" src={logo} alt="speedleasing"/>
            </ div>
          </Col>
          <Col flex='0 1 300px'>
            <span style={{float: 'right', color: `white`}}>
              <Popover placement="bottomRight" content={AvatarContent} trigger="click">
                  <Avatar size={35} icon={<UserOutlined /> } className="ant-avatar-icon"/> 
                  <span style={{padding: `0 5px`}} > {` ${fullName} `} </span> 
                  <DownOutlined /> 
              </Popover>
            </span>
          </Col>
        </Row>
      </Header>
    )
}

export default MainHeader
