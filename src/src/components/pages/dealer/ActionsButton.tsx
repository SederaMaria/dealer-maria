import React, {useState} from 'react'
import { Button,styled, alpha, Menu, MenuItem,  MenuProps} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArticleIcon from '@mui/icons-material/Article';
import PreviewIcon from '@mui/icons-material/Preview';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddIcon from '@mui/icons-material/Add';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CalculateIcon from '@mui/icons-material/Calculate';
import { Link } from "react-router-dom";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
      }}
      transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
      }}
      {...props}
  />

))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 5,
    minWidth: 180,
    boxShadow: '0px 0px 2px 0px #d9d9d9',
    '& .MuiMenu-list': {
       'a': {
          color: theme.palette.text.secondary,
          textDecoration:'none'
       }
    },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 16,
          color: theme.palette.text.secondary,
          transition: "color 1s",
          position: 'relative',
          top: 3
        },
        '&:active': {
          backgroundColor: alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity,
          ),
        },
        '&:hover': {
          backgroundColor: "#cdc9c933",
          color: "#e93b1b",
          lineHeight: 1.5,
          textDecoration: 'underline',
          textUnderlineOffset: '8px',
          textDecorationcolor: '#e93b1b',
          textDecorationThickness: "2px",
          fontWeight: "500"
        }
      },
  },

}));

function ActionsButton(params:any, archiveApplication:any) {
  
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
  
    const handleDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleDropdownClose = () => {
      setAnchorEl(null);
    };
  
    let paymentCalcNode;

    if (params.params.actionPermission.canEditPaymentCalculator) {
      
      paymentCalcNode = (
        <Link className='MuiMenuItem-root' target="_blank"
          to={`/applications/${params.params.id}/calculators/:calculatorID/calculator`}
        >
          <EditIcon sx={{ marginRight: 1 }} />
           Edit Payment Calculator
        </Link>
      );
     

    } else if (params.params.actionPermission.canChangeBikes) {
      paymentCalcNode = (
        <Link className='MuiMenuItem-root' target="_blank"
          to={`/applications/${params.params.id}/calculators/:calculatorID/calculator`}
        >
          <CalculateIcon sx={{ marginRight: 1 }} />
          Open Payment Calculator
        </Link>
      );
      
    } else if(params.params.actionPermission.canOpenPaymentCalculator) {
      paymentCalcNode = paymentCalcNode = (
        <Link className='MuiMenuItem-root' target="_blank"
          to={`/applications/${params.params.id}/calculators/:calculatorID/calculator`}
        >
          <PreviewIcon sx={{ marginRight: 1 }} />
          View Payment Calculator
        </Link>
      );
    }
    
    return (
        <>
            <Button
                id={params.params.id}
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                onClick={handleDropdownClick}
                endIcon={<KeyboardArrowDownIcon />}
                size="small"
                >
                  Action
            </Button>

            <StyledMenu
                id={params.params.id}
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open} 
                onClose={handleDropdownClose}
                style={{
                    fontSize: 12,
                }}
                keepMounted
                >  
                <MenuItem>{paymentCalcNode}</MenuItem>
                
                {params.params.actionPermission.canEditCreditApplication && (
                  <MenuItem>
                    <Link className='MuiMenuItem-root' target="_blank"
                      to={`/applications/${params.params.id}/calculators/:leaseApplicationID/bike`}
                    >
                    <ArticleIcon sx={{ marginRight: 1}} />
                   Edit Credit Application
                  </Link>
                  </MenuItem>
                )}
                
                {params.params.actionPermission.canOpenCreditApplication && (
                   <MenuItem>
                      <Link className='MuiMenuItem-root' target="_blank"
                       to={`/applications/${params.params.id}/summary`}
                      >
                         <PreviewIcon sx={{ marginRight: 1 }} />
                         View Credit Application
                      </Link>
                  </MenuItem>
                )}
                
                {params.params.actionPermission.canSwapApplicants && (
                  <MenuItem>
                    <SwapHorizIcon sx={{ marginRight: 1 }} />
                    <a href='#' className='MuiMenuItem-root' target="_blank">Swap Applicants</a>
                  </MenuItem>
                )}
                
                {params.params.actionPermission.canAddCoapplicant && (
                  <MenuItem>
                    <Link className='MuiMenuItem-root' to={`/applications/${params.params.id}/co-applicant`} target="_blank">
                      <AddIcon sx={{ marginRight: 1 }} />
                      Add Co-applicant
                    </Link>
                  </MenuItem>
                )}
                
                {!params.params.actionPermission.expired && (
                  <MenuItem>
                    <Link className='MuiMenuItem-root' to={`/applications/${params.params.id}/attachments`} target="_blank">
                    <AttachmentIcon sx={{ marginRight: 1 }}  />
                      Add Attachment
                    </Link>
                  </MenuItem>
                )}

                {params.params.actionPermission.canRemoveCoapplicant && (
                  <MenuItem>
                    <DeleteIcon sx={{ marginRight: 1 }} /> 
                    <a className='MuiMenuItem-root' href='#' target="_blank">Remove Co-applicant</a>
                  </MenuItem>
                )}
                {params.params.actionPermission.canSubmitBankInfo && (
                  <MenuItem>
                    <Link className='MuiMenuItem-root' to={`/applications/${params.params.id}/banking-information`} target="_blank">
                    <PublishIcon sx={{ marginRight: 1 }} />
                      Submit Bank Information
                    </Link>
                  </MenuItem>
                )}
                {params.params.actionPermission.canArchive && (
                  <MenuItem>
                    <a
                      href='#'
                      onClick={(event: any) => archiveApplication(event, params.row.id)}
                      className='MuiMenuItem-root'
                      target="_blank"
                    >
                      <ArchiveIcon sx={{ marginRight: 1 }} />
                      Archive Application
                    </a>
                  </MenuItem>
                )}
            </StyledMenu>
        </>
    )
}
export default ActionsButton
