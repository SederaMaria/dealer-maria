import React, {useState, useEffect} from 'react';
import BankingInformation from './BankingInformation';
import { network, logger } from '../../../../utils';


const BankingInformationRenderer = (props:any) => {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    const [data, setData] = useState<any>('')

    const fetchPaymentData = async () => {
        try {
            let data = await network.GET(`/api/v1/dealers/${leaseApplicationId}/banking-information`)
            setData(data.data.payment)
            console.log(`data`, data)
          } catch (e) {
            logger.error("fetch banking information Error", e);
          }
    }

    useEffect(() => {
        fetchPaymentData()
    }, [])

    return (
        <div>
            <BankingInformation leaseApplicationId={leaseApplicationId} data={data} />
        </div>
    )
}
export default BankingInformationRenderer