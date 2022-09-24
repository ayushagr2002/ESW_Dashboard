import * as React from "react";
import IconButton from "@mui/material/IconButton";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useState, useEffect } from "react";
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
} from "@coreui/react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
import CIcon from "@coreui/icons-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
} from "@coreui/icons";

import avatar1 from "src/assets/images/avatars/1.jpg";
import avatar2 from "src/assets/images/avatars/2.jpg";
import avatar3 from "src/assets/images/avatars/3.jpg";
import avatar4 from "src/assets/images/avatars/4.jpg";
import avatar5 from "src/assets/images/avatars/5.jpg";
import avatar6 from "src/assets/images/avatars/6.jpg";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { CSVLink, CSVDownload } from "react-csv";
import Swal from "sweetalert2";
import Plot from "react-plotly.js";
import DatePicker from "react-date-picker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function decode(m, p) {
  if (p == 0) return 1;
  else return (m * decode(m, p - 1)) % 145;
}

const Analysis = () => {
  const [avgTempValues, setAvgTempValues] = useState([]);
  const [avgTurbValues, setAvgTurbValues] = useState([]);
  const [avgTDSValues, setAvgTDSValues] = useState([]);
  const [avgPhValues, setAvgPhValues] = useState([]);
  const [dayLabels, setDayLabels] = useState([]);
  const [curTab, setCurTab] = useState("Temperature");
  const [curTab2, setCurTab2] = useState("Temperature");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayAvgTemp, setDayAvgTemp] = useState([]);
  const [dayAvgTurb, setDayAvgTurb] = useState([]);
  const [dayAvgTDS, setDayAvgTDS] = useState([]);
  const [dayAvgPh, setDayAvgPh] = useState([]);
  const [daytimeLabels, setDaytimeLabels] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const startDate = new Date(2022, 8, 16, 0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      const AvgTemperatureValues = [];
      const AvgTurbidityValues = [];
      const AvgTDSValues = [];
      const AvgPhValues = [];
      const DayLabels = [];
      for (var i = 0; i < 6; i++) {
        DayLabels.push(startDate.toISOString().slice(0, 10));
        var startYear = startDate.getUTCFullYear().toString();
        var startMonth = (startDate.getUTCMonth() + 1)
          .toString()
          .padStart(2, "0");
        var startDay = startDate.getUTCDate().toString().padStart(2, "0");
        var startHour = startDate.getUTCHours().toString().padStart(2, "0");
        var startMinute = startDate.getUTCMinutes().toString().padStart(2, "0");
        var startTimeString =
          startYear +
          "-" +
          startMonth +
          "-" +
          startDay +
          "%20" +
          startHour +
          ":" +
          startMinute +
          ":00";
        var endYear = endDate.getUTCFullYear().toString();
        var endMonth = (endDate.getUTCMonth() + 1).toString().padStart(2, "0");
        var endDay = endDate.getUTCDate().toString().padStart(2, "0");
        var endHour = endDate.getUTCHours().toString().padStart(2, "0");
        var endMinute = endDate.getUTCMinutes().toString().padStart(2, "0");
        var endTimeString =
          endYear +
          "-" +
          endMonth +
          "-" +
          endDay +
          "%20" +
          endHour +
          ":" +
          endMinute +
          ":00";
        
        const response = await fetch(
          "https://api.thingspeak.com/channels/1871985/feeds.json?start=" +
            startTimeString +
            "&end=" +
            endTimeString
        );
        const rawData = await response.json();
        var tempSum = 0.0;
        var turbSum = 0.0;
        var tdsSum = 0.0;
        var phSum = 0.0;
        for (let j = 0; j < rawData.feeds.length; j++) {
          let encrypt = JSON.parse(JSON.parse(rawData.feeds[j].field1));
          let strData = "";
  
          let d = 75;
  
          for (let i = 0; i < encrypt.length; i++) {
            let code = encrypt[i];
            strData += String.fromCharCode(decode(code, d));
          }
          let decrypted = JSON.parse(strData);
          tempSum += decrypted[0];
          turbSum += decrypted[1];
          tdsSum += decrypted[2];
          phSum += decrypted[3];
        }
        // console.log(tempSum)
        AvgTemperatureValues.push(tempSum / rawData.feeds.length);
        AvgTurbidityValues.push(turbSum / rawData.feeds.length);
        AvgTDSValues.push(tdsSum / rawData.feeds.length);
        AvgPhValues.push(phSum / rawData.feeds.length);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
      }
      console.log(AvgTemperatureValues);
      setAvgTempValues([...AvgTemperatureValues]);
      setAvgTurbValues([...AvgTurbidityValues]);
      setAvgTDSValues([...AvgTDSValues]);
      setAvgPhValues([...AvgPhValues]);
      setDayLabels([...DayLabels]);
    };
    getData();
  }, []);

  const getDayData = async () => {
    var startDate = new Date(selectedDate);
    var endDate = new Date(selectedDate);
    startDate.setHours(6);
    endDate.setHours(9);
    var startYear = selectedDate.getUTCFullYear().toString();
    var startMonth = (selectedDate.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0");
    var startDay = selectedDate.getUTCDate().toString().padStart(2, "0");
    const AvgTemperatureValues = [];
    const AvgTurbidityValues = [];
    const AvgTDSValues = [];
    const AvgPhValues = [];
    const HourLabels = [];
    for (var i = 0; i < 7; i++) {
      var startHour = startDate.getUTCHours().toString().padStart(2, "0");
      var startTimeString =
        startYear +
        "-" +
        startMonth +
        "-" +
        startDay +
        "%20" +
        startHour +
        ":00:00";
      var endHour = endDate.getUTCHours().toString().padStart(2, "0");
      var endTimeString =
        startYear +
        "-" +
        startMonth +
        "-" +
        startDay +
        "%20" +
        endHour +
        ":" +
        "00" +
        ":00";
      console.log(startTimeString);
      console.log(endTimeString);
      HourLabels.push(startHour+'-'+endHour);
      const response = await fetch(
        "https://api.thingspeak.com/channels/1871985/feeds.json?start=" +
          startTimeString +
          "&end=" +
          endTimeString
      );
      const rawData = await response.json();
      var tempSum = 0.0;
      var turbSum = 0.0;
      var tdsSum = 0.0;
      var phSum = 0.0;
      for (let j = 0; j < rawData.feeds.length; j++) {
        let encrypt = JSON.parse(JSON.parse(rawData.feeds[j].field1));
        let strData = "";

        let d = 75;

        for (let i = 0; i < encrypt.length; i++) {
          let code = encrypt[i];
          strData += String.fromCharCode(decode(code, d));
        }
        let decrypted = JSON.parse(strData);
        tempSum += decrypted[0];
        turbSum += decrypted[1];
        tdsSum += decrypted[2];
        phSum += decrypted[3];
      }
      // console.log(tempSum)
      if(rawData.feeds.length > 0){
        AvgTemperatureValues.push(tempSum / rawData.feeds.length);
        AvgTurbidityValues.push(turbSum / rawData.feeds.length);
        AvgTDSValues.push(tdsSum / rawData.feeds.length);
        AvgPhValues.push(phSum / rawData.feeds.length);
      }
        else{
            AvgTemperatureValues.push(0);
            AvgTurbidityValues.push(0);
            AvgTDSValues.push(0);
            AvgPhValues.push(0);
        }
      startDate.setHours(endDate.getHours());
      endDate.setHours(endDate.getHours() + 3);
    }
    console.log(AvgTemperatureValues);
    setDayAvgTemp([...AvgTemperatureValues]);
    setDayAvgTurb([...AvgTurbidityValues]);
    setDayAvgTDS([...AvgTDSValues]);
    setDayAvgPh([...AvgPhValues]);
    setDaytimeLabels([...HourLabels]);
  };

  const getDataSet = () => {
    if (curTab == "Temperature") return avgTempValues;
    else if (curTab == "Turbidity") return avgTurbValues;
    else if (curTab == "TDS") return avgTDSValues;
    else if (curTab == "pH") return avgPhValues;
  };

  const getDayDataSet = () => {
  
    if (curTab2 == "Temperature") return dayAvgTemp;
    else if (curTab2 == "Turbidity") return dayAvgTurb;
    else if (curTab2 == "TDS") return dayAvgTDS;
    else if (curTab2 == "pH") return dayAvgPh;
}

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                {curTab}
              </h4>
              <div className="small text-medium-emphasis">
                Average Values at different times on a particular day
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButtonGroup className="float-end me-3">
                {["Temperature", "Turbidity", "TDS", "pH"].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={curTab2 === value}
                    onClick={() => setCurTab2(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol sm={3}>
              Select Date:{" "}
              <DatePicker
                value={selectedDate}
                format="dd-MM-y"
                onChange={(date) => setSelectedDate(date)}
              />
            </CCol>
            <CCol sm={1}>
              <CButton color="primary" onClick={getDayData}>
                Get
              </CButton>
            </CCol>
          </CRow>
          <Line
            options={{
              responsive: true,
            }}
            data={{
              labels: daytimeLabels,
              datasets: [
                {
                  label: "Average " + curTab2,
                  data: getDayDataSet(),
                  // backgroundColor: "cyan",
                },
              ],
            }}
          />
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                {curTab}
              </h4>
              <div className="small text-medium-emphasis">
                Average Values Per Day
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButtonGroup className="float-end me-3">
                {["Temperature", "Turbidity", "TDS", "pH"].map((value) => (
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
          <Bar
            style={{
              height: "50%",
            }}
            options={{
              responsive: true,
            }}
            data={{
              labels: dayLabels,
              datasets: [
                {
                  label: "Average " + curTab,
                  data: getDataSet(),
                  backgroundColor: "cyan",
                },
              ],
            }}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default Analysis;
