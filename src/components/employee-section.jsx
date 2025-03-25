"use client"

import { useState, useEffect } from "react"
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
} from "@mui/material"
import { styled, alpha } from "@mui/material/styles"
import { DownloadIcon, DoorClosedIcon as CloseIcon } from "lucide-react"
import axios from "axios"
import { LeaveHistoryChart } from "./leave-history-chart"
import { LeaveTypeDistribution } from "./leave-type-distribution"

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

const StatusChip = styled(Box)(({ theme, status }) => {
  let color = theme.palette.info.main
  let bgColor = alpha(theme.palette.info.light, 0.2)

  if (status === "Approved") {
    color = theme.palette.success.main
    bgColor = alpha(theme.palette.success.light, 0.2)
  } else if (status === "Rejected") {
    color = theme.palette.error.main
    bgColor = alpha(theme.palette.error.light, 0.2)
  } else if (status === "Pending") {
    color = theme.palette.warning.main
    bgColor = alpha(theme.palette.warning.light, 0.2)
  }

  return {
    backgroundColor: bgColor,
    color: color,
    fontWeight: "medium",
    padding: "4px 12px",
    borderRadius: "16px",
    display: "inline-block",
    fontSize: "0.75rem",
    border: `1px solid ${alpha(color, 0.3)}`,
  }
})

const StyledTab = styled(Tab)(({ theme }) => ({
  borderRadius: "8px 8px 0 0",
  minHeight: "48px",
  fontWeight: "medium",
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
}))

