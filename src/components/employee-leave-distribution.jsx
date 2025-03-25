"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function EmployeeLeaveDistribution({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      
      // Log data to debug
      console.log("Employee Leave Distribution Data:", data)
      
      // Prepare data for chart - take top 5 employees for better visualization
      const employeeNames = data.slice(0, 5).map(employee => employee.name)
      
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: employeeNames,
          datasets: [
            {
              label: "Sick Leave",
              data: data.slice(0, 5).map(employee => employee.sickLeave || 0),
              backgroundColor: "rgba(244, 67, 54, 0.7)",
              borderColor: "rgba(244, 67, 54, 1)",
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.7,
              categoryPercentage: 0.8
            },
            {
              label: "Casual Leave",
              data: data.slice(0, 5).map(employee => employee.casualLeave || 0),
              backgroundColor: "rgba(255, 152, 0, 0.7)",
              borderColor: "rgba(255, 152, 0, 1)",
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.7,
              categoryPercentage: 0.8
            },
            {
              label: "Medical Leave",
              data: data.slice(0, 5).map(employee => employee.medicalLeave || 0),
              backgroundColor: "rgba(33, 150, 243, 0.7)",
              borderColor: "rgba(33, 150, 243, 1)",
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.7,
              categoryPercentage: 0.8
            },
            {
              label: "Work From Home",
              data: data.slice(0, 5).map(employee => employee.workFromHome || 0),
              backgroundColor: "rgba(76, 175, 80, 0.7)",
              borderColor: "rgba(76, 175, 80, 1)",
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.7,
              categoryPercentage: 0.8
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
              usePointStyle: true
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
