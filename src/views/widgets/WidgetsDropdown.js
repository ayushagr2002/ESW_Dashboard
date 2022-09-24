import React from "react";
import { useState, useEffect } from "react";
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilArrowBottom, cilArrowTop, cilOptions } from "@coreui/icons";

const WidgetsDropdown = () => {
  const [tempData, setTempData] = useState([]);
  const [tempChange, setTempChange] = useState(0.0);
  const [turbidityData, setTurbidityData] = useState([]);
  const [turbChange, setTurbChange] = useState(0.0);
  const [tdsData, setTdsData] = useState([]);
  const [tdsChange, setTdsChange] = useState(0.0);
  const [timeLabels, setTimeLabels] = useState([]);
  const [pHData, setPHData] = useState([]);
  const [pHChange, setPHChange] = useState(0.0);

  const avg = (data) => {
    for (var i = 0, sum = 0; i < data.length; sum += data[i++]);
    return sum / data.length;
  };

  function decode(m, p) {
    if (p == 0) return 1;
    else return (m * decode(m, p - 1)) % 145;
  }

  //Get The Last 15 Sensor Values every 5 minutes
  useEffect(() => {
    const pullAndDecodeData = async () => {
      const response = await fetch(
        "https://api.thingspeak.com/channels/1871985/feeds.json?results=15"
      );
      const rawData = await response.json();

      var tempDataCur = [];
      var turbidityDataCur = [];
      var tdsDataCur = [];
      var pHDataCur = [];
      var timeDataCur = [];

      for (let j = 0; j < rawData.feeds.length; j++) {
        let encrypt = JSON.parse(JSON.parse(rawData.feeds[j].field1));
        let strData = "";

        let d = 75;

        for (let i = 0; i < encrypt.length; i++) {
          let code = encrypt[i];
          strData += String.fromCharCode(decode(code, d));
        }
        let decrypted = JSON.parse(strData);

        tempDataCur.push(decrypted[0]);
        turbidityDataCur.push(decrypted[1]);
        tdsDataCur.push(decrypted[2]);
        pHDataCur.push(decrypted[3]);
        var curdate = new Date(rawData.feeds[j].created_at);
        timeDataCur.push(curdate.toLocaleTimeString());
      }
      // Set the Corressponding fields
      //console.log(tempDataCur)
      setTempData([...tempDataCur]);
      setTurbidityData([...turbidityDataCur]);
      setTdsData([...tdsDataCur]);
      setPHData([...pHDataCur]);
      setTimeLabels([...timeDataCur]);
    };
    const interval = setInterval(() => {
      pullAndDecodeData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pullAndDecodeData = async () => {
      const response = await fetch(
        "https://api.thingspeak.com/channels/1871985/feeds.json?results=15"
      );
      const rawData = await response.json();

      var tempDataCur = [];
      var turbidityDataCur = [];
      var tdsDataCur = [];
      var pHDataCur = [];
      var timeDataCur = [];

      for (let j = 0; j < rawData.feeds.length; j++) {
        let encrypt = JSON.parse(JSON.parse(rawData.feeds[j].field1));
        let strData = "";

        let d = 75;
        let n = 145;

        for (let i = 0; i < encrypt.length; i++) {
          let code = encrypt[i];
          strData += String.fromCharCode(decode(code, d));
        }
        let decrypted = JSON.parse(strData);

        tempDataCur.push(decrypted[0]);
        turbidityDataCur.push(decrypted[1]);
        tdsDataCur.push(decrypted[2]);
        pHDataCur.push(decrypted[3]);
        var curdate = new Date(rawData.feeds[j].created_at);
        timeDataCur.push(curdate.toLocaleTimeString());
      }
      // Set the Corressponding fields
      //console.log(tempDataCur)
      setTempData([...tempDataCur]);
      setTurbidityData([...turbidityDataCur]);
      setTdsData([...tdsDataCur]);
      setPHData([...pHDataCur]);
      setTimeLabels([...timeDataCur]);
    };
    pullAndDecodeData();
  }, []);

  useEffect(() => {
    if (tempData.length > 1) {
      var len = tempData.length;
      var res = (tempData[len - 1] - tempData[len - 2]) / tempData[len - 2];
      setTempChange((res * 100.0).toFixed(2));
    } else {
      setTempChange(0.0);
    }

    if (turbidityData.length > 1) {
      var len = turbidityData.length;
      if (turbidityData[len - 2] == 0) {
        setTurbChange(0.0);
        return;
      }
      var res =
        (turbidityData[len - 1] - turbidityData[len - 2]) /
        turbidityData[len - 2];
      setTurbChange((res * 100.0).toFixed(2));
    } else {
      setTurbChange(0.0);
    }

    if (tdsData.length > 1) {
      var len = tdsData.length;
      if (tdsData[len - 2] == 0) {
        setTdsChange(0.0);
        return;
      }
      var res = (tdsData[len - 1] - tdsData[len - 2]) / tdsData[len - 2];
      setTdsChange((res * 100.0).toFixed(2));
    } else {
      setTdsChange(0.0);
    }

    if (pHData.length > 1) {
      var len = pHData.length;
      if (pHData[len - 2] == 0) {
        setPHChange(0.0);
        return;
      }
      var res = (pHData[len - 1] - pHData[len - 2]) / pHData[len - 2];
      setPHChange((res * 100.0).toFixed(2));
    } else {
      setPHChange(0.0);
    }
  }, [tempData, turbidityData, tdsData, pHData]);

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <div
              style={{
                display: "flex",
                width: "130%",
                justifyContent: "space-between",
              }}
              className="stupidFuckingReact"
            >
              <div>
                {Number(tempData[tempData.length - 1]) ===
                tempData[tempData.length - 1]
                  ? tempData[tempData.length - 1].toFixed(2)
                  : 0}
                {" C°"}
              </div>
              <div className="fs-6 fw-normal">
                Change: {tempChange}%
                {tempChange > 0.0 ? (
                  <CIcon icon={cilArrowTop} />
                ) : (
                  <CIcon icon={cilArrowBottom} />
                )}
                <br></br>
                Avg: {avg(tempData).toFixed(3)}
              </div>
            </div>
          }
          title="Temperature"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: "70px" }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: "Temperature",
                    backgroundColor: "transparent",
                    borderColor: "rgba(255,255,255,.55)",
                    pointBackgroundColor: getStyle("--cui-primary"),
                    data: tempData,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: Math.min(...tempData) - 1,
                    max: Math.max(...tempData) + 1,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="success"
          value={
            <div
              style={{
                display: "flex",
                width: "170%",
                justifyContent: "space-between",
              }}
              className="stupidFuckingReact"
            >
              <div>{turbidityData.slice(-1)} </div>
              <div className="fs-6 fw-normal">
                Change: {turbChange}%
                {turbChange > 0.0 ? (
                  <CIcon icon={cilArrowTop} />
                ) : (
                  <CIcon icon={cilArrowBottom} />
                )}
                <br></br>
                Avg: {avg(turbidityData).toFixed(3)}
              </div>
            </div>
          }
          title="Turbidity"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: "70px" }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: "Turbidity",
                    backgroundColor: "transparent",
                    borderColor: "rgba(255,255,255,.55)",
                    pointBackgroundColor: getStyle("--cui-success"),
                    data: turbidityData,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: Math.min(...turbidityData) - 10,
                    max: Math.max(...turbidityData) + 10,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="secondary"
          value={
            <div
              style={{
                display: "flex",
                width: "130%",
                justifyContent: "space-between",
              }}
              className="stupidFuckingReact"
            >
              <div>
                {tdsData.slice(-1)}
                {" ppm"}
              </div>
              <div className="fs-6 fw-normal">
                Change: {tdsChange}%
                {tdsChange > 0.0 ? (
                  <CIcon icon={cilArrowTop} />
                ) : (
                  <CIcon icon={cilArrowBottom} />
                )}
                <br></br>
                Avg: {avg(tdsData).toFixed(3)}
              </div>
            </div>
          }
          title="TDS"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: "70px" }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: "TDS",
                    backgroundColor: "transparent",
                    borderColor: "rgba(255,255,255,.55)",
                    pointBackgroundColor: getStyle("--cui-secondary"),
                    data: tdsData,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: Math.min(...tdsData) - 50,
                    max: Math.max(...tdsData) + 50,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={
            <div
              style={{
                display: "flex",
                width: "150%",
                justifyContent: "space-between",
              }}
              className="stupidFuckingReact"
            >
              <div>
                {Number(pHData[pHData.length - 1]) ===
                  pHData[pHData.length - 1] &&
                pHData[pHData.length - 1] % 1 !== 0 > 0
                  ? pHData[pHData.length - 1].toFixed(3)
                  : 0}{" "}
              </div>
              <div className="fs-6 fw-normal">
                Change: {pHChange}%
                {pHChange > 0.0 ? (
                  <CIcon icon={cilArrowTop} />
                ) : (
                  <CIcon icon={cilArrowBottom} />
                )}
                <br></br>
                Avg: {avg(pHData).toFixed(3)}
              </div>
            </div>
          }
          title="pH"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: "70px" }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: "pH",
                    backgroundColor: "transparent",
                    borderColor: "rgba(255,255,255,.55)",
                    pointBackgroundColor: getStyle("--cui-warning"),
                    data: pHData,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: Math.min(...pHData) - 1,
                    max: Math.max(...pHData) + 1,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
