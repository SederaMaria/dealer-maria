import React from "react";
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import BackspaceIcon from '@mui/icons-material/Backspace';
import ApprovalIcon from '@mui/icons-material/Approval';
import CancelIcon from '@mui/icons-material/Cancel';
import ArticleIcon from '@mui/icons-material/Article';

export default function CreditStatus(props:any) {
    const { params } = props;
   
    if (params.row.creditStatus == "Approved") {
        return <Chip variant="outlined" color="success" icon={<CheckCircleOutlineIcon style={{ color: "green", fontSize: "14px" }} />} label="Approved" />
    }
    if (params.row.creditStatus == "Awaiting Credit Decision") {
        return <Chip variant="outlined" color="secondary" icon={<HourglassBottomIcon style={{ color: "#9c27b0", fontSize: "14px" }} />} label="Awaiting Credit Decision" />;
    }
    if (params.row.creditStatus == "Approved With Contingencies") {
        return <Chip variant="outlined" color="success" icon={<ApprovalIcon style={{ color: "green", fontSize: "14px" }} />} label="Approved With Contingencies" />;
    }

    if (params.row.creditStatus == "Unsubmitted") {
        return <Chip variant="outlined" color="primary" icon={<CancelIcon style={{ color: "blue", fontSize: "14px" }} />} label="Unsubmitted" />;
    }
    if (params.row.creditStatus == "Required Additional Information") {
        return <Chip variant="outlined" color="success" icon={<CheckCircleOutlineIcon style={{ color: "green", fontSize: "14px" }} />} label="Required More Information" />;
    }

    if (params.row.creditStatus == "Bike Change Request") {
        return <Chip variant="outlined" color="primary" icon={<ArticleIcon style={{ color: "blue", fontSize: "14px" }} />} label="Bike Change Request" />;
    }

    if (params.row.creditStatus == "Draft") {
        return <Chip variant="outlined" color="primary" icon={<ArticleIcon style={{ color: "blue", fontSize: "14px" }} />} label="Draft" />;
    }

    if (params.row.creditStatus == "Declined") {
        return <Chip variant="outlined" color="error" icon={<ThumbDownAltIcon style={{ color: "red", fontSize: "14px" }} />} label="Declined" />;
    }
    if (params.row.creditStatus == "Withdrawn") {
        return <Chip variant="outlined" color="error" icon={<BackspaceIcon style={{ color: "red", fontSize: "14px" }} />} label="Withdrawn" />;
    }
    return <></>
}