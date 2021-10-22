import React from 'react'
import Reference from './Reference';

function ReferenceRenderer(props: any) {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    return (
        <div>
            <Reference />
        </div>
    )
}

export default ReferenceRenderer