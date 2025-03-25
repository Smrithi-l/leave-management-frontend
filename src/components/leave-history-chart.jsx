"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function LeaveHistoryChart({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current && data) {
      // Destroy existing chart before re-rendering
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      console.log("Leave History Chart Data:", data)

      // Define the correct month order
      const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      // Ensure data arrays exist
      const sickLeave = Array.isArray(data.sickLeave) ? data.sickLeave : []
      const casualLeave = Array.isArray(data.casualLeave) ? data.casualLeave : []
      const medicalLeave = Array.isArray(data.medicalLeave) ? data.medicalLeave : []
      const workFromHome = Array.isArray(data.workFromHome) ? data.workFromHome : []

      // Extract all available months and ensure correct order
      const allMonths = [...new Set([
        ...sickLeave.map(item => item.month),
        ...casualLeave.map(item => item.month),
        ...medicalLeave.map(item => item.month),
        ...workFromHome.map(item => item.month)
      ])]

      // Sort months based on predefined order
      const months = monthsOrder.filter(month => allMonths.includes(month))

      // Function to get leave count for a given month
      const getLeaveCount = (leaveData, month) => {
        const found = leaveData.find(item => item.month === month)
        return found ? found.count : 0
      }

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: months,
          datasets: [
            {
              label: "Sick Leave",
              data: months.map(month => getLeaveCount(sickLeave, month)),
              borderColor: "#f44336",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Casual Leave",
              data: months.map(month => getLeaveCount(casualLeave, month)),
              borderColor: "#ff9800",
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Medical Leave",
              data: months.map(month => getLeaveCount(medicalLeave, month)),
              borderColor: "#2196f3",
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Work From Home",
              data: months.map(month => getLeaveCount(workFromHome, month)),
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#000",
              bodyColor: "#666",
              borderColor: "rgba(0, 0, 0, 0.1)",
              borderWidth: 1,
              padding: 10,
              boxPadding: 5,
              usePointStyle: true,
              callbacks: {
                labelPointStyle: function(context) {
                  return {
                    pointStyle: 'circle',
                    rotation: 0
                  }
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)"
              },
              ticks: {
                precision: 0
              }
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