export function EmployeeSection() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [leaveHistory, setLeaveHistory] = useState([])
  const [historyTab, setHistoryTab] = useState(0)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data.filter((user) => user.role === "employee"))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      setLoading(false)
    }
  }

  const handleEmployeeClick = async (employee) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `https://leave-management-backend-sa2e.onrender.com/api/dashboard/employee-leaves/${encodeURIComponent(employee.name)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setSelectedEmployee(employee)
      setLeaveHistory(response.data)
    } catch (error) {
      console.error("Error fetching leave history:", error)
      alert("Failed to fetch leave history.")
    }
  }

  const handleHistoryTabChange = (event, newValue) => {
    setHistoryTab(newValue)
  }

  const handleExportExcel = async () => {
    if (!selectedEmployee) return

    setExportLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `https://leave-management-backend-sa2e.onrender.com/api/dashboard/export-leave-data/${encodeURIComponent(selectedEmployee.name)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      )

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${selectedEmployee.name}_leave_history.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExportLoading(false)
    } catch (error) {
      console.error("Error exporting leave data:", error)
      alert("Failed to export leave data.")
      setExportLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const calculateLeaveStats = () => {
    if (!leaveHistory.length)
      return {
        sickLeave: [],
        casualLeave: [],
        medicalLeave: [],
        workFromHome: [],
      }

    // Group leaves by month and type
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const leavesByMonth = {}

    months.forEach((month) => {
      leavesByMonth[month] = {
        sick: 0,
        casual: 0,
        medical: 0,
        wfh: 0,
      }
    })

    leaveHistory.forEach((leave) => {
      const date = new Date(leave.startDate)
      const month = months[date.getMonth()]

      if (leave.status === "Approved") {
        if (leave.reason.toLowerCase().includes("sick")) {
          leavesByMonth[month].sick += leave.daysTaken || 1
        } else if (leave.reason.toLowerCase().includes("personal") || leave.reason.toLowerCase().includes("casual")) {
          leavesByMonth[month].casual += leave.daysTaken || 1
        } else if (leave.reason.toLowerCase().includes("medical")) {
          leavesByMonth[month].medical += leave.daysTaken || 1
        } else if (
          leave.reason.toLowerCase().includes("work from home") ||
          leave.reason.toLowerCase().includes("wfh")
        ) {
          leavesByMonth[month].wfh += leave.daysTaken || 1
        }
      }
    })

    // Convert to format needed by chart
    const sickLeave = months.map((month) => ({ month, count: leavesByMonth[month].sick }))
    const casualLeave = months.map((month) => ({ month, count: leavesByMonth[month].casual }))
    const medicalLeave = months.map((month) => ({ month, count: leavesByMonth[month].medical }))
    const workFromHome = months.map((month) => ({ month, count: leavesByMonth[month].wfh }))

    return { sickLeave, casualLeave, medicalLeave, workFromHome }
  }

  const leaveStats = calculateLeaveStats()

  const calculateLeaveTypeDistribution = () => {
    if (!leaveHistory.length) return []

    const approved = leaveHistory.filter((leave) => leave.status === "Approved")

    const sickCount = approved
      .filter((leave) => leave.reason.toLowerCase().includes("sick"))
      .reduce((sum, leave) => sum + (leave.daysTaken || 1), 0)

    const casualCount = approved
      .filter(
        (leave) => leave.reason.toLowerCase().includes("personal") || leave.reason.toLowerCase().includes("casual"),
      )
      .reduce((sum, leave) => sum + (leave.daysTaken || 1), 0)

    const medicalCount = approved
      .filter((leave) => leave.reason.toLowerCase().includes("medical"))
      .reduce((sum, leave) => sum + (leave.daysTaken || 1), 0)

    const wfhCount = approved
      .filter(
        (leave) => leave.reason.toLowerCase().includes("work from home") || leave.reason.toLowerCase().includes("wfh"),
      )
      .reduce((sum, leave) => sum + (leave.daysTaken || 1), 0)

    return [
      { name: "Sick Leave", value: sickCount },
      { name: "Casual Leave", value: casualCount },
      { name: "Medical Leave", value: medicalCount },
      { name: "Work From Home", value: wfhCount },
    ]
  }

  const leaveTypeData = calculateLeaveTypeDistribution()

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Employees
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage employee information and leave history
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Total Leaves</StyledTableCell>
                <StyledTableCell>Sick Leave</StyledTableCell>
                <StyledTableCell>Casual Leave</StyledTableCell>
                <StyledTableCell>Medical Leave</StyledTableCell>
                <StyledTableCell>Work From Home</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading employees...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <StyledTableRow key={user._id} onClick={() => handleEmployeeClick(user)}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                          {getInitials(user.name)}
                        </Avatar>
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.totalLeaves || 12}</TableCell>
                    <TableCell>{user.sickleave || 0}</TableCell>
                    <TableCell>{user.casualleave || 0}</TableCell>
                    <TableCell>{user.medicalleave || 0}</TableCell>
                    <TableCell>{user.Workfromhome || 0}</TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Employee Leave History Dialog */}
      <Dialog open={Boolean(selectedEmployee)} onClose={() => setSelectedEmployee(null)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {selectedEmployee?.name}'s Leave History
          </Typography>
          <IconButton onClick={() => setSelectedEmployee(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {leaveHistory.length > 0 ? (
            <>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs value={historyTab} onChange={handleHistoryTabChange} aria-label="history tabs">
                  <StyledTab label="Leave History" />
                  <StyledTab label="Monthly Distribution" />
                  <StyledTab label="Leave Type Distribution" />
                </Tabs>
              </Box>

              {historyTab === 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Start Date</StyledTableCell>
                        <StyledTableCell>End Date</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Days Taken</StyledTableCell>
                        <StyledTableCell>Reason</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveHistory.map((leave, index) => (
                        <StyledTableRow key={index}>
                          <TableCell>{leave.startDate}</TableCell>
                          <TableCell>{leave.endDate}</TableCell>
                          <TableCell>
                            <StatusChip status={leave.status}>{leave.status}</StatusChip>
                          </TableCell>
                          <TableCell>{leave.daysTaken || 1}</TableCell>
                          <TableCell>{leave.reason}</TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {historyTab === 1 && (
                <Box sx={{ height: 400 }}>
                  <LeaveHistoryChart data={leaveStats} />
                </Box>
              )}

              {historyTab === 2 && (
                <Box sx={{ height: 400 }}>
                  <LeaveTypeDistribution data={{ leavesByType: leaveTypeData }} />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No leave history found.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleExportExcel}
            color="primary"
            variant="outlined"
            disabled={!leaveHistory.length || exportLoading}
            startIcon={exportLoading ? <CircularProgress size={16} /> : <DownloadIcon />}
            sx={{
              borderRadius: 8,
              mr: 1,
            }}
          >
            Export to Excel
          </Button>
          <Button
            onClick={() => setSelectedEmployee(null)}
            color="primary"
            variant="contained"
            sx={{
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

