/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import ChartJs from 'chart.js'
import React from 'react'
import { Line } from 'react-chartjs-2'
import { dailyActiveUsers } from 'src/apis'

const mode: 'dark' | 'light' = 'light' //(themeMode) ? themeMode : 'light';
const fonts = {
  base: 'Open Sans',
}

// Colors
const colors = {
  gray: {
    100: '#f6f9fc',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#8898aa',
    700: '#525f7f',
    800: '#32325d',
    900: '#212529',
  },
  theme: {
    default: '#172b4d',
    primary: '#5e72e4',
    secondary: '#f4f5f7',
    info: '#11cdef',
    success: '#2dce89',
    danger: '#f5365c',
    warning: '#fb6340',
  },
  black: '#12263F',
  white: '#FFFFFF',
  transparent: 'transparent',
}

// Chart.js global options
function chartOptions() {
  // Options
  const options = {
    defaults: {
      global: {
        maintainAspectRatio: false,
        responsive: true,
        defaultColor: mode === 'dark' ? colors.gray[700] : colors.gray[600],
        defaultFontColor: mode === 'dark' ? colors.gray[700] : colors.gray[600],
        defaultFontFamily: fonts.base,
        defaultFontSize: 13,
        layout: {
          padding: 0,
        },
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 16,
          },
        },
        elements: {
          point: {
            radius: 0,
            backgroundColor: colors.theme['primary'],
          },
          line: {
            tension: 0.4,
            borderWidth: 4,
            borderColor: colors.theme['primary'],
            backgroundColor: colors.transparent,
            borderCapStyle: 'rounded',
          },
          rectangle: {
            backgroundColor: colors.theme['warning'],
          },
          arc: {
            backgroundColor: colors.theme['primary'],
            borderColor: mode === 'dark' ? colors.gray[800] : colors.white,
            borderWidth: 4,
          },
        },
        tooltips: {
          enabled: true,
          mode: 'index',
          intersect: false,
        },
      },
      doughnut: {
        cutoutPercentage: 83,
        legendCallback: function (chart: any) {
          const data = chart.data
          let content = ''

          data.labels.forEach(function (label: any, index: any) {
            const bgColor = data.datasets[0].backgroundColor[index]

            content += '<span class="chart-legend-item">'
            content +=
              '<i class="chart-legend-indicator" style="background-color: ' +
              bgColor +
              '"></i>'
            content += label
            content += '</span>'
          })

          return content
        },
      },
    },
  }

  // yAxes
  ChartJs.scaleService.updateScaleDefaults('linear', {
    gridLines: {
      borderDash: [2],
      borderDashOffset: 2,
      color: mode === 'dark' ? colors.gray[900] : colors.gray[300],
      drawBorder: false,
      drawTicks: false,
      lineWidth: 0,
      zeroLineWidth: 0,
      zeroLineColor: mode === 'dark' ? colors.gray[900] : colors.gray[300],
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: 2,
    },
    ticks: {
      beginAtZero: true,
      padding: 10,
      callback: function (value) {
        if (!(+value % 10)) {
          return value
        }
      },
    },
  })

  // xAxes
  ChartJs.scaleService.updateScaleDefaults('category', {
    gridLines: {
      drawBorder: false,
      drawOnChartArea: false,
      drawTicks: false,
    },
    ticks: {
      padding: 20,
    },
  })

  return options
}

// Parse global options
function parseOptions(parent: any, options: any) {
  for (const item in options) {
    if (typeof options[item] !== 'object') {
      parent[item] = options[item]
    } else {
      parseOptions(parent[item], options[item])
    }
  }
}

export function Chart() {
  parseOptions(window.Chart, chartOptions())

  const [activeUsers, setActiveUsers] = React.useState<
    {
      day: string
      users: number
      sessions: number
    }[]
  >()

  React.useEffect(() => {
    let ignore = false

    async function fetchData() {
      if (!ignore) {
        const data = await dailyActiveUsers()
        setActiveUsers(data)
      }
    }

    fetchData()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <>
      {activeUsers ? (
        <Line
          options={{
            responsive: true,
            plugins: {},
            scales: {
              yAxes: [
                {
                  gridLines: {
                    color: colors.gray[900],
                    zeroLineColor: colors.gray[900],
                  },
                },
              ],
            },
          }}
          data={{
            labels: activeUsers.map(({ day }) => day),
            datasets: [
              {
                label: 'Daily Active Users',
                data: activeUsers.map(({ users }) => users),
                maxBarThickness: 10,
              },
              // {
              //   label: 'Daily Active Sessions',
              //   data: activeUsers.map(({ sessions }) => sessions),
              //   maxBarThickness: 10,
              // },
            ],
          }}
        />
      ) : (
        <h1 className="text-muted text-center">
          <i className="fas fa-spin fa-spinner" /> Loading...
        </h1>
      )}
    </>
  )
}
