"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function MonthlyLeaveReport({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map(item => item.month),
          datasets: [
            {
              label: "Total Leaves",
              data: data.map(item => item.count),
              backgroundColor: "rgba(63, 81, 181, 0.7)",
              borderColor: "rgba(63, 81, 181, 1)",
              borderWidth: 1,
              borderRadius: 6,
              barPercentage: 0.6,
              categoryPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#000",
              bodyColor: "#666",
              borderColor: "rgba(0, 0, 0, 0.1)",
              borderWidth: 1,
              padding: 10,
              boxPadding: 5,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  return `Leaves: ${context.raw}`;
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
