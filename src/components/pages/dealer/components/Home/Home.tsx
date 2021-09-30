import React from 'react'
import { Row, Col, Layout } from 'antd';
import ApplicationList from "./ApplicationList";
import { 
    MainHeader, 
    MainSider,
    MainBreadcrumb 
} from '../../../../layouts'

const { Content } = Layout;

function Home() {
    return (
        <div>
            <Layout>
                <MainHeader />
                <Layout id='#dealership-edit'>
                    <MainSider activeKey="home" />
                <Layout id='content-area-layout'>
                    <MainBreadcrumb items={[
                        { text: "Home", link_type: "linkto", link: "/home" }
                    ]}
                    />

                    <Content id='main-content'>
                    <Row gutter={[0, 24]} >
                        <Col span={24} >
                        <ApplicationList />
                        </Col>
                    </Row>
                    </Content>
                </Layout>
                </Layout>
            </Layout>
        </div>
    )
}

export default Home
