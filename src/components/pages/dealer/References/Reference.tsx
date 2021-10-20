import React, { useState } from 'react'
import { 
    Row, 
    Col, 
    Layout, 
    Typography, 
    Card,
    Spin 
} from 'antd';
import { MainHeader} from '../../../layouts';
// import { ReferenceSider } from '../../../layouts/ReferenceSider';

function Reference () {
    return (
        <>
            <MainHeader />
            <Layout>
                {/* <ReferenceSider activeKey="attachments"/> */}
            </Layout>
        </>


    )

}

export default Reference