import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Layout,
    Card,
    Form,
    Input,
    Button,
    Table,
    message
} from 'antd';

import { MainHeader, MainBreadcrumb } from '../../../layouts';
import { ReferenceSider } from '../../../layouts/ReferenceSider';
import '../../../layouts/styles/Reference.css'
import MaskedInput from 'antd-mask-input'
import { logger, network } from '../../../../utils';

const { Content } = Layout;

interface References {
    name: string;
    id: string | number;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    city: string;
    state: string

}


interface Props {
    data?: {
        references: References[];
    }
    leaseApplicationId: string | number;
}


export const Reference: React.FC<Props> = ({data, leaseApplicationId}: Props) => {


   console.log("sss") 
   console.log(data?.references) 
    const [referenceForm] = Form.useForm();

    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)
    const [hasSubmitError, setHasSubmitError] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName'
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName'
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
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

    const layout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    }

    const handleSubmit = async (values: any) => {
        values = { ...values };
        setDisableSubmitBtn(true)
        submitApplication(values)
    }

    const submitApplication = async (values: any) => {
        try {
           await network.POST(`/api/v1/dealers/applications/${leaseApplicationId}/references`, values);
           setHasSubmitError(false)
           setDisableSubmitBtn(true)
           setSubmitSuccess(true)
           message.success("Reference Saved")
           referenceForm.resetFields();
        } catch (e) {
            
          logger.error("Request Error", e);
          message.error("Error saving reference");
          setHasSubmitError(true)
          setDisableSubmitBtn(false)
        }
        setDisableSubmitBtn(false)
      }
    

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
                                <Form
                                    form={referenceForm}
                                    onFinish={handleSubmit}
                                    className="input" {...layout}
                                >
                                <Row gutter={14}>
                                <Col className= "column-width" xs={24} sm={16} md={4}> 
                                        <Form.Item label="First Name" name="firstName" className="label">
                                            <Input placeholder="First Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col className= "column-width" xs={24} sm={16} md={4}> 
                                        <Form.Item label="Last Name" name="lastName" className="label">
                                            <Input placeholder="Last Name" />
                                        </Form.Item>
                                    </Col>
                                    <Col className= "column-width" xs={24} sm={16} md={4}> 
                                        <Form.Item label="Phone Number" name="phoneNumber" className="label">
                                            <MaskedInput
                                                mask="(111) 111-1111"
                                                placeholder="Phone Number"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col className= "column-width" xs={24} sm={16} md={4}> 
                                        <Form.Item label="City" name="city" className="label">
                                            <Input placeholder="City" />
                                        </Form.Item>
                                    </Col>

                                    <Col className= "column-width" xs={24} sm={16} md={4}> 
                                        <Form.Item label="State" name="state" className="label">
                                            <MaskedInput 
                                                mask ="AA"
                                                placeholder="State"                             
                                            />
                                        </Form.Item>
                                    </Col>
                                    
                                </Row>

                                <Row className="create-reference">
                                    <Col>
                                        <Button type="primary" htmlType="submit" disabled={disableSubmitBtn}>Create Reference</Button>
                                    </Col>
                                </Row>
                                </Form>

                            </Card>

                        </div>

                        <div className="reference-container">
                            <Card type="inner" title="References">
                                <Table
                                    rowKey={(val) => val.id}
                                    dataSource={data?.references}
                                    columns={columns}
                                    pagination={false}
                                />
                            </Card>

                        </div>
                    </Content>



                </Layout>
            </Layout>
        </>


    )

}

export default Reference