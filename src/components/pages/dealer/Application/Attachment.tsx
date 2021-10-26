import React, {useState} from 'react';
import { Card, Table, Layout, Form, Input, Upload, message } from 'antd';
import { MainHeader, MainBreadcrumb, AttachmentSider} from '../../../layouts';
import { InboxOutlined } from '@ant-design/icons';
import '../../../layouts/styles/Attachment.css'


interface Props {
  leaseApplicationId?: string | undefined
}

const Attachments: React.FC<Props> = ({leaseApplicationId}) => {
    const {TextArea} = Input;
    const { Content} = Layout;
    const { Dragger } = Upload;
    const [dataSource, setDataSource] = useState<Array<Object>>([
      {
        key: 0,
        filename: '',
        notes: '',
        download: ''
      }
    ])

    const layout = {
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,
      },
    };
    
    
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.filestackapi.com/api/store/S3?key=AvdxGJOAWQkO8O8OKYlUbz',
        
        onChange(info:any) {
          const { status } = info.file;
          if (status === 'done') {
            const key = 0;
            setDataSource([...dataSource, {
              key: key+1,
              filename: info.file.name,
              notes: "sample notes",
              download: 'sample download link'
            }])
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        }
    };

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
        dataIndex: 'download',
        key: 'download',
      },
    ]
    

    return (
        <> 
          <MainHeader />
          <Layout>
             <AttachmentSider activeKey="attachments"/>
             <Layout>
              <div className="attachment-breadcrumb">
                    <MainBreadcrumb
                                items={[
                                    { text: " Dealers", link_type: "linkto", link: "#" },
                                    { text: " Lease Application", link_type: "linkto", link: "#" },
                                    { text:  `${leaseApplicationId}`, link_type: "linkto", link: "#" },
                                    { text: " Attachments", link_type: "linkto", link: "#" },
                                ]}
                                />
              </div>
                <Content id='main-content'>
                  <Card type="inner" title="Add Attachments">
                    <Dragger {...props} id="upload-zone">
                      <div className="card-elements">
                        <div className="dragger">
                            <p className="ant-upload-drag-icon">
                              <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                              band files
                            </p>
                        </div>
                        <Form className="input" {...layout}>
                            <Form.Item label="Description" />
                            <Input placeholder="Large Input" />
                            <Form.Item label="Notes" />
                            <TextArea placeholder="text Area Placeholder" rows={1} />
                        </Form>
                      </div>
                    </Dragger>
                  </Card>
                  
                  <Card type="inner" title="Add Attachments" className="container-below">
                      <Table dataSource={dataSource} columns={columns} />
                  </Card>
                </Content>
             </Layout>
          </Layout>
        </>
    )
   
}

export default Attachments;
