import React from 'react'
import { 
    Row, 
    Col, 
    Layout, 
    Typography, 
    Card 
} from 'antd';
import Icon from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { 
    MainHeader, 
    MainSider 
} from '../../../../layouts'
import { 
    MotorSvg, 
    DollarBillSvg
} from '../../../../../utils/Svg';
import '../styles/NewApplication.css'

const { Content } = Layout;
const { Title } = Typography;

function NewApplication() {
    return (
        <div>
            <Layout>
                <MainHeader />
                <Layout id='#dealership-edit'>
                    <MainSider activeKey="new-application" />
                    <Layout id='content-area-layout'>
                        <Content id='main-content'>
                        <Row gutter={[0, 24]} >
                            <Col span={24} >
                                <div className="elem-center" >
                                    <Title level={3}>New Lease Application</Title>
                                    <p> Let's get you on the road! Select an option below to get started </p>
                                    <div className="elem-center start-sec">
                                        <Link to={`/new-application/steps?step=bike`}>
                                            <Card className="start-sec-card">
                                                <Icon component={ MotorSvg } className="start-sec-card-icon"/>
                                                <Title level={4}>Start Application</Title>
                                                <p>Create a lease Application for a specific motorcycle.</p>
                                            </Card>
                                        </Link>
                                        <Link to={`/new-application/steps?step=calculator`}>
                                            <Card className="start-sec-card">
                                                <Icon component={ DollarBillSvg } className="start-sec-card-icon"/>
                                                <Title level={4}>Start Calculator</Title>
                                                <p>Select a bike and we'll show you the monthly payment amount.</p>
                                            </Card>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </div>
    )
}

export default NewApplication
