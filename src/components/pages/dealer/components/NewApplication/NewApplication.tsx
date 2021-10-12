import React, { useState } from 'react'
import { 
    Row, 
    Col, 
    Layout, 
    Typography, 
    Card,
    Spin 
} from 'antd';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { 
    MainHeader, 
    MainSider 
} from '../../../../layouts'
import { 
    logger, 
    network 
} from '../../../../../utils';
import { 
    MotorSvg, 
    DollarBillSvg
} from '../../../../../utils/Svg';
import '../styles/NewApplication.css'

const { Content } = Layout;
const { Title } = Typography;

function NewApplication() {
    const history = useHistory();
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const [loading, setLoading] = useState<boolean>(false);


    const handleNewCalculatorByBike = async () => {
        setLoading(true)
        try {
            await network.GET(`/api/v1/calculators/new`).then(response => {
                history.push(`/applications/${response.data.leaseApplicationId}/calculators/${response.data.leaseCalculatorId}?step=bike`)
            }).catch(error => {
                logger.error("handleNewCalculator Request Error", error);
            });
          } catch (e) {
            logger.error("Request Error", e);
          }
        setLoading(false)
    }


    const handleNewCalculator = async () => {
        setLoading(true)
        try {
            await network.GET(`/api/v1/calculators/new`).then(response => {
                history.push(`/applications/${response.data.leaseApplicationId}/calculators/${response.data.leaseCalculatorId}?step=calculator`)
            }).catch(error => {
                logger.error("handleNewCalculator Request Error", error);
            });
          } catch (e) {
            logger.error("Request Error", e);
          }
        setLoading(false)
    }


    return (
        <Spin 
        indicator={antIcon}
        spinning={loading}
        size='large'
        tip='Generating...'
         >
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
                                        {/* <Link to={`/new-application/steps?step=bike`}> */}
                                            <Card className="start-sec-card" onClick={handleNewCalculatorByBike}>
                                                <Icon component={ MotorSvg } className="start-sec-card-icon"/>
                                                <Title level={4}>Start Application</Title>
                                                <p>Create a lease Application for a specific motorcycle.</p>
                                            </Card>
                                        {/* </Link> */}
                                        {/* <Link to={`/new-application/steps?step=calculator`}> */}
                                            <Card className="start-sec-card" onClick={handleNewCalculator}>
                                                <Icon component={ DollarBillSvg } className="start-sec-card-icon"/>
                                                <Title level={4}>Start Calculator</Title>
                                                <p>Select a bike and we'll show you the monthly payment amount.</p>
                                            </Card>
                                        {/* </Link> */}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </Spin>
    )
}

export default NewApplication
