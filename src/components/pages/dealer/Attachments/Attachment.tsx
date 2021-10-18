import React, {useState} from 'react';
import { Typography } from 'antd';
import { Card, Row, Col, Layout, Form, Input } from 'antd';
import { MainHeader} from '../../../layouts'
import { AttachmentSider } from '../../../layouts/AttachmentSider';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import '../../../layouts/styles/Attachment.css'



const Attachments = () => {
  const {Title}  = Typography
    const {TextArea} = Input;
    const { Content } = Layout;
    const { Dragger } = Upload;
    const [fileName, setFileName] = useState<Array<string>>([]);
    const [notes, setNotes] = useState<string>();
    const [download, setDownload] = useState<string>();
    
    
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.filestackapi.com/api/store/S3?key=AvdxGJOAWQkO8O8OKYlUbz',
        
        onChange(info:any) {
          const { status } = info.file;
          if (status === 'done') {
            setFileName([...fileName, info.file.name]);
            setNotes('sample notes');
            setDownload('sample download link');
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        }
      };

    const handleNotes = () =>{
    
    }
    
    return (
        <> 
            <MainHeader />
            <Layout>
                <AttachmentSider activeKey="attachments"/>
                <Layout>
                    <Content id='main-content'>
                      <Row>
                        <div className="attachment-container">
                            <Card type="inner" title="Add Attachments">
                                <Col span={11}>
                                  <Dragger {...props}>
                                      <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                      </p>
                                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                      <p className="ant-upload-hint">
                                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                        band files
                                      </p>
                                  </Dragger>
                                </Col>
                                <Col span={7} className="additional-info">
                                  <Form.Item label="Description" />
                                  <Input placeholder="Large Input" />
                                  <Form.Item label="Notes" />
                                  <TextArea onChange={handleNotes} placeholder="text Area Placeholder" rows={1} />
                                </Col>
                            </Card>
                        </div>

                        <div className="attachment-container container-below">
                            <Card type="inner" title="Add Attachments">
                              <Row className="file-detail-info">
                                <Col>
                                 <Title level={5}>Filename</Title>
                                 {fileName.map(filename=> <p>{filename}</p>)}
                                </Col>
                                <Col>
                                  <Title level={5}>Notes</Title>
                                    <p>{notes}</p>
                                </Col>
                                <Col>
                                  <Title level={5}>Download Link</Title>
                                    <p>{download}</p>
                                </Col>
                              </Row>
                            </Card>
                        </div>
                      </Row>
                    </Content>
                </Layout>  
            </Layout> 
        </>
    )
   
}

export default Attachments;
