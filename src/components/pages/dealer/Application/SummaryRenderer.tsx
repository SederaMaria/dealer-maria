import React, {useState, useEffect} from 'react'
import { Spin } from "antd";
import { logger, network } from '../../../../utils';
import Summary from './Summary'


function SummaryRenderer(props: any) {
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


    return (
        <Spin 
        spinning={loading}
        size='large'
        tip='Loading...'
        >
            <Summary data={data}/>
        </Spin>
    )
}

export default SummaryRenderer
