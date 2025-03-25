"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function LeaveTypeDistribution({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      console.log("Leave Type Distribution Data:", data);

      let sickLeaveTotal = 0;
      let casualLeaveTotal = 0;
      let medicalLeaveTotal = 0;
      let workFromHomeTotal = 0;
      if (data && typeof data === "object") {
        if (Array.isArray(data.sickLeave) && data.sickLeave.length > 0) {
          sickLeaveTotal = data.sickLeave.reduce((sum, item) => sum + (item.count ?? 0), 0) || 0;
        }
        if (Array.isArray(data.casualLeave) && data.casualLeave.length > 0) {
          casualLeaveTotal = data.casualLeave.reduce((sum, item) => sum + (item.count ?? 0), 0) || 0;
        }
        if (Array.isArray(data.medicalLeave) && data.medicalLeave.length > 0) {
          medicalLeaveTotal = data.medicalLeave.reduce((sum, item) => sum + (item.count ?? 0), 0) || 0;
        }
        if (Array.isArray(data.workFromHome) && data.workFromHome.length > 0) {
          workFromHomeTotal = data.workFromHome.reduce((sum, item) => sum + (item.count ?? 0), 0) || 0;
        }
      }
      


      console.log("Raw Data:", data);

      console.log("Sick Leave:", sickLeaveTotal);
console.log("Casual Leave:", casualLeaveTotal);
console.log("Medical Leave:", medicalLeaveTotal);
console.log("Work From Home:", workFromHomeTotal);

      
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Sick Leave", "Casual Leave", "Medical Leave", "Work From Home"],
          datasets: [
            {
              data: [sickLeaveTotal, casualLeaveTotal, medicalLeaveTotal, workFromHomeTotal],
              backgroundColor: [
                "rgba(244, 67, 54, 0.7)",
                "rgba(255, 152, 0, 0.7)",
                "rgba(33, 150, 243, 0.7)",
                "rgba(76, 175, 80, 0.7)",
              ],
              borderColor: [
                "rgba(244, 67, 54, 1)",
                "rgba(255, 152, 0, 1)",
                "rgba(33, 150, 243, 1)",
                "rgba(76, 175, 80, 1)",
              ],
              borderWidth: 1,
              hoverOffset: 15,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "60%",
          plugins: {
            legend: {
              position: "right",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                },
              },
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
                label: (context) => {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}
