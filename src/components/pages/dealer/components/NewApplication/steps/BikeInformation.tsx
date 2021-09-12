import React from 'react'
import { Row, Col, Card, Form, Select, Typography, Layout } from "antd";
const { Title } = Typography;
const { Content } = Layout;

function BikeInformation() {
    return (
        <div>
            
            <Row gutter={[16, 16]}>
                    <Col span={24} className="cca-center-text">
                        <Title level={2}> Bike Information </Title>
                    </Col>
                </Row>
            
                <Content className="content-1">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8}></Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                            <Card>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="New/Used" 
                                        name={['leaseCalculatorAttributes', 'newUsed']} 
                                        hasFeedback
                                        rules={[{ required: true, message: 'New/Used is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="New/Used" 
                                                // onSelect={handleNewUsedStateChange} 
                                                // onBlur={hideBikeSelectOptions}
                                                >
                                                    {/* <Option key="1" value="New">New</Option>
                                                    <Option key="2" value="Used">Used</Option> */}
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Make"
                                        name={['leaseCalculatorAttributes', 'assetMake']} 
                                        hasFeedback
                                        rules={[{ required: true, message: 'Make is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="Make" 
                                                // {...showMakeState}
                                                // onChange={handleMakes}
                                                // onSelect={handleMakesStateChange}
                                                // onBlur={hideBikeSelectOptions}
                                                >
                                                {/* {
                                                    makesOptions && makesOptions.map(({value, label}, index) => {
                                                    return <Option key={index} value={`${value}`}>{label}</Option>
                                                    })
                                                } */}
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Year" 
                                        name={['leaseCalculatorAttributes', 'assetYear']} 
                                        hasFeedback
                                        rules={[{ required: true, message: 'Year is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="Year" 
                                                // {...showYearState}
                                                // onChange={handleYear}
                                                // onSelect={handleYearStateChange}
                                                // onBlur={hideBikeSelectOptions}
                                                >
                                                    {/* {
                                                    yearsOptions && yearsOptions.map(({value, label}, index) => {
                                                    return <Option key={index} value={`${value}`}>{label}</Option>
                                                    })
                                                } */}
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Model" 
                                        name={['leaseCalculatorAttributes', 'assetModel']} 
                                        hasFeedback
                                        rules={[{ required: true, message: 'Model is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="Model" 
                                                // {...showModelState}
                                                // onSelect={handleModelStateChange}
                                                // onBlur={hideBikeSelectOptions}
                                                >
                                                {/* {
                                                    modelsOptions && modelsOptions.map(({value, label}, index) => {
                                                    return <Option key={index} value={`${value}`}>{label}</Option>
                                                    })
                                                } */}
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Mileage Range" 
                                        name={['leaseCalculatorAttributes', 'mileageTier']} 
                                        hasFeedback
                                        rules={[{ required: true, message: 'Mileage Range is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="Mileage Range" 
                                                // {...showMileageRangeState}
                                                // onSelect={handleMileageRangeStateChange}
                                                // onBlur={hideBikeSelectOptions}
                                                >
                                                {/* {
                                                    mileageRangeOptions && mileageRangeOptions.map(({value, label}, index) => {
                                                    return <Option key={index} value={`${value}`}>{label}</Option>
                                                    })
                                                } */}
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col span={24}> 
                                        <Form.Item 
                                        label="Credit Tier" 
                                        hasFeedback
                                        name={['leaseCalculatorAttributes', 'creditTier']} 
                                        rules={[{ required: true, message: 'Credit Tier is required!' }]}
                                        >  
                                            <Select 
                                                showSearch 
                                                placeholder="Credit Tier" 
                                                // {...showCreditTierState}
                                                // onSelect={handleCreditTierStateChange}
                                                // onBlur={hideBikeSelectOptions}
                                                >
                                                {/* {
                                                    creditTierOptions && creditTierOptions.map(({value, label}, index) => {
                                                    return <Option key={index} value={`${value}`}>{label}</Option>
                                                    })
                                                } */}
                                            </Select>
                                        </Form.Item>
                                    </Col> 
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Content>

        </div>
    )
}

export default BikeInformation
