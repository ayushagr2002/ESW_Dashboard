import React from 'react'
import { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = () => {
  const [tempData, setTempData] = useState([])
  const [tempChange, setTempChange] = useState(0.0)
  const [turbidityData, setTurbidityData] = useState([])
  const [turbChange, setTurbChange] = useState(0.0)
  const [tdsData, setTdsData] = useState([])
  const [tdsChange, setTdsChange] = useState(0.0)
  const [timeLabels, setTimeLabels] = useState([])
  const [pHData, setPHData] = useState([])
  const [pHChange, setPHChange] = useState(0.0)

  // Get The Last 10 Sensor Values every 15 seconds
  useEffect(() => {
    const getData = async () => {
      // Fetch Data from thingspeak
      const response = await fetch(
        'https://api.thingspeak.com/channels/1834719/feeds.json?results=10',
      )
      const body = await response.json()
      console.log(body)
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
      console.log(tempDataCur)
      setTempData([...tempDataCur])
      setTurbidityData([...turbidityDataCur])
      setTdsData([...tdsDataCur])
      setPHData([...pHDataCur])
      setTimeLabels([...timeDataCur])
      // console.log(tempDataCur)
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
        'https://api.thingspeak.com/channels/1834719/feeds.json?results=10',
      )
      const body = await response.json()
      console.log(body)
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
      console.log(tempDataCur)
      setTempData([...tempDataCur])
      setTurbidityData([...turbidityDataCur])
      setTdsData([...tdsDataCur])
      setPHData([...pHDataCur])
      setTimeLabels([...timeDataCur])
      // console.log(tempDataCur)
    }
    getData()
  }, [])

  useEffect(() => {
    if (tempData.length > 1) {
      var len = tempData.length
      var res = (tempData[len - 1] - tempData[len - 2]) / tempData[len - 2]
      setTempChange((res * 100.0).toFixed(2))
    } else {
      setTempChange(0.0)
    }

    if (turbidityData.length > 1) {
      var len = turbidityData.length
      if (turbidityData[len - 2] == 0) {
        setTurbChange(0.0)
        return
      }
      var res = (turbidityData[len - 1] - turbidityData[len - 2]) / turbidityData[len - 2]
      setTurbChange((res * 100.0).toFixed(2))
    } else {
      setTurbChange(0.0)
    }

    if (tdsData.length > 1) {
      var len = tdsData.length
      if (tdsData[len - 2] == 0) {
        setTdsChange(0.0)
        return
      }
      var res = (tdsData[len - 1] - tdsData[len - 2]) / tdsData[len - 2]
      setTdsChange((res * 100.0).toFixed(2))
    } else {
      setTdsChange(0.0)
    }

    if (pHData.length > 1) {
      var len = pHData.length
      if (pHData[len - 2] == 0) {
        setPHChange(0.0)
        return
      }
      var res = (pHData[len - 1] - pHData[len - 2]) / pHData[len - 2]
      setPHChange((res * 100.0).toFixed(2))
    } else {
      setPHChange(0.0)
    }
  }, [tempData, turbidityData, tdsData, pHData])

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
              {tempData.slice(-1)}{' '}
              <span className="fs-6 fw-normal">
                ({tempChange}%
                {tempChange > 0.0 ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />})
              </span>
            </>
          }
          title="Temperature"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: 'Temperature',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
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
            <>
              {turbidityData.slice(-1)}{' '}
              <span className="fs-6 fw-normal">
                ({turbChange}%
                {turbChange > 0.0 ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />})
              </span>
            </>
          }
          title="Turbidity"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: 'Turbidity',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-success'),
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
            <>
              {tdsData.slice(-1)}{' '}
              <span className="fs-6 fw-normal">
                ({tdsChange}%
                {tdsChange > 0.0 ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />})
              </span>
            </>
          }
          title="TDS"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: 'TDS',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-secondary'),
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
            <>
              {pHData.slice(-1)}{' '}
              <span className="fs-6 fw-normal">
                ({pHChange}%
                {pHChange > 0.0 ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />})
              </span>
            </>
          }
          title="pH"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: timeLabels,
                datasets: [
                  {
                    label: 'pH',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-warning'),
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
  )
}

export default WidgetsDropdown
