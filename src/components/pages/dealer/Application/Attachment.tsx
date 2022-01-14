import React, { useState, useEffect } from 'react';
import { logger, network } from '../../../../utils';

import { Spin, Row, Col, Card, Table, Layout, Form, Input, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { MainHeader, MainBreadcrumb, AttachmentSider } from '../../../layouts';

import '../styles/Attachment.css';

const { Content } = Layout;
const { TextArea } = Input;
const { Dragger } = Upload;

const formLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

interface Props {
  leaseApplicationId?: string | undefined
}

interface DataSource {
  key: number,
  filename: string,
  notes: string,
  download_link: string
}

const columns = [
  {
    title: 'Filename',
    dataIndex: 'filename',
    key: 'filename',
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
  },
  {
    title: 'Download Link',
    dataIndex: 'download_link',
    key: 'download_link',
    render(val: string) {
      return <Button href={val} type="link" target="_blank"> Download </Button>
    }
  },
]

const Attachments: React.FC<Props> = ({ leaseApplicationId }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const [dataSource, setDataSource] = useState<Array<DataSource>>([])

  const [applicationIdentifier, setApplicationIdentifier] = useState<string>(`${leaseApplicationId}`)

  const [form] = Form.useForm()
  const [uploadValidateStatus, setUploadValidateStatus] = useState<any>(undefined);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | undefined>(undefined);

  const getAttachments = async () => {
    try {
      await network.GET_WOPTS(`/api/v1/lease_application_attachments`, {
        params: {
          leaseApplicationId: leaseApplicationId,
        }
      }).then(response => {
        setDataSource(response.data.attachments)
        if (response.data.application_identifier) {
          setApplicationIdentifier(response.data.application_identifier)
        }
      }).catch(error => {
        logger.error("Error fetching Attachments", error)
      })
    } catch (e) {
      logger.error("Error fetching Attachments", e)
    }
  }

  const submitAttachment = async (values: any) => {
    if (!loading) { setLoading(true) }

    let formData = new FormData()

    formData.append("leaseApplicationId", `${leaseApplicationId}`)
    formData.append("upload", values.upload.fileList[0].originFileObj)
    if (values.description) { formData.append("description", values.description) }
    if (values.notes) { formData.append("notes", values.notes) }

    try {
      await network.POST(`/api/v1/lease_application_attachments`, formData).then(response => {
        form.resetFields()
        getAttachments()
        setLoading(false)
        message.success(response.data.message)
      }).catch(error => {
        logger.error("Error sending Attachment", error)
        setLoading(false)
      })
    } catch (e) {
      logger.error("Error sending Attachment", e)
      setLoading(false)
    }
  }

  const handleOnFinish = async (values: any) => {
    // WARNING: For some reason FormInstance method `resetFields` doesn't work with Dragger.
    // Thus, manual validation. Since there's only one field required, this will do
    if (values.upload.fileList && values.upload.fileList.length) {
      submitAttachment(values)
    }
  }

  // WARNING: `Upload`'s `onDrop` and `onRemove` events have conflict with `onChange`
  // Thus, we only use `onChange` to check if files were added / removed
  const handleDraggerOnChange = async (event: any) => {
    if (event.fileList && event.fileList.length) {
      setUploadValidateStatus(undefined)
      setUploadErrorMsg(undefined)
    } else {
      setUploadValidateStatus('error')
      setUploadErrorMsg('Please select a file to upload!')
    }
  }

  useEffect(() => {
    getAttachments()
  }, [])

  return (
    <div>
      <Layout>
        <MainHeader />
        <Layout>
          <AttachmentSider activeKey="attachments"/>
          <Layout id="content-area-layout">
            <MainBreadcrumb
              items={[
                  { text: " Home", link_type: "linkto", link: "/home" },
                  { text: " Lease Applications", link_type: "linkto", link: "/home" },
                  { text:  `${applicationIdentifier}`, link_type: "linkto", link: `/applications/${leaseApplicationId}/summary` },
                  { text: " Attachments", link_type: "linkto", link: "#" },
              ]}
            />
            <Content id="main-content">
              <Spin
                spinning={loading}
                size="large"
                tip="Loading..."
              >
                <Card type="inner" title="Add Attachment" className="card-form">
                  <Form
                    className="input"
                    form={form}
                    onFinish={handleOnFinish}
                    {...formLayout}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={24} lg={12}>
                        <Form.Item
                          name="upload"
                          rules={[{ required: true, message: 'Please select a file to upload!' }]}
                          validateStatus={uploadValidateStatus}
                          help={uploadErrorMsg}
                        >
                          <Dragger
                            id="upload-zone"
                            maxCount={1}
                            onChange={handleDraggerOnChange}
                            beforeUpload={() => false}
                          >
                            <div className="card-elements">
                              <div className="dragger">
                                <p className="ant-upload-drag-icon">
                                  <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                  Support for a single upload only. Strictly prohibit from uploading company data or other band files
                                </p>
                              </div>
                            </div>
                          </Dragger>
                        </Form.Item>
                      </Col>
                      <Col span={24} lg={12}>
                        <Form.Item
                          name="description"
                          label="Description"
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="notes"
                          label="Notes"
                        >
                          <TextArea rows={2} />
                        </Form.Item>
                        <Form.Item style={{ marginTop: '1em', textAlign: 'right' }}>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Spin>

              <Card type="inner" title="Attachments" className="card-list">
                <Table dataSource={dataSource} columns={columns} rowKey="id" />
              </Card>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )

}

export default Attachments;
