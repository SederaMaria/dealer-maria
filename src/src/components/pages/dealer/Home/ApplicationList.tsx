import React, { useState, useEffect } from "react";
import {
  Table,
  Spin,
  // Menu,
  Dropdown,
  Button,
  Form,
  // Select,
  Drawer,
  Input,
  Row,
  Col,
  message,
  Tooltip,
  Statistic,
  Card,
  Progress,
  Typography
} from "antd";
import { Pie, RingProgress } from '@ant-design/plots';
import { DownOutlined, FilterOutlined, ShopOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-license-pro';
import {Box} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ActionsButton from "../ActionsButton";
import CreditStatus from "../CreditStatus";
import DocumentStatus from "../DocumentStatus";
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { logger, network } from "../../../../utils";
import "../styles/ApplicationList.css";
LicenseInfo.setLicenseKey('06c2f0cf50adbcfcc3f1fdcdf8402d39Tz00OTMwMCxFPTE2OTIzNzY1MTM3ODUsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

// const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

interface Applications {
  key: number;
  name: string;
  id: number;
  actionPermission: ActionPermission;
}

interface Data {
  applicationIdentifier: string;
  applicant: string;
  coApplicant: string;
  modelAndYear: string;
  creditStatus: string;
  documentStatus: string;
  daysSubmitted: string;
  lastUpdated: string;
}

interface statusData {
  approved: number;
  canceled: number;
  declined: number;
  documents_issued: number;
  documents_requested: number;
  funded: number;
  no_documents: number;
  submitted: number;
  unsubmitted: number;
  total: number;
}

interface ActionPermission {
  canAddCoapplicant: boolean;
  canChangeBikes: boolean;
  canOpenCreditApplication: boolean;
  canEditCreditApplication: boolean;
  canOpenPaymentCalculator: boolean;
  canEditPaymentCalculator: boolean;
  canRemoveCoapplicant: boolean;
  canRequestLeaseDocuments: boolean;
  canSubmitBankInfo: boolean;
  canSwapApplicants: boolean;
  expired: boolean;
  submitted: boolean;
  canArchive: boolean;
}

type StatesForSelect = [string, string];

const filterFormLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const cardStyle: React.CSSProperties = {
  margin: '0 10px 20px 10px',
  border: '1px solid lightgray',
}

const selectDropdownStyle: React.CSSProperties = {
  border: '1px solid lightgray'
}

function ApplicationList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data[] | any>([]);
  const [statusData, setStatusData] = useState<statusData | any>({});
  
  const [visibleDrawer, setDrawerVisible] = useState<boolean>(false);

  const [filterForm] = Form.useForm();
  const [filterOptionsLoading, setFilterOptionsLoading] = useState<boolean>(true);
  const currentYear = () => new Date().getFullYear();
  const [filterData, setFilterData] = useState<object>({time_range: currentYear()});

  const [creditStatusOptions, setCreditStatusOptions] = useState<
    Array<StatesForSelect> | Array<any>
  >([]);
  const [documentStatusOptions, setDocumentStatusOptions] = useState<
    Array<StatesForSelect> | Array<any>
  >([]);

  const [paginationProps, setPaginationProps] = useState<object>({ total: 0 });
  const [paginationData, setPaginationData] = useState<object>({});
  const { funded, approved, canceled, declinded, documents_issued, documents_requested, no_documents, unsubmitted } = statusData;
  const submitted = funded + approved + canceled + declinded;
  const [pageSize, setPageSize] = useState<number>(10);


  const donutStatus = [
    {
      type: 'Canceled',
      value: canceled,
    },
    {
      type: 'Declined',
      value: declinded,
    },
    {
      type: 'Unsubmitted',
      value: unsubmitted,
    },
  ];

  const pieStatus = [
    {
      type: 'No Documents',
      value: no_documents,
    },
    {
      type: 'Document Request',
      value: documents_requested,
    },
    {
      type: 'Document Issued',
      value: documents_issued,
    },
    {
      type: 'Funded',
      value: funded,
    },
    {
      type: 'Submitted',
      value: submitted,
    },
    {
      type: 'Approved',
      value: approved,
    },
  ];

  const donutConfig = {
    appendPadding: 1,
    data: donutStatus,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.4,
    style: {
      height: '200px'
    },
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
  };

  const pieConfig = {
    appendPadding: 1,
    data: pieStatus,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    startAngle: Math.PI,
    endAngle: Math.PI * 1.5,
    legend: {
      selected: {
        'Submitted': false,
        'Approved': false,
      }
    },
    style: {
      height: '200px'
    },
    label: {
      type: 'inner',
      offset: '-8%',
      content: '{value}',
      style: {
        fontSize: 12,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    pieStyle: {
      lineWidth: 0,
    },
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  // const menu = (actionPermission: ActionPermission, record: Applications) => {
  //   let paymentCalcNode;

  //   if (actionPermission.canEditPaymentCalculator) {
  //     paymentCalcNode = (
  //       <Link
  //         to={`/applications/${record.id}/calculators/:calculatorID/calculator`}
  //       >
  //         Edit Payment Calculator
  //       </Link>
  //     );
     

  //   } else if (actionPermission.canChangeBikes) {
  //     paymentCalcNode = (
  //       <Link
  //         to={`/applications/${record.id}/calculators/:calculatorID/calculator`}
  //       >
  //         Open Payment Calculator
  //       </Link>
  //     );
      
  //   } else if(actionPermission.canOpenPaymentCalculator) {
  //     paymentCalcNode = paymentCalcNode = (
  //       <Link
  //         to={`/applications/${record.id}/calculators/:calculatorID/calculator`}
  //       >
  //         View Payment Calculator
  //       </Link>
  //     );
     
  //   }
  //   return (
  //     <Menu>
  //       <MenuItem className='hovering'>{paymentCalcNode}</MenuItem>
  //       <MenuItem className='hovering'>
  //       {actionPermission.canEditCreditApplication && (
  //         <Link
  //          to={`/applications/${record.id}/calculators/:leaseApplicationID/bike`}
  //         >
  //          Edit Credit Application
  //         </Link>
  //       )}
  //       </MenuItem>
  //       <MenuItem className='hovering'>
  //       {actionPermission.canOpenCreditApplication && (
  //         <Link
  //          to={`/applications/${record.id}/summary`}
  //         >
  //           View Credit Application
  //         </Link>
  //       )}
  //       </MenuItem>
  //       {actionPermission.canSwapApplicants && (
  //         <MenuItem className='hovering'>
  //           <a href='#'>Swap Applicants</a>
  //         </MenuItem>
  //       )}
  //       {actionPermission.canAddCoapplicant && (
  //         <MenuItem className='hovering'>
  //           <Link to={`/applications/${record.id}/co-applicant`}>
  //             Add Co-applicant
  //           </Link>
  //         </MenuItem>
  //       )}
  //       {!actionPermission.expired && (
  //         <MenuItem className='hovering'>
  //           <Link to={`/applications/${record.id}/attachments`}>
  //             Add Attachment
  //           </Link>
  //         </MenuItem>
  //       )}
  //       {actionPermission.canChangeBikes && (
  //         <>
  //           {/* <Menu.Item className='hovering'>
  //             <a href='#'>Bike Change</a>
  //           </Menu.Item>

  //           <Menu.Item className='hovering'>
  //             <a href='#'>Change Tax Jurisdiction</a>
  //           </Menu.Item>
  //           <Menu.Item className='hovering'>
  //             <a href='#'>Change Mileage</a>
  //           </Menu.Item> */}
  //         </>
  //       )}
  //       {/* {actionPermission.canRequestLeaseDocuments && (
  //         <Menu.Item className='hovering'>
  //           <a href='#'>Request Lease Documents</a>
  //         </Menu.Item>
  //       )} */}
  //       {actionPermission.canRemoveCoapplicant && (
  //         <MenuItem className='hovering'>
  //           <a href='#'>Remove Co-applicant</a>
  //         </MenuItem>
  //       )}
  //       {actionPermission.canSubmitBankInfo && (
  //         <MenuItem className='hovering'>
  //           <Link to={`/applications/${record.id}/banking-information`}>
  //             Submit Bank Information
  //           </Link>
  //         </MenuItem>
  //       )}
  //       {actionPermission.canArchive && (
  //         <MenuItem className='hovering'>
  //           <a
  //             href='#'
  //             onClick={(event: any) => archiveApplication(event, record.id)}
  //           >
  //             Archive Application
  //           </a>
  //         </MenuItem>
  //       )}
  //     </Menu>
  //   );
  // };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onDrawerClose = () => {
    setDrawerVisible(false);
  };

  const onDrawerVisibleChange = (visible: boolean) => {
    if (visible) {
      if (
        creditStatusOptions.length === 0 &&
        documentStatusOptions.length === 0
      ) {
        getFilterOptions();
      }
    }
  };

  const onFilterReset = () => {
    filterForm.resetFields();
    setDrawerVisible(false);
    setFilterData({});
  };

  const onFilterSubmit = (values: any) => {
    setDrawerVisible(false);
    setFilterData(values);
  };

  const onPaginationChange = (page: any, pageSize: any) => {
    setPaginationData({
      page: page,
      pageSize: pageSize,
    });
  };

  const filterParams = () => {
    if (filterData && Object.keys(filterData).length > 0) {
      return { filter: { ...filterData } };
    } else {
      return {};
    }
  };

  const paginationParams = () => {
    if (paginationData && Object.keys(paginationData).length > 0) {
      return { pagination: { ...paginationData } };
    } else {
      return {};
    }
  };

  const getApplications = async () => {
    if (!loading) {
      setLoading(true);
    }

    try {
      await network
        .POST(`/api/v1/dealers/applications`, {
          ...filterParams(),
          ...paginationParams(),
        })
        .then((response) => {
          setData(response.data.data.leaseApplications);
          setStatusData(response.data.statusData);
          setPaginationProps({
            ...paginationProps,
            total: response.data.pagination.total,
          });
        })
        .catch((error) => {
          logger.error("Error fetching Applications", error);
        });
    } catch (e) {
      logger.error("Error fetching Applications", e);
    }

    setLoading(false);
  };

  const getFilterOptions = async () => {
    if (!filterOptionsLoading) {
      setFilterOptionsLoading(true);
    }

    try {
      await network
        .GET("/api/v1/dealers/applications/filter-options")
        .then((response) => {
          setCreditStatusOptions(response.data.credit_status);
          setDocumentStatusOptions(response.data.document_status);
        })
        .catch((error) => {
          logger.error("Error fetching filter options", error);
        });
    } catch (e) {
      logger.error("Error fetching filter options", e);
    }

    setFilterOptionsLoading(false);
  };

  const archiveApplication = async (event: any, id: number) => {
    if (!loading) {
      setLoading(true);
    }

    try {
      await network
        .POST(`/api/v1/dealers/applications/${id}/archive`, {})
        .then((response) => {
          message.success(response.data.message);
          getApplications();
        })
        .catch((error) => {
          logger.error("Error fetching filter options", error);
        });
    } catch (e) {
      logger.error("Error fetching filter options", e);
    }

    setLoading(false);
  };

  const handleSelectFilterParams = (value: any) => {
    setFilterData({timeRange: value})
    getApplications()
  };

  const lastQuarterly = () => {
    const date = new Date();
    const year = date.getFullYear();
    const quarter = Math.floor((date.getMonth() - 1)/ 3 + 1) - 1;
    let quarterlyDateRange = "";
    switch(quarter) {
      case 0:
        // Q4
        quarterlyDateRange = `${year - 1}/10/01 - ${year - 1}/12/31`;
        break;
      case 1:
        // Q1
        quarterlyDateRange = `${year}/01/01 - ${year}/03/31`;
        break;
      case 2:
        // Q2
        quarterlyDateRange = `${year}/04/01 - ${year}/06/30`;
        break;
      case 3:
        // Q3
        quarterlyDateRange = `${year}/07/01 - ${year}/09/31`;
        break;
    }
    return quarterlyDateRange;
  }

  useEffect(() => {
    getApplications();
  }, [filterData, paginationData]);

  const getUniqueBy = (arr: Array<Object>, prop: any) => {
    return arr.reduce((a: any, d: any) => {
      if (!a.includes(d[prop])) {
        a.push(d[prop]);
      }
      return a;
    }, []);
  };

  const convertToObj = (prop: String) => {
    return data
      ? getUniqueBy(data, prop)
          .map((val: any) => {
            return val ? { text: val, value: val } : null;
          })
          .filter((val: any) => {
            return val !== null;
          })
      : [];
  };

  const getStatusPercentage = (total: number, statusDataValue: number) => {
    const percentage = (statusDataValue * 100) / total
    return Number(percentage.toFixed(2))
  }

  // const columns: ColumnsType<Applications | any> = [
  //   {
  //     key: "applicationIdentifier",
  //     title: "Application Identifier",
  //     dataIndex: "applicationIdentifier",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     render(val, row) {
  //       return (
  //         <Link to={`/applications/${row.id}/summary`}>
  //           {" "}
  //           {val == null ? "N/A" : val}{" "}
  //         </Link>
  //       );
  //     },
  //     responsive: ["lg"],
  //     onFilter: (value, record) =>
  //       record.applicationIdentifier &&
  //       record.applicationIdentifier.includes(value),
  //     filters: convertToObj("applicationIdentifier"),
  //     filterSearch: true,
  //     className: "identifier",
  //   },
  //   {
  //     key: "applicant",
  //     title: "Applicant",
  //     dataIndex: "applicant",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     onFilter: (value, record) =>
  //       record.applicant && record.applicant.includes(value),
  //     filters: convertToObj("applicant"),
  //     filterSearch: true,
  //   },
  //   {
  //     key: "coApplicant",
  //     title: "Co-Applicant",
  //     dataIndex: "coApplicant",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     onFilter: (value, record) =>
  //       record.coApplicant && record.coApplicant.includes(value),
  //     filters: convertToObj("coApplicant"),
  //     filterSearch: true,
  //   },
  //   {
  //     key: "modelAndYear",
  //     title: "Model and Year",
  //     dataIndex: "modelAndYear",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     onFilter: (value, record) =>
  //       record.modelAndYear && record.modelAndYear.includes(value),
  //     filters: convertToObj("modelAndYear"),
  //     filterSearch: true,
  //   },
  //   {
  //     key: "creditStatus",
  //     title: "Credit Status",
  //     dataIndex: "creditStatus",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     onFilter: (value, record) =>
  //       record.creditStatus && record.creditStatus.includes(value),
  //     filters: convertToObj("creditStatus"),
  //     filterSearch: true,
  //   },
  //   {
  //     key: "documentStatus",
  //     title: "Document Status",
  //     dataIndex: "documentStatus",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     onFilter: (value, record) =>
  //       record.documentStatus && record.documentStatus.includes(value),
  //     filters: convertToObj("documentStatus"),
  //     filterSearch: true,
  //   },
  //   {
  //     key: "daysSubmitted",
  //     title: "Days Submitted",
  //     dataIndex: "daysSubmitted",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     responsive: ["lg"],
  //     onFilter: (value, record) =>
  //       record.daysSubmitted && record.daysSubmitted.includes(value),
  //     filters: convertToObj("daysSubmitted"),
  //     filterSearch: true,
  //   },
  //   {
  //     key: "lastUpdated",
  //     title: "Last Updated",
  //     dataIndex: "lastUpdated",
  //     sorter: {
  //       compare: (a, b) => a.id - b.id,
  //     },
  //     responsive: ["lg"],
  //     onFilter: (value: any, record: any) =>
  //       record.lastUpdated && record.lastUpdated.includes(value),
  //     filters: convertToObj("lastUpdated"),
  //     filterSearch: true,
  //   },
  //   {
  //     title: "",
  //     dataIndex: "",
  //     key: "x",
  //     render(text, record, index) {
  //       return (
  //         <Dropdown
  //           className='dropdown-field'
  //           overlay={menu(record.actionPermission, record)}
  //           trigger={["click"]}
  //         >
  //           <a className='ant-dropdown-link' href='#'>
  //             <Tooltip placement='top' title='view options'>
  //               <Button>
  //                 Action
  //                 <DownOutlined
  //                   style={{ marginLeft: 5, marginRight: -8, padding: 0 }}
  //                 />
  //               </Button>
  //             </Tooltip>
  //           </a>
  //         </Dropdown>
  //       );
  //     },
  //   },
  // ];

  const [pageState, setPageState] = useState({
    total: 0,
    page: 0,
    limit: 25,
    search: ""
  })

  const columns:GridColDef[] = [
    {
      field: 'ApplicationIdentifier', headerName: 'Application Identifier', type: 'string',  headerAlign: 'center', width: 150,
      renderCell: params => {
        return (
          <Link to={`/applications/${params.row.id}/summary`}>
            {" "}
            {params.row.applicationIdentifier == null ? "N/A" : params.row.applicationIdentifier}{" "}
          </Link>
                );
          }  
    },

    {field: 'applicant', headerName: 'Applicant', type: 'string', headerAlign: 'center', flex:1},
    {field: 'coApplicant', headerName: 'Co-Applicant', type: 'string', headerAlign: 'center', flex:1},
    {field: 'modelAndYear', headerName: 'Model and Year', type: 'string', headerAlign: 'center', flex:1},
    {
      field: 'creditStatus', headerName: 'Credit Status', type: 'string', headerAlign: 'center', flex:1,
      renderCell: params => {
        return <CreditStatus params={params} />
      }
    },
    {
      field: 'documentStatus', headerName: 'Document Status', type: 'string',headerAlign: 'center', flex:1,
      renderCell: params => {
        return <DocumentStatus params={params} />
      }
    },
    {field: 'daysSubmitted', headerName: 'Days Submitted', type: 'string',headerAlign: 'center', flex:1},
    {field: 'lastUpdated', headerName: 'Last Updated', type: 'string',headerAlign: 'center', flex:1},
    {
      field: 'actions', headerName: 'Actions', type: 'string', headerAlign: 'center', flex:1, 
      renderCell: params => {
        
        return (
          <div>
            <ActionsButton 
             params={params.row}
             archiveApplication={archiveApplication}
            >
              Action
            </ActionsButton>
          </div>
        )
      }
    },  
] 

  return (
    <Spin spinning={loading}>
    <Row wrap={false}>
        <Col>
          <Title level={5}>APPLICATIONS</Title>
          {/* <Select
            style={{ width: '200px' }}
            onChange={handleSelectFilterParams}
            dropdownStyle={selectDropdownStyle}
            defaultValue={currentYear()}
          >
            <Option className="select-option" value={currentYear()}>This year</Option>
            <Option className="select-option" value={lastQuarterly()}>Last Quarter</Option>
            <Option className="select-option" value={currentYear() - 1}>{`Year ${currentYear() - 1}`}</Option>
            <Option className="select-option" >ALL</Option>
          </Select> */}
        </Col>
        <Col flex="auto">
          <Row>
            <Col flex='auto'>
              <Card style={ cardStyle } hoverable={true}>
                <Row align='middle'>
                  <Col flex='auto'>
                    <Statistic title="SUBMITTED" value={submitted} />
                  </Col>
                  <Col>
                    <ShopOutlined style={{ fontSize: '20px' }}/>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col flex='auto'>
              <Card style={ cardStyle } hoverable={true}>
                <Row align='middle'>
                  <Col flex='auto'>
                    <Statistic title="APPROVED" value={approved} />
                  </Col>
                  <Col>
                    <Progress type="circle" percent={getStatusPercentage(statusData.total, approved)} width={60} strokeColor='green' strokeWidth={3} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col flex="auto">
              <Card size="small" title="APP PERFORMANCE" style={{...cardStyle}} hoverable={true}>
                <Pie {...pieConfig} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col flex="auto">
          <Card style={ cardStyle } hoverable={true}>
            <Row align='middle'>
              <Col flex='auto'>
                <Statistic title="FUNDED" value={`${funded} (${statusData.total_sales_price})`} />
              </Col>
              <Col flex="auto">
                <Col>
                  <Progress type="circle" percent={getStatusPercentage(submitted, funded)} width={42} strokeColor='red' strokeWidth={6} />
                </Col>
                <Col>
                  <span style={{fontSize: "10px"}}>LOOK TO BOOK</span>
                </Col>
                </Col>
                <Col>
              <Col>
                <Progress type="circle" percent={getStatusPercentage(statusData.total, funded)} width={42} strokeColor='red' strokeWidth={6} />
              </Col>
              <Col>
                <span style={{fontSize: "10px"}}>CONVERSION RATE</span>
              </Col>
              </Col>
            </Row>
          </Card>
          <Card size="small" title="TOP CATEGORIES" style={{...cardStyle}} hoverable={true}>
            <Pie {...donutConfig} />
          </Card>
        </Col>
      </Row>
      <Box sx={{ flexGrow: 1, pb: 2 }}>
            <Grid container spacing={2} direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Grid item md={4} sm={4}>
                    <Search placeholder="Search" allowClear size="large" onSearch={(searchVal) => setPageState(old => ({ ...old, search: searchVal, page: 0 }))} enterButton />
                </Grid>
                <Grid item md={2} sm> </Grid>
                <Grid item md={6} sm={6} container spacing={1} direction="row">
                    <Grid item md={7} sm={7}> </Grid>
                    <Grid item md={4} sm={4}>
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label">By Dates</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Dates"
                                defaultValue={currentYear()}
                                onChange={handleSelectFilterParams}
                                sx={{ borderColor: "black" }}
                                size="small"
                            >
                                <MenuItem className='date-filter' value={currentYear() - 1}>{`Year ${currentYear() - 1}`}</MenuItem>
                                <MenuItem className='date-filter' value={lastQuarterly()}>Last Quarter </MenuItem>
                                <MenuItem className='date-filter' value={currentYear()}>This Year</MenuItem>
                                <MenuItem className='date-filter' >All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid> 
        </Box>
      
      {/* <Table
        columns={columns}
        dataSource={data}
        rowKey={(val) => val.id}
        pagination={{
          defaultPageSize: 20,
          onChange: onPaginationChange,
          pageSizeOptions: ["20", "50", "100"],
          ...paginationProps,
        }}
        size='small'
        scroll={{ y: 685 }}
        className='table-wrapper'
      />
      <Drawer
        title='Filters'
        placement='right'
        afterVisibleChange={onDrawerVisibleChange}
        onClose={onDrawerClose}
        visible={visibleDrawer}
        width={400}
      >
        <Form
          form={filterForm}
          colon={false}
          onFinish={onFilterSubmit}
          {...filterFormLayout}
        >
          <Form.Item label='Name' name='name'>
            <Input />
          </Form.Item>
          <Form.Item label='Credit Status' name='creditStatus'>
            <Select allowClear loading={filterOptionsLoading}>
              {creditStatusOptions &&
                creditStatusOptions.map((item, index) => {
                  return (
                    <Option key={index} value={item[1]}>
                      {item[0]}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item label='Document Status' name='documentStatus'>
            <Select allowClear loading={filterOptionsLoading}>
              {documentStatusOptions &&
                documentStatusOptions.map((item, index) => {
                  return (
                    <Option key={index} value={item[1]}>
                      {item[0]}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item label='Can Change Bikes?' name='canChangeBikes'>
            <Select allowClear>
              <Option value='true'>Yes</Option>
              <Option value='false'>No</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginTop: "15px" }}>
            <Button
              type='primary'
              htmlType='submit'
              style={{ marginRight: "5px" }}
            >
              Filter
            </Button>
            <Button htmlType='button' onClick={onFilterReset}>
              Clear Filters
            </Button>
          </Form.Item>
        </Form>
      </Drawer> */}
      <Box sx={{
          height: 820, display: "flex", flexGrow: 1, width: '100%', '& .super-app-theme--header': {
            backgroundColor: 'rgba(255, 7, 0, 0.55)'
          },
        }}>
            {data && <DataGridPro
              disableColumnReorder={true}
              disableSelectionOnClick={true}
              getRowHeight={() => 'auto'}
              columns={columns}
              rows={data}
              rowsPerPageOptions={[25, 50, 100]}
              density="comfortable"
              pagination
              rowCount={statusData.total}
              page={pageState.page <= 0 ? 0 : pageState.page - 1}
              pageSize={pageState.limit}
              paginationMode="server"
              onPageChange={(newPage) => {
                  setPageState(old => ({ ...old, page: newPage + 1 }))
                }}
              onPageSizeChange={(newPageSize) => setPageState(old => ({ ...old, limit: newPageSize }))}  
              sx={{
                boxShadow: 'none !important',
                border: "none !important",

                '& .MuiDataGrid-cell': {
                  padding: '10px',
                },
                '& .MuiDataGrid-row': {
                  fontSize: 12
                },

                '& .wrapHeader .MuiDataGrid-colCellTitle': {
                  overflow: "hidden",
                  lineHeight: "20px",
                  whiteSpace: "normal"
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontSize: 14,
                  fontWeight: 600,
                  whiteSpace: 'normal !important',
                  lineHeight: 'normal',
                  overflowWrap: "break-word",
                  letterSpacing: '-0.5px'
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: "#e8ecf0",
                  color: "#000000",
                },

                '& .MuiChip-label': {
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  whiteSpace: 'normal !important',
                  wordWrap: ' break-word',
                  lineHeight: ' 1',
                  paddingBottom: '2px',
                  paddingTop: '2px',
                  letterSpacing: '-0.5px'
                }
              }}
            />
            }
      </Box>
    </Spin>
  );
}

export default ApplicationList;