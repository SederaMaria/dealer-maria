import React from 'react'
import { Avatar, Col, Layout, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import logo from '../../assets/speed-leasing.png';
import './styles/MainHeader.css'

const { Header } = Layout;


function MainHeader() {
    return (
        <Header className="main-header-layout" id='main-menu'>
        <Row>
          <Col flex='1 1 200px'>          
            <div className="logo" >
              <img className="logo-img" src={logo} alt="speedleasing"/>
            </ div>
          </Col>
          <Col flex='0 1 100px'>
            <span style={{float: 'right'}}>
                <Avatar size="large" icon={<UserOutlined />} className="ant-avatar-icon"/>
            </span>
          </Col>
        </Row>
      </Header>
    )
}

export default MainHeader
