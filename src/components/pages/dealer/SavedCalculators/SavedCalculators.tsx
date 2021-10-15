import React from 'react';
import { Row, Col, Layout } from 'antd';
import SavedApplicationList from './SavedApplicationList';
import {
    MainHeader,
    MainSider,
    MainBreadcrumb
} from '../../../layouts';

const { Content } = Layout;

function SavedCalculators() {
    return (
        <div>
            <Layout>
                <MainHeader />
                <Layout id="#dealership-edit">
                    <MainSider activeKey="saved-calculators" />
                    <Layout id="content-area-layout">
                        <MainBreadcrumb
                            items={[
                                { text: "Saved Calculators", link_type: "linkto", link: "/saved-calculators" }
                            ]}
                        />
                        <Content id="main-content">
                            <Row gutter={[0, 24]} >
                                <Col span={24} >
                                    <SavedApplicationList />
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    )
}

export default SavedCalculators
