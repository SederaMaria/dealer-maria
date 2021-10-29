import React, { useState } from 'react'
import {
    Row,
    Col,
    Layout,
    Card,
    Form,
    Input,
    Button,
    Table
} from 'antd';

import { MainHeader, MainBreadcrumb } from '../../../layouts';
import { ReferenceSider } from '../../../layouts/ReferenceSider';
import '../../../layouts/styles/Reference.css'
import MaskedInput from 'antd-mask-input'

const { Content } = Layout;

interface Applications {
    first_name: string;
    last_name: string;
    phone_number: number;
    city: string;
    state: string

}

const dataSource = [
    {
        first_name: 'Alvin',
        last_name: 'Testco',
        phone_number: 8042221111,
        city: '2013 FLHX Street Glide',
        state: 'State'
    },
    {
        first_name: 'Debbie',
        last_name: 'Delinquent',
        phone_number: 8042221111,
        city: '2018 XL883L',
        state: 'State'
    }

]

const columns = [
    {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name'
    },
    {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name'
    },
    {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number'
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    }
]

interface Props {
    leaseApplicationId?: string | undefined
}

export const Reference: React.FC<Props> = ({leaseApplicationId}) => {
    const inputState = useState({state:''})

    return (
        <>
            <MainHeader />
            <Layout>
                <ReferenceSider activeKey="references" />
                <Layout id='content-area-layout'>
                    <MainBreadcrumb items={
                        [
                            { text: "Dealers", link_type: "linkto", link: "/" },
                            { text: "Lease Application", link_type: "linkto", link: "/" },
                            // { text: `${appNumber || 'N/A'}`, link_type: "ahref", link: void(0) },
                            { text: `${leaseApplicationId}`, link_type: "ahref", link: `/applications/${leaseApplicationId}` },
                            // { text: "References", link_type: "linkto", link: `/applications/${appNumber }/references` }
                            { text: "References", link_type: "linkto", link: `/applications/${leaseApplicationId}/references` }
                        ]
                    } />
                    <Content id='main-content'>
                        <div className="reference-container">
                            <Card type="inner" title="Add Reference">
                                <Row className="largeInput">
                                    <Col span={3.5}>
                                        <Form.Item label="First Name">
                                            <Input placeholder="First Name" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={3.5}>
                                        <Form.Item label="Last Name">
                                            <Input placeholder="Last Name" />
                                        </Form.Item>

                                    </Col>

                                    <Col span={3.5}>
                                        <Form.Item label="Phone Number">
                                            <MaskedInput
                                                mask="(111) 111-1111"
                                                placeholder="Phone Number"
                                            />
                                        </Form.Item>

                                    </Col>

                                    <Col span={3.5}>
                                        <Form.Item label="City">
                                            <Input placeholder="City" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={3.5}>
                                        <Form.Item label="State">
                                            <MaskedInput 
                                                mask ="AA"
                                                placeholder="State"                             
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row className="create-reference">
                                    <Col>
                                        <Button id="create-reference" type="primary">Create Reference</Button>
                                    </Col>
                                </Row>

                            </Card>

                        </div>

                        <div className="reference-container">
                            <Card type="inner" title="References">
                                <Table
                                    dataSource={dataSource}
                                    columns={columns}
                                    pagination={false}
                                />;
                            </Card>

                        </div>
                    </Content>



                </Layout>
            </Layout>
        </>


    )

}

export default Reference