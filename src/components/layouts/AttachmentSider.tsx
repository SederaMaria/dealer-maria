import React from 'react'
import { Layout, Menu } from "antd";
import { Link } from 'react-router-dom';
import { SiderProps } from './props';
import { PaperClipOutlined } from '@ant-design/icons';

import './styles/MainSider.css';

const { Sider } = Layout;

interface Props {
    activeKey: string | undefined;
  }

export const AttachmentSider: React.FC<Props> = ({activeKey}: Props) => {
  const id = '123'
    return (
        <Sider {...SiderProps as object} >
          <Menu
            defaultSelectedKeys={[`${activeKey}`]}
          >
            <Menu.Item key="banking-information">
                <Link to={`/applications/${id}/attachments`}><PaperClipOutlined /> Attachments</Link>
            </Menu.Item>

          </Menu>
        </Sider>
    )
}
