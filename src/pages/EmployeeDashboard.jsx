"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  FormHelperText,
  AppBar,
  Toolbar,
  Divider,
  useMediaQuery,
  useTheme,
  Stack,
  Badge,
} from "@mui/material"
import {
  CalendarMonth,
  AccessTime,
  CheckCircle,
  Cancel,
  Delete,
  Add,
  FilterList,
  Refresh,
  DateRange,
  EventNote,
  SupervisorAccount,
  Person,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format, differenceInDays } from "date-fns"
import axios from "axios"

const EmployeeDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State for user role
  const [isTeamLead, setIsTeamLead] = useState(false)

  const [leaveHistory, setLeaveHistory] = useState([])
  const [leaveBalance, setLeaveBalance] = useState({
    casual: 0,
    sick: 0,
    medical: 0,
    Workfromhome: 0,
    total: 0,
  })

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("All")
  const [tabValue, setTabValue] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [leaveData, setLeaveData] = useState({
    type: "",
    startDate: null,
    endDate: null,
    reason: "",
  })
  const [formErrors, setFormErrors] = useState({
    type: false,
    startDate: false,
    endDate: false,
    reason: false,
  })
  const [teamMembers, setTeamMembers] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pendingLeaves = leaveHistory.filter((leave) => leave.status === "Pending").length
  const approvedLeaves = leaveHistory.filter((leave) => leave.status === "Approved").length
  const rejectedLeaves = leaveHistory.filter((leave) => leave.status === "Rejected").length
  const totalDaysTaken = leaveHistory
    .filter((leave) => leave.status === "Approved")
    .reduce((total, leave) => {
      return total + (differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1)
    }, 0)

  useEffect(() => {
    // Check user role and fetch appropriate data
    checkUserRole()
    fetchLeaveHistory()
    fetchLeaveBalance()
  }, [])

  // Function to check if the logged-in user is a team lead
  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/user-info", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Check if user is a team lead (assuming the API returns a role field)
      const userIsTeamLead = response.data.role === "TL" || response.data.isTeamLeader === true
      setIsTeamLead(userIsTeamLead)

      // If user is a team lead, fetch team data
      if (userIsTeamLead) {
        fetchTeamData()
      }
    } catch (error) {
      console.error("Error checking user role:", error)
      setSnackbar({
        open: true,
        message: "Failed to fetch user information",
        severity: "error",
      })
    }
  }

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const leaveResponse = await axios.get(
        "https://leave-management-backend-sa2e.onrender.com/api/dashboard/leave-history",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setLeaveHistory(leaveResponse.data)
    } catch (error) {
      console.error("Error fetching leave history:", error)
      setSnackbar({
        open: true,
        message: "Failed to fetch data",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaveBalance = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/user-info", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setLeaveBalance({
        total: response.data.totalLeaves,
        casual: response.data.casualleave,
        sick: response.data.sickleave,
        medical: response.data.medicalleave,
        Workfromhome: response.data.Workfromhome,
      })
    } catch (error) {
      console.error("Error fetching leave balance:", error)
      setSnackbar({
        open: true,
        message: "Failed to fetch leave balance",
        severity: "error",
      })
    }
  }

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const teamResponse = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/members", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const leaveResponse = await axios.get(
        "https://leave-management-backend-sa2e.onrender.com/api/dashboard/leave-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setTeamMembers(teamResponse.data)
      setLeaveRequests(leaveResponse.data)
    } catch (error) {
      console.error("Error fetching team data:", error)
      setSnackbar({
        open: true,
        message: "Failed to fetch team data",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLeave = async (leaveId) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.delete(`https://leave-management-backend-sa2e.onrender.com/api/dashboard/delete-leave/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSnackbar({
        open: true,
        message: "Leave request deleted successfully",
        severity: "success",
      })
      fetchLeaveHistory()
    } catch (error) {
      console.error("Error deleting leave:", error)
      setSnackbar({
        open: true,
        message: "Failed to delete leave request",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveAction = async (leaveId, action) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      await axios.put(
        `https://leave-management-backend-sa2e.onrender.com/api/dashboard/update-leave/${leaveId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setSnackbar({
        open: true,
        message: `Leave request ${action.toLowerCase()} successfully`,
        severity: "success",
      })
      fetchTeamData() // Refresh team data
    } catch (error) {
      console.error("Error updating leave:", error)
      setSnackbar({
        open: true,
        message: "Failed to update leave request",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {
      type: !leaveData.type,
      startDate: !leaveData.startDate,
      endDate: !leaveData.endDate,
      reason: !leaveData.reason || leaveData.reason.trim().length < 3,
    }

    setFormErrors(errors)
    return !Object.values(errors).some((error) => error)
  }

  const handleApplyLeave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const formattedData = {
        ...leaveData,
        startDate: format(leaveData.startDate, "yyyy-MM-dd"),
        endDate: format(leaveData.endDate, "yyyy-MM-dd"),
        type: leaveData.type,
      }

      // Check for overlapping leaves before proceeding
      const overlappingLeave = leaveHistory.find(
        (leave) =>
          leave.status === "Approved" &&
          ((new Date(formattedData.startDate) >= new Date(leave.startDate) &&
            new Date(formattedData.startDate) <= new Date(leave.endDate)) ||
            (new Date(formattedData.endDate) >= new Date(leave.startDate) &&
              new Date(formattedData.endDate) <= new Date(leave.endDate))),
      )

      if (overlappingLeave) {
        setSnackbar({
          open: true,
          message: "You already have approved leave during this period",
          severity: "error",
        })
        fetchLeaveHistory()
        setLoading(false)
        return
      }

      await axios.post("https://leave-management-backend-sa2e.onrender.com/api/dashboard/apply-leave", formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSnackbar({
        open: true,
        message: "Leave request submitted successfully",
        severity: "success",
      })

      const daysTaken = differenceInDays(leaveData.endDate, leaveData.startDate) + 1

      // Deduct the correct leave type from the state
      setLeaveBalance((prev) => ({
        ...prev,
        [leaveData.type.toLowerCase().replace(/\s+/g, "")]:
          prev[leaveData.type.toLowerCase().replace(/\s+/g, "")] - daysTaken,
        total: prev.total - daysTaken,
      }))

      fetchLeaveHistory()
      setOpen(false)
      resetLeaveForm()
    } catch (error) {
      console.error("Error applying for leave:", error)
      setSnackbar({
        open: true,
        message: "Failed to apply for leave",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetLeaveForm = () => {
    setLeaveData({
      type: "",
      startDate: null,
      endDate: null,
      reason: "",
    })
    setFormErrors({
      type: false,
      startDate: false,
      endDate: false,
      reason: false,
    })
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "Approved":
        return <Chip icon={<CheckCircle />} label="Approved" color="success" size="small" />
      case "Rejected":
        return <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />
      case "Pending":
        return <Chip icon={<AccessTime />} label="Pending" color="warning" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Responsive table for leave history
  const renderLeaveHistoryTable = () => {
    if (isMobile) {
      return (
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={40} />
            </Box>
          ) : leaveHistory.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No leave requests found
              </Typography>
            </Paper>
          ) : (
            leaveHistory
              .filter((leave) => filter === "All" || leave.status === filter)
              .map((leave, index) => (
                <Card key={leave._id || index} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {leave.type}
                    </Typography>
                    {getStatusChip(leave.status)}
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="body2">{format(new Date(leave.startDate), "MMM dd, yyyy")}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="body2">{format(new Date(leave.endDate), "MMM dd, yyyy")}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body2">
                        {differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Reason
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                        {leave.reason}
                      </Typography>
                    </Grid>
                  </Grid>
                  {leave.status === "Pending" && (
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        startIcon={<Delete />}
                        color="error"
                        size="small"
                        onClick={() => handleDeleteLeave(leave._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </Card>
              ))
          )}
        </Box>
      )
    }

    return (
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Duration (days)</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : leaveHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No leave requests found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              leaveHistory
                .filter((leave) => filter === "All" || leave.status === filter)
                .map((leave, index) => (
                  <TableRow key={leave._id || index} hover>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{format(new Date(leave.startDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(leave.endDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1}</TableCell>
                    <TableCell
                      sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      <Tooltip title={leave.reason}>
                        <span>{leave.reason}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{getStatusChip(leave.status)}</TableCell>
                    <TableCell>
                      {leave.status === "Pending" && (
                        <Tooltip title="Delete request">
                          <IconButton color="error" size="small" onClick={() => handleDeleteLeave(leave._id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  // Responsive table for team leave requests
  const renderTeamLeaveRequestsTable = () => {
    if (isMobile) {
      return (
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={40} />
            </Box>
          ) : leaveRequests.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No leave requests found
              </Typography>
            </Paper>
          ) : (
            leaveRequests.map((leave) => (
              <Card key={leave._id} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {leave.employeeName || "Employee"}
                  </Typography>
                  {getStatusChip(leave.status)}
                </Box>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Leave Type
                    </Typography>
                    <Typography variant="body2">{leave.type}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body2">
                      {differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      From
                    </Typography>
                    <Typography variant="body2">{leave.startDate}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      To
                    </Typography>
                    <Typography variant="body2">{leave.endDate}</Typography>
                  </Grid>
                </Grid>
                {leave.status === "Pending" && (
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      size="small"
                      onClick={() => handleLeaveAction(leave._id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      size="small"
                      onClick={() => handleLeaveAction(leave._id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </Card>
            ))
          )}
        </Box>
      )
    }

    return (
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>From</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>To</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No leave requests found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              leaveRequests.map((leave) => (
                <TableRow key={leave._id} hover>
                  <TableCell>{leave.employeeName || "Employee"}</TableCell>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{getStatusChip(leave.status)}</TableCell>
                  <TableCell>
                    {leave.status === "Pending" && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleLeaveAction(leave._id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleLeaveAction(leave._id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  // Responsive table for team members
  const renderTeamMembersTable = () => {
    if (isMobile) {
      return (
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={40} />
            </Box>
          ) : teamMembers.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No team members found
              </Typography>
            </Paper>
          ) : (
            teamMembers.map((member) => (
              <Card key={member._id} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.position || "Employee"}
                </Typography>
              </Card>
            ))
          )}
        </Box>
      )
    }

    return (
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "primary.contrastText" }}>Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : teamMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No team members found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              teamMembers.map((member) => (
                <TableRow key={member._id} hover>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.position || "Employee"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* App Bar */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}

          {isTeamLead ? (
            <SupervisorAccount sx={{ mr: 2, display: { xs: "none", sm: "block" } }} />
          ) : (
            <Person sx={{ mr: 2, display: { xs: "none", sm: "block" } }} />
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            {isTeamLead ? "Team Lead Dashboard" : "Employee Dashboard"}
          </Typography>

          <Badge badgeContent={pendingLeaves} color="error" sx={{ mr: 2 }}>
            <AccessTime color="inherit" />
          </Badge>

          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Apply for Leave
          </Button>

          <IconButton color="inherit" onClick={() => setOpen(true)} sx={{ display: { xs: "flex", sm: "none" } }}>
            <Add />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Team Lead Section - Only visible to team leads */}
        {isTeamLead && (
          <Box sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  Team Members
                </Typography>
                <Tooltip title="Refresh team data">
                  <IconButton onClick={fetchTeamData} color="primary">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              {renderTeamMembersTable()}
            </Paper>

            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                  Team Leave Requests
                </Typography>
                <Tooltip title="Refresh data">
                  <IconButton onClick={fetchTeamData} color="primary">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              {renderTeamLeaveRequestsTable()}
            </Paper>

            <Divider sx={{ my: 4 }} />
          </Box>
        )}

        {/* Personal Dashboard - Visible to all users */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            mb: 4,
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" } }}
          >
            My Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              Apply for Leave
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <Add />
            </Button>
            <Tooltip title="Refresh data">
              <IconButton onClick={fetchLeaveHistory} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={3}
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarMonth color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Leave Balance
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" fontWeight="medium">
                  {leaveBalance.total}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Casual: {leaveBalance.casual}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sick: {leaveBalance.sick}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Medical: {leaveBalance.medical}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    WFH: {leaveBalance.Workfromhome}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={3}
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTime color="warning" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Requests
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" fontWeight="medium">
                  {pendingLeaves}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Awaiting approval
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={3}
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Approved Leaves
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" fontWeight="medium">
                  {approvedLeaves}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Total days: {totalDaysTaken}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={3}
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Cancel color="error" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Rejected Requests
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" fontWeight="medium">
                  {rejectedLeaves}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Review and reapply
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              icon={isMobile ? null : <FilterList />}
              label={isMobile ? "REQUESTS" : "LEAVE REQUESTS"}
              iconPosition="start"
            />
            <Tab
              icon={isMobile ? null : <EventNote />}
              label={isMobile ? "CALENDAR" : "LEAVE CALENDAR"}
              iconPosition="start"
            />
          </Tabs>

          {/* Tab Content */}
          {tabValue === 0 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1,
                }}
              >
                <FormControl variant="outlined" size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                  <InputLabel id="filter-label">Filter by Status</InputLabel>
                  <Select
                    labelId="filter-label"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    label="Filter by Status"
                  >
                    <MenuItem value="All">All Requests</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {renderLeaveHistoryTable()}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Leave Calendar View
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This calendar view shows your approved and pending leave requests.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: 200, sm: 300 },
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <DateRange sx={{ fontSize: { xs: 60, sm: 100 }, color: "text.disabled", mb: 2 }} />
                <Typography variant="body2" align="center" color="text.secondary">
                  Calendar integration will display your leave schedule here
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Apply Leave Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
          <DialogTitle
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              py: 2,
            }}
          >
            Apply for Leave
          </DialogTitle>
          <DialogContent sx={{ pt: 3, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={formErrors.type}>
                  <InputLabel id="leave-type-label">Leave Type</InputLabel>
                  <Select
                    labelId="leave-type-label"
                    value={leaveData.type}
                    onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}
                    label="Leave Type"
                  >
                    <MenuItem value="casualleave">Casual Leave ({leaveBalance.casual} days available)</MenuItem>
                    <MenuItem value="sickleave">Sick Leave ({leaveBalance.sick} days available)</MenuItem>
                    <MenuItem value="medicalleave">Medical Leave ({leaveBalance.medical} days available)</MenuItem>
                    <MenuItem value="workfromhome">
                      Work From Home ({leaveBalance.Workfromhome} days available)
                    </MenuItem>
                  </Select>
                  {formErrors.type && <FormHelperText>Leave type is required</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={leaveData.startDate}
                  onChange={(date) => setLeaveData({ ...leaveData, startDate: date })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formErrors.startDate}
                      helperText={formErrors.startDate ? "Start date is required" : ""}
                    />
                  )}
                  disablePast
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={leaveData.endDate}
                  onChange={(date) => setLeaveData({ ...leaveData, endDate: date })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formErrors.endDate}
                      helperText={formErrors.endDate ? "End date is required" : ""}
                    />
                  )}
                  disablePast
                  minDate={leaveData.startDate || new Date()}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Reason for Leave"
                  multiline
                  rows={3}
                  fullWidth
                  value={leaveData.reason}
                  onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                  error={formErrors.reason}
                  helperText={formErrors.reason ? "Please provide a valid reason (min 3 characters)" : ""}
                />
              </Grid>

              {leaveData.startDate && leaveData.endDate && (
                <Grid item xs={12}>
                  <Box sx={{ bgcolor: "info.light", p: 2, borderRadius: 1 }}>
                    <Typography variant="body2">
                      Duration: <strong>{differenceInDays(leaveData.endDate, leaveData.startDate) + 1} days</strong>
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleApplyLeave}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  )
}

export default EmployeeDashboard

