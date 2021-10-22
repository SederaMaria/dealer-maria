import { AnyTxtRecord } from 'dns';
import React from 'react';
import BankingInformation from './BankInfo/BankingInformation';

const BankInfoRenderer = (props:any) => {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    return (
        <div>
            <BankingInformation leaseApplicationId={leaseApplicationId} />
        </div>
    )
}
export default BankInfoRenderer