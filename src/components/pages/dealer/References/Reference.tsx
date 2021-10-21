import React, { useState } from 'react'
import { 
    Row, 
    Col, 
    Layout, 
    Typography, 
    Card,
    Spin 
} from 'antd';
import { MainHeader,} from '../../../layouts';
import { ReferenceSider } from '../../../layouts/ReferenceSider';
const { Content } = Layout;

const Reference = () => {
    return (
        <>
            <MainHeader />
            <Layout>
                <ReferenceSider activeKey="references"/>
                <Layout>
                    <Content id='main-content'>
                        
                    </Content>
                    
                </Layout>
            </Layout>
        </>


    )

}

export default Reference