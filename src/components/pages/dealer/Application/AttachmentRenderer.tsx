import React from 'react';
import Attachments from './Attachment';

const AttachmentRenderer = (props:any) => {
    const leaseApplicationId: string = `${props.match.params.leaseApplicationId}`
    return (
        <div>
            <Attachments leaseApplicationId={leaseApplicationId} />
        </div>
    )
}
export default AttachmentRenderer;