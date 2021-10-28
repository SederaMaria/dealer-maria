import React from 'react'
import Reference from './Reference';

const ReferenceRenderer = (props: any) => {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    return (
        <div>
            <Reference leaseApplicationId={leaseApplicationId} />
        </div>
    )
}
