import React, { useState, useEffect } from 'react'
import { Spin } from "antd";
import { network, logger } from '../../../../utils';
import Reference from './Reference';

export const ReferenceRenderer = (props: any) => {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    const [data, setData] = useState<any>()
    const [loading, setLoading] = useState<boolean>()

    useEffect(() => {
        getReferenceDetails()
    }, []);

    const getReferenceDetails = async () => {
        if (!loading) {
            setLoading(true)
        }
        try {
            let referencesData = await network.GET(`/api/v1/dealers/${leaseApplicationId}/references`)
            console.log(referencesData)
            // setData(data)
        } catch (e) {
            setLoading(false)
            logger.error("Error fetching Applications", e)
        }
        setLoading(false)
    }


    return (
        <Spin
            spinning={loading}
            size='large'
            tip='Loading'
        >
            <Reference data={data} />
        </Spin>
    )
}

export default ReferenceRenderer