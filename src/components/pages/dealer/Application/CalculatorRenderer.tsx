import React, { useState, useEffect } from 'react'
import { Spin } from "antd";
import { Calculator } from '.'
import { logger, network } from '../../../../utils';

function CalculatorRenderer(props: any) {
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
            let data = await network.GET(`/api/v1/dealers/get-details?id=${leaseApplicationId}`)
            console.log(data.data.data.leaseApplication)
            setData(data.data.data.leaseApplication)
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
            <Calculator data={data}/>
        </Spin>
    ) : null ;
}

export default CalculatorRenderer
