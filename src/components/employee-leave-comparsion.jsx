"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function EmployeeLeaveComparison({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Destroy existing chart before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    console.log("Employee Leave Comparison Data:", data);

    // Normalize field names to avoid inconsistencies
    const employeeData = [...data].map(item => ({
      name: item.name,
      sickLeave: item.sickLeave || item.sickleave || 0,
      casualLeave: item.casualLeave || item.casualleave || 0,
      medicalLeave: item.medicalLeave || item.medicalleave || 0,
      workFromHome: item.workFromHome || item.workfromhome || 0
    }));

    // Sort employees by total leaves taken
    employeeData.sort((a, b) => {
      const totalA = a.sickLeave + a.casualLeave + a.medicalLeave + a.workFromHome;
      const totalB = b.sickLeave + b.casualLeave + b.medicalLeave + b.workFromHome;
      return totalB - totalA;
    });

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: employeeData.map(item => item.name),
        datasets: [
          {
            axis: "y",
            label: "Total Leaves Taken",
            data: employeeData.map(item => item.sickLeave + item.casualLeave + item.medicalLeave + item.workFromHome),
            backgroundColor: [
              "rgba(63, 81, 181, 0.7)",
              "rgba(156, 39, 176, 0.7)",
              "rgba(233, 30, 99, 0.7)",
              "rgba(0, 150, 136, 0.7)",
              "rgba(255, 193, 7, 0.7)"
            ],
            borderColor: [
              "rgba(63, 81, 181, 1)",
              "rgba(156, 39, 176, 1)",
              "rgba(233, 30, 99, 1)",
              "rgba(0, 150, 136, 1)",
              "rgba(255, 193, 7, 1)"
            ],
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
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
              label: function (context) {
                return `Total Leaves: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: { precision: 0 }
          },
          y: { grid: { display: false } }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}
