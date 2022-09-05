import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useState, useEffect } from 'react'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'
import { CSVLink, CSVDownload } from 'react-csv'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [tempData, setTempData] = useState([])
  const [tempChange, setTempChange] = useState(0.0)
  const [turbidityData, setTurbidityData] = useState([])
  const [tdsData, setTdsData] = useState([])
  const [pHData, setPHData] = useState([])
  const [timeData, curTimeData] = useState([])
  const [timeLabels, setTimeLabels] = useState([])
  const [curTab, setCurTab] = useState('Temperature')
  const [dateTimeValue, setDateTimeValue] = useState([new Date(), new Date()])
  const [filterData, setFilterData] = useState([])

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddAndClose = () => {
    let form = document.getElementById('EmailSubscription')
    let email = form.value
    console.log(email)
    setOpen(false);
  };

  const fields = [
    { key: 'Created At', _style: { width: '20%' } },
    { key: 'Temperature', _style: { width: '20%' } },
    { key: 'Turbidity', _style: { width: '20%' } },
    { key: 'TDS', _style: { width: '20%' } },
    { key: 'pH', _style: { width: '20%' } },
  ]

  useEffect(() => {
    const getData = async () => {
      // Fetch Data from thingspeak
      const response = await fetch(
        'https://api.thingspeak.com/channels/1834719/feeds.json?results=15',
      )
      const body = await response.json()
      //console.log(body)
      // console.log(response)
      var tempDataCur = []
      var turbidityDataCur = []
      var tdsDataCur = []
      var pHDataCur = []
      var timeDataCur = []
      body.feeds.map((data) => {
        tempDataCur.push(data.field1)
        turbidityDataCur.push(data.field2)
        tdsDataCur.push(data.field3)
        pHDataCur.push(data.field4)
        var curdate = new Date(data.created_at)
        timeDataCur.push(curdate.toLocaleTimeString())
      })
      // Set the Corressponding fields
      //console.log(tempDataCur)
      setTempData([...tempDataCur])
      setTurbidityData([...turbidityDataCur])
      setTdsData([...tdsDataCur])
      setPHData([...pHDataCur])
      setTimeLabels([...timeDataCur])
      //console.log(timeDataCur[0].getHours())
      //console.log(timeDataCur)
    }
    const interval = setInterval(() => {
      getData()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getData = async () => {
      // Fetch Data from thingspeak
      const response = await fetch(
        'https://api.thingspeak.com/channels/1834719/feeds.json?results=15',
      )
      const body = await response.json()
      //console.log(body)
      // console.log(response)
      var tempDataCur = []
      var turbidityDataCur = []
      var tdsDataCur = []
      var pHDataCur = []
      var timeDataCur = []
      body.feeds.map((data) => {
        tempDataCur.push(data.field1)
        turbidityDataCur.push(data.field2)
        tdsDataCur.push(data.field3)
        pHDataCur.push(data.field4)
        var curdate = new Date(data.created_at)
        timeDataCur.push(curdate.toLocaleTimeString())
      })
      // Set the Corressponding fields
      //console.log(tempDataCur)
      setTempData([...tempDataCur])
      setTurbidityData([...turbidityDataCur])
      setTdsData([...tdsDataCur])
      setPHData([...pHDataCur])
      setTimeLabels([...timeDataCur])
      //console.log(timeDataCur[0].getHours())
      //console.log(timeDataCur)
    }
    getData()
  }, [])

  const getDataSet = () => {
    if (curTab == 'Temperature') {
      return [
        {
          label: 'Temperature',
          backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
          borderColor: getStyle('--cui-info'),
          pointHoverBackgroundColor: getStyle('--cui-info'),
          borderWidth: 2,
          data: tempData,
        },
      ]
    } else if (curTab == 'Turbidity') {
      return [
        {
          label: 'Turbidity',
          backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
          borderColor: 'red',
          pointHoverBackgroundColor: getStyle('--cui-info'),
          borderWidth: 2,
          data: turbidityData,
        },
      ]
    } else if (curTab == 'TDS') {
      return [
        {
          label: 'TDS',
          backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
          borderColor: 'orange',
          pointHoverBackgroundColor: getStyle('--cui-info'),
          borderWidth: 2,
          data: tdsData,
        },
      ]
    } else {
      return [
        {
          label: 'pH',
          backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
          borderColor: 'purple',
          pointHoverBackgroundColor: getStyle('--cui-info'),
          borderWidth: 2,
          data: pHData,
        },
      ]
    }
  }

  const getYTicks = () => {
    if (curTab == 'Temperature') {
      return {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: 0.5,
          max: 50,
          min: 0,
        },
      }
    } else if (curTab == 'Turbidity') {
      return {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: 1,
          max: 100,
          min: 0,
        },
      }
    } else if (curTab == 'TDS') {
      return {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: 5,
          max: 500,
          min: 0,
        },
      }
    } else {
      return {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: 0.1,
          max: 14,
          min: 0,
        },
      }
    }
  }

  const handleGetData = async () => {
    var startYear = dateTimeValue[0].getUTCFullYear().toString()
    var startMonth = (dateTimeValue[0].getUTCMonth() + 1).toString().padStart(2, '0')
    var startDay = dateTimeValue[0].getUTCDate().toString().padStart(2, '0')
    var startHour = dateTimeValue[0].getUTCHours().toString().padStart(2, '0')
    var startMinute = dateTimeValue[0].getUTCMinutes().toString().padStart(2, '0')
    var startTimeString =
      startYear + '-' + startMonth + '-' + startDay + '%20' + startHour + ':' + startMinute + ':00'
    console.log(startTimeString)
    var endYear = dateTimeValue[1].getUTCFullYear().toString()
    var endMonth = (dateTimeValue[1].getUTCMonth() + 1).toString().padStart(2, '0')
    var endDay = dateTimeValue[1].getUTCDate().toString().padStart(2, '0')
    var endHour = dateTimeValue[1].getUTCHours().toString().padStart(2, '0')
    var endMinute = dateTimeValue[1].getUTCMinutes().toString().padStart(2, '0')
    var endTimeString =
      endYear + '-' + endMonth + '-' + endDay + '%20' + endHour + ':' + endMinute + ':00'
    console.log(endTimeString)
    const response = await fetch(
      'https://api.thingspeak.com/channels/1834719/feeds.json?start=' +
        startTimeString +
        '&end=' +
        endTimeString,
    )
    response.json().then((body) => {
      console.log(body.feeds)
      setFilterData(body.feeds)
    })
    console.log(filterData)
  }

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,'
  }

  const getDateFormat = (date) => {
    var curdate = new Date(date)
    return curdate.toLocaleDateString() + ' ' + curdate.toLocaleTimeString()
  }

  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                {curTab} Vs Time
              </h4>
              <div className="small text-medium-emphasis">Latest 15 Values</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              {/* <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton> */}
              <CButtonGroup className="float-end me-3">
                {['Temperature', 'Turbidity', 'TDS', 'pH'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={curTab === value}
                    onClick={() => setCurTab(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: timeLabels,
              datasets: getDataSet(),
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: getYTicks(),
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 3,
                  hitRadius: 20,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <CRow style={{ margin: '2%' }}>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">
                Get Data
              </h4>
              <div className="small text-medium-emphasis">Select Date & Time Range</div>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={5}>
              <DateTimeRangePicker value={dateTimeValue} onChange={setDateTimeValue} />
              <CButton color="primary" size="sm" onClick={handleGetData}>
                Get
              </CButton>
              {/* <CButton color="success" size="sm" onClick={handleDownloadCSV}>
                Download as CSV
              </CButton> */}
              <CSVLink data={filterData} filename="data.csv">
                <CButton color="success" size="sm">
                  Download as CSV
                </CButton>
              </CSVLink>
            </CCol>
          </CRow>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Temperature</TableCell>
                <TableCell>Turbidity</TableCell>
                <TableCell>TDS</TableCell>
                <TableCell>pH</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData.map((item) => (
                <TableRow key={item.created_at}>
                  <TableCell>{getDateFormat(item.created_at)}</TableCell>
                  <TableCell>{item.field1}</TableCell>
                  <TableCell>{item.field2}</TableCell>
                  <TableCell>{item.field3}</TableCell>
                  <TableCell>{item.field4}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CCardBody>
      </CCard>
      <br />
      <br />
      <IconButton color="primary" aria-label="subscribe to mailing list" onClick={handleClickOpen} style={{position:"fixed", right:"1vw", bottom:"1vh"}}>
        <MailOutlineIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="EmailSubscription"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAndClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Dashboard
