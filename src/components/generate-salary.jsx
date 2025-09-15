"use client"

import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import {
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  styled,
  alpha,
  Avatar,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material"
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
  AccessTime as AccessTimeIcon,
  RestartAlt as RestartAltIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import axios from "axios"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
}))

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

const SummaryCard = styled(Card)(({ theme, cardcolor }) => ({
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  borderTop: `3px solid ${cardcolor}`,
}))

export default function GenerateSalary() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [openSalaryDialog, setOpenSalaryDialog] = useState(false)
  const [openSalarySlipDialog, setOpenSalarySlipDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [generatedSalaries, setGeneratedSalaries] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [attendanceData, setAttendanceData] = useState(null)
  const [pdfData, setPdfData] = useState(null)
  const [salaryCalculation, setSalaryCalculation] = useState({
    originalSalary: 0,
    deduction: 0,
    overtimeBonus: 0,
    netSalary: 0,
  })
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState(null)
  const [overtimeConversions, setOvertimeConversions] = useState([])
  const [extractedDataList, setExtractedDataList] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [duplicateDialog, setDuplicateDialog] = useState({
    open: false,
    existingData: null,
    newData: null,
  })
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    dataId: null,
  })

  useEffect(() => {
    fetchEmployees()
    fetchExtractedDataList()
  }, [])

  const fetchExtractedDataList = async () => {
    try {
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/pdfs")
      if (response.data) {
        // Group by month/year and employee
        const groupedData = response.data.reduce((acc, item) => {
          const date = new Date(item.createdAt || item.updatedAt || Date.now())
          const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`

          if (!acc[monthYear]) {
            acc[monthYear] = []
          }

          acc[monthYear].push({
            ...item,
            extractedAt: date,
          })

          return acc
        }, {})

        setExtractedDataList(groupedData)
      }
    } catch (error) {
      console.error("Error fetching extracted data:", error)
    }
  }

  useEffect(() => {
    fetchEmployees()
    fetchPdfData() // Added to fetch existing PDF data on component mount
  }, [])

  const fetchPdfData = async () => {
    try {
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/pdfs")
      if (response.data && response.data.length > 0) {
        // Get the latest PDF data
        const latestPdf = response.data[response.data.length - 1]
        setPdfData(latestPdf)
        setAttendanceData({
          totalDays: latestPdf.totaldays || 30,
          presentDays: Number.parseInt(latestPdf.present) || 0,
          absentDays: Number.parseInt(latestPdf.absent) || 0,
          totalHours: latestPdf.totalHours || "0",
          totalOT: latestPdf.totalOT || "0",
          weeklyoff: latestPdf.weeklyoff || "0",
          employee: latestPdf.employee || "",
        })
      }
    } catch (error) {
      console.error("Error fetching PDF data:", error)
    }
  }

  const handleReset = async () => {
    try {
      const response = await axios.post("https://leave-management-backend-sa2e.onrender.com/reset-pdf-data")

      // Reset local state
      setExtractedText("")
      setPdfData(null)
      setAttendanceData(null)
      setFile(null)

      setSnackbar({
        open: true,
        message: "All PDF data has been reset successfully!",
        severity: "success",
      })
    } catch (error) {
      console.error("Error resetting data:", error)
      setSnackbar({
        open: true,
        message: "Failed to reset data",
        severity: "error",
      })
    }
  }

  const fetchEmployees = async () => {
    setLoadingEmployees(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/auth/employees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEmployees(response.data)
      setLoadingEmployees(false)
    } catch (error) {
      console.error("Error fetching employees:", error)
      setSnackbar({
        open: true,
        message: "Failed to fetch employees",
        severity: "error",
      })
      setLoadingEmployees(false)
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please select a PDF file",
        severity: "error",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("pdf", file)

    try {
      // First, extract the data to check for duplicates
      const response = await axios.post("https://leave-management-backend-sa2e.onrender.com/upload-preview", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const currentMonthYear = `${selectedMonth}-${selectedYear}`
      const existingDataForMonth = extractedDataList[currentMonthYear] || []

      // Check if there's already data for this month
      if (existingDataForMonth.length > 0) {
        setDuplicateDialog({
          open: true,
          existingData: existingDataForMonth[0],
          newData: response.data,
        })
        setLoading(false)
        return
      }

      // If no duplicates, proceed with normal upload
      await proceedWithUpload(formData)
    } catch (error) {
      console.error("Error uploading file:", error)
      setSnackbar({
        open: true,
        message: "Failed to upload file",
        severity: "error",
      })
      setLoading(false)
    }
  }

  const proceedWithUpload = async (formData) => {
    try {
      const response = await axios.post("https://leave-management-backend-sa2e.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setExtractedText(response.data.text)
      setPdfData(response.data.pdfData)

      if (response.data.pdfData) {
        setAttendanceData({
          totalDays: 30,
          presentDays: Number.parseInt(response.data.pdfData.present) || 0,
          absentDays: Number.parseInt(response.data.pdfData.absent) || 0,
          totalHours: response.data.pdfData.totalHours || "0",
          totalOT: response.data.pdfData.totalOT || "0",
          weeklyoff: response.data.pdfData.weeklyoff || "0",
          employee: response.data.pdfData.employee || "",
        })
      }

      // Refresh the extracted data list
      fetchExtractedDataList()

      setSnackbar({
        open: true,
        message: "PDF uploaded and data extracted successfully!",
        severity: "success",
      })

      setLoading(false)
    } catch (error) {
      console.error("Error uploading file:", error)
      setSnackbar({
        open: true,
        message: "Failed to upload file",
        severity: "error",
      })
      setLoading(false)
    }
  }

  const handleDuplicateChoice = async (choice) => {
    if (choice === "replace") {
      // Delete existing data for the month and upload new
      const currentMonthYear = `${selectedMonth}-${selectedYear}`
      const existingData = extractedDataList[currentMonthYear]

      if (existingData && existingData.length > 0) {
        try {
          // Delete existing records
          await Promise.all(existingData.map((item) => axios.delete(`https://leave-management-backend-sa2e.onrender.com/pdfs/${item._id}`)))

          // Upload new data
          const formData = new FormData()
          formData.append("pdf", file)
          await proceedWithUpload(formData)
        } catch (error) {
          console.error("Error replacing data:", error)
          setSnackbar({
            open: true,
            message: "Failed to replace existing data",
            severity: "error",
          })
        }
      }
    }

    setDuplicateDialog({ open: false, existingData: null, newData: null })
    setLoading(false)
  }

  const handleDeleteExtractedData = async (dataId) => {
    try {
      await axios.delete(`https://leave-management-backend-sa2e.onrender.com/pdfs/${dataId}`)

      setSnackbar({
        open: true,
        message: "Extracted data deleted successfully",
        severity: "success",
      })

      // Refresh the list
      fetchExtractedDataList()
    } catch (error) {
      console.error("Error deleting data:", error)
      setSnackbar({
        open: true,
        message: "Failed to delete data",
        severity: "error",
      })
    }

    setDeleteConfirmDialog({ open: false, dataId: null })
  }

  // Calculate working days excluding weekends
  const calculateWorkingDays = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate()
    let weekendDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dayOfWeek = date.getDay()

      // 0 is Sunday, 6 is Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++
      }
    }

    return daysInMonth - weekendDays
  }

  // Update the handleGenerateSalary function to properly fetch and handle attendance data
  const handleGenerateSalary = async (employee) => {
    setSelectedEmployee(employee)
    setLoading(true)

    try {
      // Fetch attendance data for this employee
      const token = localStorage.getItem("token")
      const attendanceResponse = await axios.get(
        `https://leave-management-backend-sa2e.onrender.com/api/dashboard/employees/${employee._id}/attendance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      // Get current month and year
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
      const currentYear = currentDate.getFullYear()

      // Calculate working days excluding weekends
      const workingDays = attendanceResponse.data?.totaldays || 30 // fallback to 30 if not provided

      if (attendanceResponse.data) {
        setAttendanceData({
          ...attendanceResponse.data,
          totalDays: workingDays, // Use calculated working days instead of fixed 30
        })
        console.log("Attendance data for", employee.name, ":", attendanceResponse.data)
      } else {
        setAttendanceData({
          totalDays: workingDays, // Use calculated working days
          presentDays: workingDays, // Assume all working days are present if no data
          absentDays: 0,
          totalHours: "0",
          totalOT: "0",
          weeklyoff: "0",
          totaldays: "0",
          employee: employee.name,
        })
      }

      // Calculate salary components based on attendance data and working days
      const originalSalary = employee.salary || 0
      const dailyWage = originalSalary / workingDays // Use working days for daily wage calculation

      const absentDays = attendanceResponse.data ? attendanceResponse.data.absentDays : 0
      const deduction = dailyWage * absentDays

      // Calculate overtime bonus if available
      const overtimeHours =
        attendanceResponse.data && attendanceResponse.data.totalOT
          ? Number.parseFloat(attendanceResponse.data.totalOT)
          : 0
      const overtimeRate = (dailyWage / 8) * 1.5 // Assuming 8-hour workday and 1.5x overtime rate
      const overtimeBonus = overtimeHours * overtimeRate

      // Check if overtime hours can be converted to casual leave
      let overtimeConversionMessage = null
      if (overtimeHours >= 60) {
        const casualLeaveDays = Math.floor(overtimeHours / 60)
        overtimeConversionMessage = `${overtimeHours} overtime hours can be converted to ${casualLeaveDays} day(s) of casual leave`
      }

      // Calculate net salary
      const netSalary = originalSalary - deduction + overtimeBonus

      // Set salary calculation
      setSalaryCalculation({
        originalSalary,
        deduction,
        overtimeBonus,
        netSalary,
        overtimeConversionMessage,
        workingDays,
      })

      setLoading(false)
      setOpenSalaryDialog(true)
    } catch (error) {
      console.error("Error preparing salary data:", error)
      setSnackbar({
        open: true,
        message: "Failed to prepare salary data: " + (error.response?.data?.message || error.message),
        severity: "error",
      })
      setLoading(false)
    }
  }

  // Update the handleSaveSalary function to call the API correctly
  const handleSaveSalary = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      // Check if overtime hours can be converted to casual leave
      const overtimeHours = attendanceData?.totalOT ? Number.parseFloat(attendanceData.totalOT) : 0
      let overtimeConversionResult = null

      if (overtimeHours >= 60) {
        const casualLeaveDays = Math.floor(overtimeHours / 60)
        const remainingOTHours = overtimeHours % 60

        // Call API to convert overtime to casual leave
        try {
          const conversionResponse = await axios.post(
            "https://leave-management-backend-sa2e.onrender.com/api/dashboard/convert-overtime",
            {
              employeeId: selectedEmployee._id,
              casualLeaveDays,
              remainingOTHours,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          )

          overtimeConversionResult = {
            success: true,
            message: `Successfully converted ${casualLeaveDays} day(s) of casual leave from overtime`,
            casualLeaveDays,
            remainingOTHours,
          }

          // Add to overtime conversions list
          setOvertimeConversions([
            ...overtimeConversions,
            {
              id: Date.now(),
              employeeId: selectedEmployee._id,
              employeeName: selectedEmployee.name,
              overtimeHours,
              casualLeaveDays,
              date: new Date().toISOString(),
            },
          ])
        } catch (error) {
          console.error("Error converting overtime to casual leave:", error)
          overtimeConversionResult = {
            success: false,
            message: "Failed to convert overtime to casual leave",
          }
        }
      }

      // Update salary
      const response = await axios.post(
        "https://leave-management-backend-sa2e.onrender.com/api/dashboard/employees/update-salary",
        {
          employeeId: selectedEmployee._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      // Add the new salary to the generated salaries list
      const { netSalary, deductions } = response.data

      const newSalary = {
        id: Date.now() + selectedEmployee._id,
        employeeId: selectedEmployee._id,
        employeeName: selectedEmployee.name,
        month: new Date().toLocaleString("default", { month: "long" }),
        year: new Date().getFullYear(),
        originalSalary: deductions?.originalSalary || salaryCalculation.originalSalary,
        workingDays: salaryCalculation.workingDays,
        absentDays: deductions?.absentDays || attendanceData?.absentDays || 0,
        weeklyoff: deductions?.weeklyoff || attendanceData?.weeklyoff || 0,
        deduction: deductions?.deduction || salaryCalculation.deduction,
        overtimeHours: deductions?.overtimeHours || attendanceData?.totalOT || 0,
        overtimeBonus: deductions?.overtimeBonus || salaryCalculation.overtimeBonus,
        netSalary: salaryCalculation.netSalary,
        generatedOn: new Date().toISOString(),
        status: "Generated",
        overtimeConversion: overtimeConversionResult,
      }

      setGeneratedSalaries([newSalary, ...generatedSalaries])

      let successMessage = "Salary slip generated successfully"
      if (overtimeConversionResult && overtimeConversionResult.success) {
        successMessage += `. ${overtimeConversionResult.message}`
      }

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      })

      setOpenSalaryDialog(false)

      // Automatically show the salary slip with export options
      const employee = employees.find((emp) => emp._id === newSalary.employeeId)
      if (employee) {
        setSelectedEmployee(employee)
        setSalaryCalculation({
          originalSalary: newSalary.originalSalary,
          deduction: newSalary.deduction,
          overtimeBonus: newSalary.overtimeBonus,
          netSalary: newSalary.netSalary,
          workingDays: newSalary.workingDays,
          overtimeConversionMessage: overtimeConversionResult?.message,
        })
        setAttendanceData({
          totalDays: newSalary.workingDays,
          presentDays: newSalary.workingDays - newSalary.absentDays,
          absentDays: newSalary.absentDays,
          weeklyoff: newSalary.weeklyoff,
          totalOT: overtimeConversionResult?.remainingOTHours?.toString() || newSalary.overtimeHours.toString(),
          employee: newSalary.employeeName,
        })
        setOpenSalarySlipDialog(true)
      }

      // Refresh employees to get updated leave balances
      fetchEmployees()
    } catch (error) {
      console.error("Error saving salary:", error)
      setSnackbar({
        open: true,
        message: "Failed to generate salary slip: " + (error.response?.data?.message || error.message),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAllSalaries = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const newSalaries = []
      const failedEmployees = []
      const newOvertimeConversions = []

      const workingDays = calculateWorkingDays(selectedMonth, selectedYear)

      // Filter employees and only generate for those with data in selected month
      const currentMonthYear = `${selectedMonth}-${selectedYear}`
      const monthlyData = extractedDataList[currentMonthYear] || []

      if (monthlyData.length === 0) {
        setSnackbar({
          open: true,
          message: `No extracted data found for ${getMonthName(selectedMonth)} ${selectedYear}. Please upload attendance data first.`,
          severity: "warning",
        })
        setLoading(false)
        return
      }

      // Get employees who have data for this month
      const employeesWithData = employees.filter((emp) => monthlyData.some((data) => data.employee === emp.name))

      for (const employee of employeesWithData) {
        try {
          const attendanceResponse = await axios.get(
            `https://leave-management-backend-sa2e.onrender.com/api/dashboard/employees/${employee._id}/attendance`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          let employeeAttendance = {
            totalDays: workingDays,
            presentDays: workingDays,
            absentDays: 0,
            totalHours: "0",
            totalOT: "0",
            employee: employee.name,
          }

          if (attendanceResponse.data && attendanceResponse.data.employee) {
            employeeAttendance = {
              ...attendanceResponse.data,
              totalDays: workingDays,
            }
          }

          const originalSalary = employee.salary || 0
          const dailyWage = originalSalary / workingDays
          const absentDays = employeeAttendance.absentDays || 0
          const deduction = dailyWage * absentDays
          const overtimeHours = employeeAttendance.totalOT
          const overtimeRate = (dailyWage / 8) * 1.5
          const overtimeBonus = overtimeHours * overtimeRate
          const netSalary = originalSalary - deduction + overtimeBonus
          console.log(overtimeHours)
          let overtimeConversionResult = null

          if (overtimeHours >= 1) {
            const casualLeaveDays = Math.floor(overtimeHours / 60)
            const remainingOTHours = overtimeHours % 60

            try {
              const conversionResponse = await axios.post(
                "https://leave-management-backend-sa2e.onrender.com/api/dashboard/convert-overtime",
                {
                  employeeId: employee._id,
                  casualLeaveDays,
                  remainingOTHours,
                },
                { headers: { Authorization: `Bearer ${token}` } },
              )

              overtimeConversionResult = {
                success: true,
                message: `Successfully converted ${casualLeaveDays} day(s) of casual leave from overtime`,
                casualLeaveDays,
                remainingOTHours,
              }
              newOvertimeConversions.push({
                id: Date.now() + employee._id,
                employeeId: employee._id,
                employeeName: employee.name,
                overtimeHours,
                casualLeaveDays,
                date: new Date().toISOString(),
              })
            } catch (error) {
              console.error(`Error converting overtime to casual leave for ${employee.name}:`, error)
              overtimeConversionResult = {
                success: false,
                message: "Failed to convert overtime to casual leave",
              }
            }
          }

          const response = await axios.post(
            "https://leave-management-backend-sa2e.onrender.com/api/dashboard/employees/update-salary",
            {
              employeeId: employee._id,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          newSalaries.push({
            id: Date.now() + employee._id,
            employeeId: employee._id,
            employeeName: employee.name,
            month: new Date().toLocaleString("default", { month: "long" }),
            year: new Date().getFullYear(),
            originalSalary: originalSalary,
            workingDays: workingDays,
            absentDays: absentDays,
            deduction: deduction,
            overtimeHours: overtimeConversionResult?.remainingOTHours || overtimeHours,
            overtimeBonus: overtimeBonus,
            netSalary: netSalary,
            generatedOn: new Date().toISOString(),
            status: "Generated",
            overtimeConversion: overtimeConversionResult,
          })
        } catch (error) {
          console.error(`Error generating salary for ${employee.name}:`, error)
          failedEmployees.push({
            name: employee.name,
            reason: error.response?.data?.message || error.message,
          })
        }
      }

      if (newSalaries.length > 0) {
        setGeneratedSalaries([...newSalaries, ...generatedSalaries])

        if (newOvertimeConversions.length > 0) {
          setOvertimeConversions([...newOvertimeConversions, ...overtimeConversions])
        }

        exportToExcel(newSalaries)

        let message = `Successfully generated salary slips for ${newSalaries.length} employees and exported to Excel`
        if (newOvertimeConversions.length > 0) {
          message += `. Converted overtime to casual leave for ${newOvertimeConversions.length} employees.`
        }
        if (failedEmployees.length > 0) {
          message += `. Failed for ${failedEmployees.length} employees.`
        }

        setSnackbar({
          open: true,
          message,
          severity: "success",
        })
      } else {
        setSnackbar({
          open: true,
          message: `Failed to generate any salary slips. Please check if attendance data exists for employees.`,
          severity: "error",
        })
      }

      fetchEmployees()
    } catch (error) {
      console.error("Error generating all salaries:", error)
      setSnackbar({
        open: true,
        message: "Failed to generate all salary slips: " + (error.response?.data?.message || error.message),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[monthNumber - 1]
  }

  const exportToExcel = (salaryData) => {
    try {
      const excelData = salaryData.map((salary) => {
        const employee = employees.find((emp) => emp._id === salary.employeeId) || {}

        return {
          "Employee ID": salary.employeeId || "N/A",
          "Employee Name": salary.employeeName || "N/A",
          Email: employee.email || "N/A",
          Role: employee.role || "N/A",
          Department: employee.department || "N/A",
          Month: salary.month || new Date().toLocaleString("default", { month: "long" }),
          Year: salary.year || new Date().getFullYear(),
          "Working Days": salary.workingDays || 0,
          "Original Salary": salary.originalSalary || 0,
          "Present Days": (salary.workingDays || 0) - (salary.absentDays || 0),
          "Absent Days": salary.absentDays || 0,
          Deduction: salary.deduction || 0,
          "Overtime Hours": salary.overtimeHours || 0,
          "Overtime Bonus": salary.overtimeBonus || 0,
          "Net Salary": salary.netSalary || 0,
          "Generated On": new Date(salary.generatedOn || Date.now()).toLocaleDateString(),
          Status: salary.status || "Generated",
          "Overtime Conversion": salary.overtimeConversion?.success
            ? `Converted ${salary.overtimeConversion.casualLeaveDays} days of casual leave`
            : "None",
        }
      })

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData)

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Employee ID
        { wch: 20 }, // Employee Name
        { wch: 25 }, // Email
        { wch: 15 }, // Role
        { wch: 15 }, // Department
        { wch: 10 }, // Month
        { wch: 6 }, // Year
        { wch: 12 }, // Working Days
        { wch: 15 }, // Original Salary
        { wch: 12 }, // Present Days
        { wch: 12 }, // Absent Days
        { wch: 12 }, // Deduction
        { wch: 15 }, // Overtime Hours
        { wch: 15 }, // Overtime Bonus
        { wch: 12 }, // Net Salary
        { wch: 15 }, // Generated On
        { wch: 10 }, // Status
        { wch: 25 }, // Overtime Conversion
      ]
      worksheet["!cols"] = columnWidths

      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Slips")

      // Generate Excel file
      const currentDate = new Date().toISOString().split("T")[0]
      XLSX.writeFile(workbook, `Salary_Report_${currentDate}.xlsx`)

      setSnackbar({
        open: true,
        message: "Successfully exported all salary data to Excel",
        severity: "success",
      })
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      setSnackbar({
        open: true,
        message: "Failed to export data to Excel: " + error.message,
        severity: "error",
      })
    }
  }

  const handleViewSalarySlip = (salary) => {
    // Find the employee
    const employee = employees.find((emp) => emp._id === salary.employeeId)
    if (employee) {
      setSelectedEmployee(employee)
      setSalaryCalculation({
        originalSalary: salary.originalSalary,
        deduction: salary.deduction,
        overtimeBonus: salary.overtimeBonus,
        netSalary: salary.netSalary,
        workingDays: salary.workingDays,
        overtimeConversionMessage: salary.overtimeConversion?.message,
      })
      setAttendanceData({
        totalDays: salary.workingDays,
        presentDays: salary.workingDays - salary.absentDays,
        absentDays: salary.absentDays,
        totalOT: salary.overtimeHours.toString(),
        employee: salary.employeeName,
      })
      setOpenSalarySlipDialog(true)
    }
  }

  const handleDownloadSalarySlip = () => {
    const content = document.getElementById("salary-slip-print")

    if (!content) {
      setSnackbar({
        open: true,
        message: "Could not find salary slip content to print",
        severity: "error",
      })
      return
    }

    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      setSnackbar({
        open: true,
        message: "Pop-up blocked. Please allow pop-ups to print salary slip.",
        severity: "error",
      })
      return
    }

    printWindow.document.write(`
<html>
  <head>
    <title>Salary Slip - ${selectedEmployee?.name || "Employee"}</title>
    <style>
      @page {
        size: A4;
        margin: 2cm;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: auto;
        background: white;
      }
      .container {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #3f51b5;
        padding-bottom: 15px;
      }
      .company-logo {
        max-width: 120px;
      }
      .company-name {
        font-size: 22px;
        font-weight: bold;
        color: #3f51b5;
        text-align: center;
        flex-grow: 1;
      }
      .salary-slip-title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
      .employee-details, .attendance-info {
        margin: 20px 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 6px;
      }
      .info-label {
        color: #666;
        font-weight: bold;
      }
      .info-value {
        font-weight: 500;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      th {
        background: #f5f5f5;
        font-weight: bold;
      }
      .total-row {
        font-weight: bold;
        background: #f5f5f5;
      }
      .net-salary {
        font-size: 20px;
        font-weight: bold;
        color: #3f51b5;
        text-align: right;
      }
      .footer {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
      }
      .signature-line {
        margin-top: 30px;
        border-top: 1px solid black;
        width: 150px;
        text-align: center;
        padding-top: 5px;
      }
      .disclaimer {
        margin-top: 20px;
        padding: 10px;
        font-size: 12px;
        color: #666;
        background: #f5f5f5;
        border-radius: 4px;
        text-align: center;
      }
      .overtime-conversion {
        margin-top: 15px;
        padding: 10px;
        background-color: #e3f2fd;
        border-radius: 4px;
        border-left: 4px solid #2196f3;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        button {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
<img src="1.jpg" class="company-logo" alt="Company Logo">

        <div class="company-name">ThingsDock</div>
        <div class="salary-slip-title">Salary Slip</div>
      </div>

      <div class="employee-details">
        <div><span class="info-label">Employee Name:</span> ${selectedEmployee?.name}</div>
        <div><span class="info-label">Employee ID:</span> ${selectedEmployee?._id}</div>
        <div><span class="info-label">Designation:</span> ${selectedEmployee?.role}</div>
        <div><span class="info-label">Month & Year:</span> ${new Date().toLocaleString("default", { month: "long", year: "numeric" })}</div>
      </div>

      <div class="attendance-info">
        <div><span class="info-label">Working Days:</span> ${salaryCalculation?.workingDays || 0}</div>
        <div><span class="info-label">Present Days:</span> ${attendanceData?.presentDays || 0}</div>
        <div><span class="info-label">Absent Days:</span> ${attendanceData?.absentDays || 0}</div>
        <div><span class="info-label">Overtime Hours:</span> ${attendanceData?.totalOT || 0}</div>
      </div>

      <table>
        <tr>
          <th>Earnings</th>
          <th>Amount</th>
          <th>Deductions</th>
          <th>Amount</th>
        </tr>
        <tr>
          <td>Basic Salary</td>
          <td>${salaryCalculation?.originalSalary.toFixed(2)}</td>
          <td>Leave Deductions</td>
          <td>${salaryCalculation?.deduction.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Overtime Bonus</td>
          <td>${salaryCalculation?.overtimeBonus.toFixed(2)}</td>
          <td>Other Deductions</td>
          <td>0.00</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" class="net-salary">Net Salary: ${salaryCalculation?.netSalary.toFixed(2)}</td>
          <td colspan="2"></td>
        </tr>
      </table>

      ${
        salaryCalculation?.overtimeConversionMessage
          ? `
      <div class="overtime-conversion">
        <strong>Overtime Conversion:</strong> ${salaryCalculation.overtimeConversionMessage}
      </div>
      `
          : ""
      }

      <div class="footer">
        <div class="signature-line">Employee Signature</div>
        <div class="signature-line">HR Signature</div>
      </div>

      <div class="disclaimer">
        This is a computer-generated document and does not require a signature. If you have any queries regarding your salary, please contact the HR department.
      </div>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <button onclick="window.print(); window.close();" style="padding: 10px 20px; background: #3f51b5; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Print Salary Slip
      </button>
    </div>
  </body>
</html>

    `)

    printWindow.document.close()
  }

  // Function to export single employee salary data to Excel
  const exportSingleSalaryToExcel = (employee, salaryData) => {
    try {
      // Format data for Excel
      const excelData = [
        {
          "Employee ID": employee._id,
          "Employee Name": employee.name,
          Email: employee.email,
          Role: employee.role,
          Department: employee.department || "N/A",
          Month: new Date().toLocaleString("default", { month: "long" }),
          Year: new Date().getFullYear(),
          "Working Days": salaryData.workingDays,
          "Original Salary": salaryData.originalSalary,
          "Present Days": attendanceData?.presentDays || salaryData.workingDays - (attendanceData?.absentDays || 0),
          "Absent Days": attendanceData?.absentDays || 0,
          Deduction: salaryData.deduction,
          "Overtime Hours": attendanceData?.totalOT || 0,
          "Overtime Bonus": salaryData.overtimeBonus,
          "Net Salary": salaryData.netSalary,
          "Generated On": new Date().toLocaleDateString(),
          Status: "Generated",
          "Overtime Conversion": salaryData.overtimeConversionMessage || "None",
        },
      ]

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData)

      // Set column widths
      const columnWidths = [
        { wch: 15 }, // Employee ID
        { wch: 20 }, // Employee Name
        { wch: 25 }, // Email
        { wch: 15 }, // Role
        { wch: 15 }, // Department
        { wch: 10 }, // Month
        { wch: 6 }, // Year
        { wch: 12 }, // Working Days
        { wch: 15 }, // Original Salary
        { wch: 12 }, // Present Days
        { wch: 12 }, // Absent Days
        { wch: 12 }, // Deduction
        { wch: 15 }, // Overtime Hours
        { wch: 15 }, // Overtime Bonus
        { wch: 12 }, // Net Salary
        { wch: 15 }, // Generated On
        { wch: 10 }, // Status
        { wch: 25 }, // Overtime Conversion
      ]
      worksheet["!cols"] = columnWidths

      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Slip")

      // Generate Excel file
      XLSX.writeFile(
        workbook,
        `Salary_Slip_${employee.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`,
      )

      setSnackbar({
        open: true,
        message: `Salary slip for ${employee.name} exported to Excel successfully`,
        severity: "success",
      })
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      setSnackbar({
        open: true,
        message: "Failed to export data to Excel",
        severity: "error",
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleEditEmployee = (employee) => {
    setEditedEmployee({
      ...employee,
      // Make a copy to avoid modifying the original
    })
    setOpenEditDialog(true)
  }

  const handleSaveEmployeeEdit = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.put(`https://leave-management-backend-sa2e.onrender.com/api/dashboard/update-employee/${editedEmployee._id}`, editedEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSnackbar({
        open: true,
        message: "Employee details updated successfully",
        severity: "success",
      })

      setOpenEditDialog(false)
      fetchEmployees() // Refresh the employee list
    } catch (error) {
      console.error("Error updating employee:", error)
      setSnackbar({
        open: true,
        message: "Failed to update employee: " + (error.response?.data?.message || error.message),
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase())

    // If we don't have department info, just use the search filter
    if (!employee.department) {
      return matchesSearch
    }

    const matchesDepartment = filterDepartment === "All" || employee.department === filterDepartment

    return matchesSearch && matchesDepartment
  })

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Salary Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and manage employee salary slips with monthly filtering
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Select Month & Year for Payroll
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(e.target.value)}>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i
                    return (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Total Payroll for {getMonthName(selectedMonth)} {selectedYear}: ${(() => {
                  const currentMonthYear = `${selectedMonth}-${selectedYear}`
                  const monthlyData = extractedDataList[currentMonthYear] || []
                  const employeesWithData = employees.filter((emp) =>
                    monthlyData.some((data) => data.employee === emp.name),
                  )
                  return employeesWithData.reduce((sum, emp) => sum + (emp.salary || 0), 0).toLocaleString()
                })()}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Extracted Data History
          </Typography>
          {Object.keys(extractedDataList).length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Month/Year</StyledTableCell>
                    <StyledTableCell>Employees</StyledTableCell>
                    <StyledTableCell>Extracted On</StyledTableCell>
                    <StyledTableCell>Total Records</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(extractedDataList).map(([monthYear, data]) => {
                    const [month, year] = monthYear.split("-")
                    const latestExtraction = data.reduce((latest, current) =>
                      new Date(current.extractedAt) > new Date(latest.extractedAt) ? current : latest,
                    )

                    return (
                      <StyledTableRow key={monthYear}>
                        <TableCell>
                          <Chip
                            label={`${getMonthName(Number.parseInt(month))} ${year}`}
                            color={monthYear === `${selectedMonth}-${selectedYear}` ? "primary" : "default"}
                            variant={monthYear === `${selectedMonth}-${selectedYear}` ? "filled" : "outlined"}
                          />
                        </TableCell>
                        <TableCell>{[...new Set(data.map((d) => d.employee))].join(", ")}</TableCell>
                        <TableCell>{new Date(latestExtraction.extractedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{data.length}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete all data for this month">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                setDeleteConfirmDialog({
                                  open: true,
                                  dataId: monthYear,
                                })
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
              No extracted data found. Upload a PDF to get started.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* PDF Text Extractor Section */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Upload Your PDF Attendance Sheet
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ height: "56px", borderRadius: 2 }}
                >
                  Select PDF File
                  <VisuallyHiddenInput type="file" accept="application/pdf" onChange={handleFileChange} />
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!file || loading}
                  fullWidth
                  sx={{ height: "56px", borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Upload & Extract"}
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReset}
                  disabled={loading}
                  fullWidth
                  sx={{ height: "56px", borderRadius: 2 }}
                  startIcon={<RestartAltIcon />}
                >
                  Reset All Data
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {extractedText && (
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
              Extracted Text:
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: "200px",
                overflow: "auto",
                bgcolor: alpha("#f5f5f5", 0.5),
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {extractedText}
            </Paper>

            {pdfData && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
                  Extracted Attendance Data:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Employee
                      </Typography>
                      <Typography variant="h6">{pdfData.employee || "N/A"}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Present Days
                      </Typography>
                      <Typography variant="h6">{pdfData.present || "N/A"}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Absent Days
                      </Typography>
                      <Typography variant="h6">{pdfData.absent || "N/A"}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Hours
                      </Typography>
                      <Typography variant="h6">{pdfData.totalHours || "N/A"}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Total OT
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {pdfData.totalOT || "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Weekly Off
                      </Typography>
                      <Typography variant="h6">{pdfData.weeklyoff || "N/A"}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Employee Salary Management */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Employee Salary Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateAllSalaries}
          disabled={loading}
          startIcon={<FileDownloadIcon />}
          sx={{
            borderRadius: 8,
            px: 3,
            boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generate All Salary Slips"}
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search employees..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "40%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="filter-department-label">Department</InputLabel>
          <Select
            labelId="filter-department-label"
            value={filterDepartment}
            label="Department"
            onChange={(e) => setFilterDepartment(e.target.value)}
            startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
          >
            <MenuItem value="All">All Departments</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Product">Product</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Analytics">Analytics</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Employee</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Team Leader</StyledTableCell>
                <StyledTableCell>Current Salary</StyledTableCell>
                <StyledTableCell>Leave Balance</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingEmployees ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading employees...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <StyledTableRow key={employee._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                          {getInitials(employee.name)}
                        </Avatar>
                        {employee.name}
                      </Box>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.isTeamLeader ? "Yes" : "No"}</TableCell>
                    <TableCell>${(employee.salary || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title="Casual Leave">
                          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                            <Typography variant="body2" color="primary">
                              CL: {employee.casualleave || 0}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Sick Leave">
                          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                            <Typography variant="body2" color="error">
                              SL: {employee.sickleave || 0}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleGenerateSalary(employee)}
                          sx={{ borderRadius: 8 }}
                        >
                          Generate Salary
                        </Button>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No employees found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Generated Salary Slips */}
      {generatedSalaries.length > 0 && (
        <>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Generated Salary Slips
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => exportToExcel(generatedSalaries)}
              startIcon={<FileDownloadIcon />}
              sx={{ borderRadius: 8 }}
            >
              Export All to Excel
            </Button>
          </Box>

          <Paper
            elevation={0}
            sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", mb: 4 }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Employee</StyledTableCell>
                    <StyledTableCell>Month</StyledTableCell>
                    <StyledTableCell>Working Days</StyledTableCell>
                    <StyledTableCell>Net Salary</StyledTableCell>
                    <StyledTableCell>Overtime</StyledTableCell>
                    <StyledTableCell>Generated On</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generatedSalaries.map((salary) => (
                    <StyledTableRow key={salary.id}>
                      <TableCell>{salary.employeeName}</TableCell>
                      <TableCell>{`${salary.month} ${salary.year}`}</TableCell>
                      <TableCell>{salary.workingDays}</TableCell>
                      <TableCell>${salary.netSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {salary.overtimeHours > 0 ? (
                            <>
                              <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                              <Typography variant="body2">
                                {salary.overtimeHours} hrs
                                {salary.overtimeConversion?.success && (
                                  <Tooltip title={salary.overtimeConversion.message}>
                                    <Box component="span" sx={{ ml: 1, color: "success.main", fontWeight: "medium" }}>
                                      (Converted)
                                    </Box>
                                  </Tooltip>
                                )}
                              </Typography>
                            </>
                          ) : (
                            "None"
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(salary.generatedOn).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleViewSalarySlip(salary)}
                          sx={{ borderRadius: 8, mr: 1 }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<PrintIcon />}
                          onClick={() => {
                            handleViewSalarySlip(salary)
                            setTimeout(() => handleDownloadSalarySlip(), 500)
                          }}
                          sx={{ borderRadius: 8 }}
                        >
                          Print
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Salary Details Dialog */}
      <Dialog open={openSalaryDialog} onClose={() => setOpenSalaryDialog(false)} maxWidth="md" fullWidth>
        {selectedEmployee && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Generate Salary Slip for {selectedEmployee.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
                    Employee Details
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{selectedEmployee.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{selectedEmployee.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Role
                      </Typography>
                      <Typography variant="body1">{selectedEmployee.role}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {attendanceData && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
                      Attendance Details
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Working Days
                          </Typography>
                          <Typography variant="h6">{salaryCalculation.workingDays}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Present Days
                          </Typography>
                          <Typography variant="h6">{attendanceData.presentDays || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Absent Days
                          </Typography>
                          <Typography variant="h6">{attendanceData.absentDays || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Overtime Hours
                          </Typography>
                          <Typography variant="h6">{attendanceData.totalOT || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            weeklyoff
                          </Typography>
                          <Typography variant="h6">{attendanceData.weeklyoff || 0}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 2 }}>
                    Salary Calculation
                  </Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ mb: 3, border: "1px solid rgba(0,0,0,0.08)" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Original Salary</TableCell>
                          <TableCell align="right">${salaryCalculation.originalSalary.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Absent Days Deduction ({attendanceData?.absentDays || 0} days)</TableCell>
                          <TableCell align="right">-${salaryCalculation.deduction.toLocaleString()}</TableCell>
                        </TableRow>
                        {salaryCalculation.overtimeBonus > 0 && (
                          <TableRow>
                            <TableCell>Overtime Bonus ({attendanceData?.totalOT || 0} hours)</TableCell>
                            <TableCell align="right">+${salaryCalculation.overtimeBonus.toLocaleString()}</TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Net Salary</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>
                            ${salaryCalculation.netSalary.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {salaryCalculation.overtimeConversionMessage && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {salaryCalculation.overtimeConversionMessage}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                onClick={() => setOpenSalaryDialog(false)}
                color="inherit"
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => exportSingleSalaryToExcel(selectedEmployee, salaryCalculation)}
                color="primary"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                sx={{ borderRadius: 8 }}
              >
                Export to Excel
              </Button>
              <Button
                onClick={handleSaveSalary}
                color="primary"
                variant="contained"
                startIcon={<DownloadIcon />}
                disabled={loading}
                sx={{
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Generate & Save"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Salary Slip Dialog */}
      <Dialog open={openSalarySlipDialog} onClose={() => setOpenSalarySlipDialog(false)} maxWidth="md" fullWidth>
        {selectedEmployee && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Salary Slip - {selectedEmployee.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Paper elevation={0} sx={{ p: 3, border: "1px dashed rgba(0,0,0,0.12)" }} id="salary-slip-print">
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                      COMPANY NAME
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 Business Street, City, Country
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: (123) 456-7890 | Email: hr@company.com
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h6">SALARY SLIP</Typography>
                    <Typography variant="body2" color="text.secondary">
                      For the month of {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Employee Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {selectedEmployee.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Employee ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      EMP-{selectedEmployee._id.substring(0, 6).toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{selectedEmployee.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Position
                    </Typography>
                    <Typography variant="body1">
                      {selectedEmployee.isTeamLeader ? "Team Leader" : "Employee"}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Attendance Information */}
                {attendanceData && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: alpha("#f5f5f5", 0.5), borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "medium" }}>
                      Attendance Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Working Days
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                          {salaryCalculation.workingDays || attendanceData.totalDays || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Present Days
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                          {attendanceData.presentDays || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Absent Days
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                          {attendanceData.absentDays || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Overtime Hours
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                          {attendanceData.totalOT || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Salary Details
                </Typography>

                <TableContainer component={Paper} elevation={0} sx={{ mb: 3, border: "1px solid rgba(0,0,0,0.08)" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Original Salary</TableCell>
                        <TableCell align="right">${salaryCalculation.originalSalary.toLocaleString()}</TableCell>
                      </TableRow>
                      {attendanceData && attendanceData.absentDays > 0 && (
                        <TableRow>
                          <TableCell>Absent Days Deduction ({attendanceData.absentDays} days)</TableCell>
                          <TableCell align="right">-${salaryCalculation.deduction.toLocaleString()}</TableCell>
                        </TableRow>
                      )}
                      {attendanceData && Number.parseFloat(attendanceData.totalOT) > 0 && (
                        <TableRow>
                          <TableCell>Overtime Bonus ({attendanceData.totalOT} hours)</TableCell>
                          <TableCell align="right">+${salaryCalculation.overtimeBonus.toLocaleString()}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Net Salary</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>
                          ${salaryCalculation.netSalary.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {salaryCalculation.overtimeConversionMessage && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: alpha("#e3f2fd", 0.7),
                      borderRadius: 1,
                      borderLeft: "4px solid #2196f3",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "medium", color: "#0d47a1" }}>
                      <strong>Overtime Conversion:</strong> {salaryCalculation.overtimeConversionMessage}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Payment Method
                  </Typography>
                  <Typography variant="body2">Direct Bank Transfer</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Authorized Signature
                    </Typography>
                    <Box sx={{ mt: 4, borderTop: "1px solid black", width: 150 }} />
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Employee Signature
                    </Typography>
                    <Box sx={{ mt: 4, borderTop: "1px solid black", width: 150, ml: "auto" }} />
                  </Box>
                </Box>

                <Box sx={{ mt: 4, bgcolor: alpha("#f5f5f5", 0.5), p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    This is a computer-generated salary slip and does not require a physical signature. For any queries
                    regarding this salary slip, please contact the HR department.
                  </Typography>
                </Box>
              </Paper>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                onClick={() => setOpenSalarySlipDialog(false)}
                color="inherit"
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                Close
              </Button>
              <Button
                onClick={() => exportSingleSalaryToExcel(selectedEmployee, salaryCalculation)}
                color="primary"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                sx={{ borderRadius: 8 }}
              >
                Export to Excel
              </Button>
              <Button
                color="primary"
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={handleDownloadSalarySlip}
                sx={{
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                  },
                }}
              >
                Print Salary Slip
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        {editedEmployee && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Edit Employee Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={editedEmployee.name}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={editedEmployee.email}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    type="number"
                    value={editedEmployee.salary || 0}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, salary: Number(e.target.value) })}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1 }}>
                          $
                        </Box>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Leaves"
                    type="number"
                    value={editedEmployee.totalLeaves || 0}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, totalLeaves: Number(e.target.value) })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sick Leave"
                    type="number"
                    value={editedEmployee.sickleave || 0}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, sickleave: Number(e.target.value) })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Casual Leave"
                    type="number"
                    value={editedEmployee.casualleave || 0}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, casualleave: Number(e.target.value) })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Medical Leave"
                    type="number"
                    value={editedEmployee.medicalleave || 0}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, medicalleave: Number(e.target.value) })}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Work From Home"
                    type="number"
                    value={editedEmployee.Workfromhome || 0}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, Workfromhome: Number(e.target.value) })}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                onClick={() => setOpenEditDialog(false)}
                color="inherit"
                variant="outlined"
                sx={{ borderRadius: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEmployeeEdit}
                color="primary"
                variant="contained"
                disabled={loading}
                sx={{
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={duplicateDialog.open}
        onClose={() => setDuplicateDialog({ open: false, existingData: null, newData: null })}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            Duplicate Data Detected
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Data for {getMonthName(selectedMonth)} {selectedYear} already exists. What would you like to do?
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Existing data was extracted on:{" "}
            {duplicateDialog.existingData?.extractedAt
              ? new Date(duplicateDialog.existingData.extractedAt).toLocaleDateString()
              : "Unknown"}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDuplicateChoice("keep")} color="inherit">
            Keep Existing
          </Button>
          <Button onClick={() => handleDuplicateChoice("replace")} color="warning" variant="contained">
            Replace with New Data
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmDialog.open} onClose={() => setDeleteConfirmDialog({ open: false, dataId: null })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this extracted data? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog({ open: false, dataId: null })}>Cancel</Button>
          <Button
            onClick={() => handleDeleteExtractedData(deleteConfirmDialog.dataId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}

function MoneyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  )
}
