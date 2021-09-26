import React from 'react'
import { Button, Typography } from "antd";

const { Title } = Typography;

interface Props {
    setStep: React.Dispatch<React.SetStateAction<string>>,
}

export const Summary: React.FC<Props> = ({setStep}: Props) => {
    return (
        <div style={{ margin: `20px 100px` }}>
            <div style={{ textAlign: `center`,  marginBottom: 20}}>
                <Title level={2}> Summary </Title>
                <p> Summery here soon</p>
            </div>

            <div style={{ marginTop: 20, textAlign: `center`}}>
                <Button style={{ marginRight: 10 }} type="primary" onClick={() => { setStep('co-applicant') } } >Prev</Button>
            </div>


        </div>
    )
}

export default Summary
