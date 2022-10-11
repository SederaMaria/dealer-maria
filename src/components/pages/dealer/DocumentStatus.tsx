import React from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import ArticleIcon from '@mui/icons-material/Article';
import Chip from '@mui/material/Chip';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';


export default function DocumentStatus(props:any) {

  const {params} = props;

  if (params.row.documentStatus == "Funding Approved") {
    return <Chip variant="outlined" color="success" icon={<CheckCircleOutlineIcon style={{ color: "green", fontSize: "14px" }} />} label="Funding Approved" />
  }
  if (params.row.documentStatus == "Funding Delay") {
    return <Chip variant="outlined" color="secondary" icon={<AssignmentLateIcon style={{ color: "#9c27b0", fontSize: "14px" }} />} label="Funding Delay" />;
  }
  if (params.row.documentStatus == "Funded") {
    return <Chip variant="outlined" color="info" icon={<CheckCircleOutlineIcon style={{ color: "blue", fontSize: "14px" }} />} label="Funded" />;
  }
  if (params.row.documentStatus == "Canceled") {
    return <Chip variant="outlined" color="error" icon={<CancelIcon style={{ color: "red", fontSize: "14px" }} />} label="Canceled" />;
  }
  if (params.row.documentStatus == "Lease Package Received") {
    return <Chip variant="outlined" color="primary" icon={<CheckCircleOutlineIcon style={{ color: "blue", fontSize: "14px" }} />} label="Lease Package Received" />;
  }
  if (params.row.documentStatus == "Documents Issued") {
    return <Chip variant="outlined" color="primary" icon={<ArticleIcon style={{ color: "blue", fontSize: "14px" }} />} label="Documents Issued" />;
  }
  if (params.row.documentStatus == "Documents Requested") {
    return <Chip variant="outlined" color="primary" icon={<ArticleIcon style={{ color: "blue", fontSize: "14px" }} />} label="Documents Requested" />;
  }
  if (params.row.documentStatus == "No Documents") {
    return <Chip variant="outlined" color="error" icon={<HourglassEmptyIcon style={{ color: "red", fontSize: "14px" }} />} label="No Documents" />;
  }
  return <></>
}