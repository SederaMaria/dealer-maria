import React, { useState, useEffect } from 'react';
import { Spin } from "antd";
import BankingInformation from './BankingInformation';
import { logger, network } from '../../../../utils';

const BankingInformationRenderer = (props:any) => {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    const [data, setData] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)


    useEffect(() => {
        getApplicationDetails();
      },[]);
      
      const getApplicationDetails = async () => {
        if (!loading) {
          setLoading(true)
        }
        try {
            let data = await network.GET(`/api/v1/dealers/${leaseApplicationId}/banking-information`)
            console.log(data.data)
            setData(data.data)
        } catch (e) {
            setLoading(false)
            logger.error("Error fetching Applicatins", e);
        }
        setLoading(false)
      }


    return data ? (
        <Spin 
        spinning={loading}
        size='large'
        tip='Loading...'
        >
            <BankingInformation leaseApplicationId={leaseApplicationId} data={data} />
        </Spin>
    ) : null
}
export default BankingInformationRenderer