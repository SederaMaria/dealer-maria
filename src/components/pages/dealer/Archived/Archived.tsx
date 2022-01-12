import React from 'react';
import { Row, Col, Layout } from 'antd';
import ArchivedApplicationList from './ArchivedApplicationList';
import {
    MainHeader,
    MainSider,
    MainBreadcrumb,
} from '../../../layouts';

const { Content } = Layout;

function Archived() {
  return (
    <div>
      <Layout>
        <MainHeader />
        <Layout>
          <MainSider activeKey="archived-applications" />
          <Layout id="content-area-layout">
            <MainBreadcrumb
              items={[
                { text: "Archived", link_type: "linkto", link: "/archived-applications" }
              ]}
            />
            <Content id="main-content">
              <Row gutter={[0, 24]}>
                <Col span={24}>
                  <ArchivedApplicationList />
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default Archived
