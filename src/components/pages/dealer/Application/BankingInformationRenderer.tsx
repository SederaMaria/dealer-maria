import React from 'react';
import BankingInformation from './BankingInformation';

const BankingInformationRenderer = (props:any) => {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    return (
        <div>
            <BankingInformation leaseApplicationId={leaseApplicationId} />
        </div>
    )
}
export default BankingInformationRenderer