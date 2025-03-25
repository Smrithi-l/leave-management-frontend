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
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  InputAdornment,
  Badge,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material"
import { styled, alpha } from "@mui/material/styles"
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  ExitToApp as ExitToAppIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  FilterList as FilterListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  History as HistoryIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material"
import axios from "axios"

import { LeaveHistoryChart } from "../components/leave-history-chart"
import { EmployeeLeaveDistribution } from "../components/employee-leave-distribution"
import { LeaveTypeDistribution } from "../components/leave-type-distribution"
import { MonthlyLeaveReport } from "../components/monthly-leave-report"
import { EmployeeLeaveComparison } from "../components/employee-leave-comparsion"
import { EmployeeSection } from "../components/employee-section"
import GenerateSalary from "../components/generate-salary"

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

const StatusChip = styled(Chip)(({ theme, status }) => {
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
    "& .MuiChip-label": {
      padding: "0 12px",
    },
    border: `1px solid ${alpha(color, 0.3)}`,
  }
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

const CalendarDay = styled(Box)(({ theme, isWeekend, isToday, hasLeave }) => ({
  width: "100%",
  aspectRatio: "1",
  border: "1px solid",
  borderColor: isToday ? theme.palette.primary.main : alpha(theme.palette.divider, 0.8),
  borderRadius: "4px",
  padding: "4px",
  backgroundColor: isWeekend ? alpha(theme.palette.action.hover, 0.5) : "white",
  position: "relative",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
  ...(isToday && {
    boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
  }),
  ...(hasLeave && {
    "&::after": {
      content: '""',
      position: "absolute",
      top: "0",
      right: "0",
      width: "0",
      height: "0",
      borderStyle: "solid",
      borderWidth: "0 12px 12px 0",
      borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
    },
  }),
}))

const LeaveIndicator = styled(Box)(({ theme, status }) => {
  let bgColor = theme.palette.primary.main

  if (status === "Approved") {
    bgColor = theme.palette.success.main
  } else if (status === "Rejected") {
    bgColor = theme.palette.error.main
  } else if (status === "Pending") {
    bgColor = theme.palette.warning.main
  }

  return {
    height: "18px",
    borderRadius: "4px",
    fontSize: "10px",
    padding: "2px 4px",
    marginBottom: "2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    backgroundColor: alpha(bgColor, 0.2),
    color: bgColor,
    display: "flex",
    alignItems: "center",
  }
})

const drawerWidth = 240

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  borderRadius: "8px 8px 0 0",
  minHeight: "48px",
  fontWeight: "medium",
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
}))

const AdminDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [dayLeaves, setDayLeaves] = useState([])
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    isTeamLeader: false, // New State
    teamLeaderId: "",
    teamMembers: [], // New State
    totalLeaves: 12,
    sickleave: 0,
    casualleave: 0,
    medicalleave: 0,
    Workfromhome: 0,
    salary:0,
  })

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [leaveHistory, setLeaveHistory] = useState([])
  const [historyTab, setHistoryTab] = useState(0)
  const [leaveStats, setLeaveStats] = useState({
    sickLeave: [],
    casualLeave: [],
    medicalLeave: [],
    workFromHome: [],
    totalLeaves: [],
  })
  const [overallStats, setOverallStats] = useState({
    leavesByType: [],
    leavesByMonth: [],
    leavesByEmployee: [],
  })
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/auth/employees", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setEmployees(response.data)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    fetchEmployees()
  }, [])
  useEffect(() => {
    fetchLeaveRequests()
    fetchUsers()
    fetchLeaveStats()
    fetchOverallStats()
  }, [])

  useEffect(() => {
    handleFilter()
    if (leaveRequests.length > 0) {
      generateCalendarData()
    }
  }, [leaveRequests, searchQuery, filterStatus, currentMonth])

  const fetchLeaveStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/leave-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLeaveStats(response.data)
    } catch (error) {
      console.error("Error fetching leave stats:", error)
    }
  }

  const fetchOverallStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/overall-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOverallStats(response.data)
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching overall stats:", error)
    }
  }

  const handleEmployeeClick = async (name) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `https://leave-management-backend-sa2e.onrender.com/api/dashboard/employee-leaves/${encodeURIComponent(name)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setSelectedEmployee(name)
      setLeaveHistory(response.data)
    } catch (error) {
      console.error("Error fetching leave history:", error)
      alert("Failed to fetch leave history.")
    }
  }

  const fetchLeaveRequests = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/all-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLeaveRequests(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching leave requests:", error)
      setLoading(false)
    }
  }

  const updateLeaveStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `https://leave-management-backend-sa2e.onrender.com/api/dashboard/update-leave/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      fetchLeaveRequests()
      alert(`Leave request ${status.toLowerCase()} successfully!`)
    } catch (error) {
      console.error("Error updating leave request:", error)
      alert("Failed to update leave request.")
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleFilter = () => {
    let filtered = leaveRequests
    if (searchQuery) {
      filtered = filtered.filter((leave) => leave.userId.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (filterStatus !== "All") {
      filtered = filtered.filter((leave) => leave.status === filterStatus)
    }
    setFilteredRequests(filtered)
  }

  const calculateLeaveSummary = () => {
    const total = leaveRequests.length
    const pending = leaveRequests.filter((req) => req.status === "Pending").length
    const approved = leaveRequests.filter((req) => req.status === "Approved").length
    const rejected = leaveRequests.filter((req) => req.status === "Rejected").length

    return { total, pending, approved, rejected }
  }

  const { total, pending, approved, rejected } = calculateLeaveSummary()

  const handleAddEmployee = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.post("https://leave-management-backend-sa2e.onrender.com/api/auth/add-employee", newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchUsers()
      setOpen(false)
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        role: "employee",
        isTeamLeader: false, // Reset State
        teamMembers: [],
        totalLeaves: 12,
        sickleave: 0,
        casualleave: 0,
        medicalleave: 0,
        Workfromhome: 0,
        salary:0,
      })
      alert("Employee added successfully!")
    } catch (error) {
      console.error("Error adding employee:", error)
      alert(error.response?.data?.message || "Failed to add employee.")
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

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarData = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const calendarDays = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ day: null, date: null })
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayLeaves = getLeavesByDate(date)

      calendarDays.push({
        day,
        date,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isToday: isToday(date),
        leaves: dayLeaves,
      })
    }

    setCalendarData(calendarDays)
  }

  const getLeavesByDate = (date) => {
    return leaveRequests.filter((leave) => {
      const startDate = new Date(leave.startDate)
      const endDate = new Date(leave.endDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
      date.setHours(0, 0, 0, 0)

      return date >= startDate && date <= endDate && leave.status !== "Rejected"
    })
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (date, leaves) => {
    setSelectedDate(date)
    setDayLeaves(leaves)
  }

  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleTabChange = (newValue) => {
    setActiveTab(newValue)
  }

  const handleHistoryTabChange = (event, newValue) => {
    setHistoryTab(newValue)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          bgcolor: "white",
          color: "text.primary",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0, fontWeight: "bold", color: "primary.main", display: "flex", alignItems: "center" }}
          >
            <DashboardIcon sx={{ mr: 1 }} />
            LeaveManagement
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <TextField
              placeholder="Search employees..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "40%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  bgcolor: alpha("#f5f5f5", 0.8),
                  "&:hover": {
                    bgcolor: alpha("#f5f5f5", 1),
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="large" color="primary">
              <Badge badgeContent={pending} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>A</Avatar>
              <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: "medium" }}>
                Admin
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "white",
            borderRight: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "2px 0 10px rgba(0,0,0,0.03)",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <List>
            <ListItem
              button
              selected={activeTab === 0}
              onClick={() => handleTabChange(0)}
              sx={{
                borderRadius: "0 20px 20px 0",
                mr: 2,
                bgcolor: activeTab === 0 ? alpha("#3f51b5", 0.08) : "transparent",
                "&.Mui-selected": {
                  bgcolor: alpha("#3f51b5", 0.12),
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon color={activeTab === 0 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  fontWeight: activeTab === 0 ? "medium" : "normal",
                  color: activeTab === 0 ? "primary.main" : "inherit",
                }}
              />
            </ListItem>
            <ListItem
              button
              selected={activeTab === 1}
              onClick={() => handleTabChange(1)}
              sx={{
                borderRadius: "0 20px 20px 0",
                mr: 2,
                bgcolor: activeTab === 1 ? alpha("#3f51b5", 0.08) : "transparent",
                "&.Mui-selected": {
                  bgcolor: alpha("#3f51b5", 0.12),
                },
              }}
            >
              <ListItemIcon>
                <EventIcon color={activeTab === 1 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary="Leave Calendar"
                primaryTypographyProps={{
                  fontWeight: activeTab === 1 ? "medium" : "normal",
                  color: activeTab === 1 ? "primary.main" : "inherit",
                }}
              />
            </ListItem>
            <ListItem
              button
              selected={activeTab === 2}
              onClick={() => handleTabChange(2)}
              sx={{
                borderRadius: "0 20px 20px 0",
                mr: 2,
                bgcolor: activeTab === 2 ? alpha("#3f51b5", 0.08) : "transparent",
                "&.Mui-selected": {
                  bgcolor: alpha("#3f51b5", 0.12),
                },
              }}
            >
              <ListItemIcon>
                <PersonIcon color={activeTab === 2 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary="Employees"
                primaryTypographyProps={{
                  fontWeight: activeTab === 2 ? "medium" : "normal",
                  color: activeTab === 2 ? "primary.main" : "inherit",
                }}
              />
            </ListItem>
            <ListItem
              button
              selected={activeTab === 3}
              onClick={() => handleTabChange(3)}
              sx={{
                borderRadius: "0 20px 20px 0",
                mr: 2,
                bgcolor: activeTab === 3 ? alpha("#3f51b5", 0.08) : "transparent",
                "&.Mui-selected": {
                  bgcolor: alpha("#3f51b5", 0.12),
                },
              }}
            >
              <ListItemIcon>
                <HistoryIcon color={activeTab === 3 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary="View History"
                primaryTypographyProps={{
                  fontWeight: activeTab === 3 ? "medium" : "normal",
                  color: activeTab === 3 ? "primary.main" : "inherit",
                }}
              />
            </ListItem>
            <ListItem
              button
              selected={activeTab === 4}
              onClick={() => handleTabChange(4)}
              sx={{
                borderRadius: "0 20px 20px 0",
                mr: 2,
                bgcolor: activeTab === 4 ? alpha("#3f51b5", 0.08) : "transparent",
                "&.Mui-selected": {
                  bgcolor: alpha("#3f51b5", 0.12),
                },
              }}
            >
              <ListItemIcon>
                <AssessmentIcon color={activeTab === 4 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary="Reports"
                primaryTypographyProps={{
                  fontWeight: activeTab === 4 ? "medium" : "normal",
                  color: activeTab === 4 ? "primary.main" : "inherit",
                }}
              />
            </ListItem>
            {/* New Generate Salary Option */}
            <ListItem
              button
              selected={activeTab === 5}
              onClick={() => handleTabChange(5)}
              sx={{
                borderRadius: "0 20px 20px 0",
                mr: 2,
                bgcolor: activeTab === 5 ? alpha("#3f51b5", 0.08) : "transparent",
                "&.Mui-selected": {
                  bgcolor: alpha("#3f51b5", 0.12),
                },
              }}
            >
              <ListItemIcon>
                <AttachMoneyIcon color={activeTab === 5 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary="Generate Salary"
                primaryTypographyProps={{
                  fontWeight: activeTab === 5 ? "medium" : "normal",
                  color: activeTab === 5 ? "primary.main" : "inherit",
                }}
              />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem button sx={{ borderRadius: "0 20px 20px 0", mr: 2, color: "error.main" }}>
              <ListItemIcon>
                <ExitToAppIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ color: "error.main" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Main open={drawerOpen}>
        <Toolbar />

        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage employee leave requests and accounts
              </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard cardcolor="#3f51b5">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Leaves
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                          {total}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#3f51b5", 0.1), color: "primary.main" }}>
                        <AssessmentIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard cardcolor="#ff9800">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Pending
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                          {pending}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#ff9800", 0.1), color: "#ff9800" }}>
                        <EventIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard cardcolor="#4caf50">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Approved
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                          {approved}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#4caf50", 0.1), color: "#4caf50" }}>
                        <CheckIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SummaryCard cardcolor="#f44336">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Rejected
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                          {rejected}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha("#f44336", 0.1), color: "#f44336" }}>
                        <CloseIcon />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>
            </Grid>

            {/* Pending Leave Requests */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Pending Leave Requests
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="filter-status-label">Filter Status</InputLabel>
                  <Select
                    labelId="filter-status-label"
                    value={filterStatus}
                    label="Filter Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Employee</StyledTableCell>
                        <StyledTableCell>Start Date</StyledTableCell>
                        <StyledTableCell>End Date</StyledTableCell>
                        <StyledTableCell>Reason</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <CircularProgress size={30} />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Loading leave requests...
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : leaveRequests.filter((req) => req.status === "Pending").length > 0 ? (
                        leaveRequests
                          .filter((req) => req.status === "Pending")
                          .map((leave) => (
                            <StyledTableRow key={leave._id}>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                                    {getInitials(leave.userId)}
                                  </Avatar>
                                  {leave.userId}
                                </Box>
                              </TableCell>
                              <TableCell>{leave.startDate}</TableCell>
                              <TableCell>{leave.endDate}</TableCell>
                              <TableCell>{leave.reason}</TableCell>
                              <TableCell>
                                <StatusChip label={leave.status} status={leave.status} size="small" />
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  startIcon={<CheckIcon />}
                                  onClick={() => updateLeaveStatus(leave._id, "Approved")}
                                  sx={{ mr: 1, borderRadius: 8 }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<CloseIcon />}
                                  onClick={() => updateLeaveStatus(leave._id, "Rejected")}
                                  sx={{ borderRadius: 8 }}
                                >
                                  Reject
                                </Button>
                              </TableCell>
                            </StyledTableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              No pending leave requests found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            {/* Employee Management */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Employee Management
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: 8,
                  px: 3,
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                  },
                }}
              >
                Add Employee
              </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Role</StyledTableCell>
                      <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={30} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Loading employees...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <StyledTableRow key={user._id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 1,
                                  bgcolor: user.role === "admin" ? "secondary.main" : "primary.main",
                                }}
                              >
                                {getInitials(user.name)}
                              </Avatar>
                              {user.name}
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <StatusChip
                              label={user.role.toUpperCase() + user.role.slice(1)}
                              status={user.role === "admin" ? "Admin" : "Employee"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() => handleEmployeeClick(user.name)}
                              sx={{ borderRadius: 8 }}
                            >
                              View History
                            </Button>
                          </TableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Leave Calendar
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View all employee leaves in calendar format
              </Typography>
            </Box>

            {/* Calendar Header */}
            <Paper
              elevation={0}
              sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", mb: 3 }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <Button startIcon={<ChevronLeftIcon />} onClick={handlePrevMonth} sx={{ borderRadius: 8 }}>
                  Previous
                </Button>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </Typography>
                <Button endIcon={<ChevronRightIcon />} onClick={handleNextMonth} sx={{ borderRadius: 8 }}>
                  Next
                </Button>
              </Box>

              {/* Calendar Grid */}
              <Box sx={{ p: 2 }}>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <Grid item xs={12 / 7} key={index}>
                      <Box
                        sx={{
                          textAlign: "center",
                          fontWeight: "medium",
                          color: index === 0 || index === 6 ? "error.main" : "inherit",
                        }}
                      >
                        {day}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={1}>
                  {calendarData.map((day, index) => (
                    <Grid item xs={12 / 7} key={index}>
                      {day.day && (
                        <CalendarDay
                          isWeekend={day.isWeekend}
                          isToday={day.isToday}
                          hasLeave={day.leaves.length > 0}
                          onClick={() => handleDateClick(day.date, day.leaves)}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: day.isToday ? "bold" : "normal" }}>
                              {day.day}
                            </Typography>
                            {day.leaves.length > 0 && (
                              <Chip
                                label={day.leaves.length}
                                size="small"
                                sx={{
                                  height: "18px",
                                  fontSize: "10px",
                                  bgcolor: "primary.main",
                                  color: "white",
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{ overflow: "hidden", maxHeight: "54px" }}>
                            {day.leaves.slice(0, 3).map((leave, i) => (
                              <LeaveIndicator key={i} status={leave.status}>
                                <Typography variant="caption" sx={{ fontSize: "10px", fontWeight: "medium" }}>
                                  {leave.userId}
                                </Typography>
                              </LeaveIndicator>
                            ))}
                            {day.leaves.length > 3 && (
                              <Typography variant="caption" sx={{ fontSize: "10px", color: "text.secondary" }}>
                                +{day.leaves.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </CalendarDay>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>

            {/* Selected Day Details */}
            {selectedDate && (
              <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "medium", display: "flex", alignItems: "center" }}>
                    <TodayIcon sx={{ mr: 1 }} />
                    {formatDate(selectedDate)}
                  </Typography>
                  <IconButton size="small" onClick={() => setSelectedDate(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Employee</StyledTableCell>
                        <StyledTableCell>Start Date</StyledTableCell>
                        <StyledTableCell>End Date</StyledTableCell>
                        <StyledTableCell>Reason</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dayLeaves.length > 0 ? (
                        dayLeaves.map((leave, index) => (
                          <StyledTableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                                  {getInitials(leave.userId)}
                                </Avatar>
                                {leave.userId}
                              </Box>
                            </TableCell>
                            <TableCell>{leave.startDate}</TableCell>
                            <TableCell>{leave.endDate}</TableCell>
                            <TableCell>{leave.reason}</TableCell>
                            <TableCell>
                              <StatusChip label={leave.status} status={leave.status} size="small" />
                            </TableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              No leaves found for this date
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </>
        )}

        {/* View History Section */}
        {activeTab === 3 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Leave History
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View detailed leave history and analytics for employees
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", mb: 4 }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={historyTab} onChange={handleHistoryTabChange} aria-label="history tabs">
                  <StyledTab label="Leave Distribution" />
                  <StyledTab label="Monthly Trends" />
                </Tabs>
              </Box>

              {historyTab === 0 && (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                        Leave Distribution by Type
                      </Typography>
                      <Box sx={{ height: 300 }}>
                        <LeaveTypeDistribution data={leaveStats} />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                        Employee Leave Distribution
                      </Typography>
                      <Box sx={{ height: 400 }}>
                        <EmployeeLeaveDistribution data={overallStats.leavesByEmployee} />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {historyTab === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                    Monthly Leave Trends
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <LeaveHistoryChart data={leaveStats} />
                  </Box>
                </Box>
              )}
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Employee Leave History
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Employee</StyledTableCell>
                      <StyledTableCell>Total Leaves</StyledTableCell>
                      <StyledTableCell>Sick Leave</StyledTableCell>
                      <StyledTableCell>Casual Leave</StyledTableCell>
                      <StyledTableCell>Medical Leave</StyledTableCell>
                      <StyledTableCell>Work From Home</StyledTableCell>
                      <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={30} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Loading employee data...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users
                        .filter((user) => user.role === "employee")
                        .map((user) => (
                          <StyledTableRow key={user._id}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
                                  {getInitials(user.name)}
                                </Avatar>
                                {user.name}
                              </Box>
                            </TableCell>
                            <TableCell>{user.totalLeaves || 12}</TableCell>
                            <TableCell>{user.sickleave || 0}</TableCell>
                            <TableCell>{user.casualleave || 0}</TableCell>
                            <TableCell>{user.medicalleave || 0}</TableCell>
                            <TableCell>{user.Workfromhome || 0}</TableCell>
                            <TableCell align="right">
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleEmployeeClick(user.name)}
                                sx={{ borderRadius: 8 }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </StyledTableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}

        {/* Show Employee Section when activeTab is 2 */}
        {activeTab === 2 && <EmployeeSection />}

        {/* Reports Section */}
        {activeTab === 4 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Leave Reports
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive reports and analytics on employee leaves
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.08)",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                    Leave Distribution by Type
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <LeaveTypeDistribution data={leaveStats} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.08)",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                    Monthly Leave Trends
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <MonthlyLeaveReport data={overallStats.leavesByMonth} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", p: 3 }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                    Employee Leave Comparison
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <EmployeeLeaveComparison data={overallStats.leavesByEmployee} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* Generate Salary Section */}
        {activeTab === 5 && <GenerateSalary />}

        {/* Add Employee Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Add New Employee
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  margin="dense"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  margin="dense"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="dense"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Total Leaves"
                  type="number"
                  margin="dense"
                  value={newEmployee.totalLeaves}
                  onChange={(e) => setNewEmployee({ ...newEmployee, totalLeaves: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sick Leave"
                  type="number"
                  margin="dense"
                  value={newEmployee.sickleave}
                  onChange={(e) => setNewEmployee({ ...newEmployee, sickleave: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  type="number"
                  margin="dense"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Casual Leave"
                  type="number"
                  margin="dense"
                  value={newEmployee.casualleave}
                  onChange={(e) => setNewEmployee({ ...newEmployee, casualleave: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medical Leave"
                  type="number"
                  margin="dense"
                  value={newEmployee.medicalleave}
                  onChange={(e) => setNewEmployee({ ...newEmployee, medicalleave: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Work From Home"
                  type="number"
                  margin="dense"
                  value={newEmployee.Workfromhome}
                  onChange={(e) => setNewEmployee({ ...newEmployee, Workfromhome: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newEmployee.role}
                    label="Role"
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newEmployee.isTeamLeader}
                          onChange={(e) => setNewEmployee({ ...newEmployee, isTeamLeader: e.target.checked })}
                        />
                      }
                      label="Is Team Leader?"
                    />
                  </Grid>

                  {newEmployee.isTeamLeader && (
                    <Grid item xl={12}>
                      <FormControl fullWidth margin="dense">
                        <InputLabel>Select Team Members</InputLabel>
                        <Select
                          multiple
                          value={newEmployee.teamMembers}
                          onChange={(e) => setNewEmployee({ ...newEmployee, teamMembers: e.target.value })}
                          renderValue={(selected) => selected.join(", ")}
                        >
                          {employees.map((employee) => (
                            <MenuItem key={employee._id} value={employee._id}>
                              {employee.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpen(false)} color="inherit" variant="outlined" sx={{ borderRadius: 8 }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEmployee}
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                },
              }}
            >
              Add Employee
            </Button>
          </DialogActions>
        </Dialog>

        {/* Employee Leave History Dialog */}
        <Dialog open={Boolean(selectedEmployee)} onClose={() => setSelectedEmployee(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {selectedEmployee}'s Leave History
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {leaveHistory.length > 0 ? (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
                    Leave Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <LeaveHistoryChart
                      data={{
                        sickLeave: leaveHistory
                          .filter((l) => l.reason.toLowerCase().includes("sick"))
                          .map((_, i) => ({ month: `Month ${i + 1}`, count: 1 })),
                        casualLeave: leaveHistory
                          .filter((l) => l.reason.toLowerCase().includes("personal"))
                          .map((_, i) => ({ month: `Month ${i + 1}`, count: 1 })),
                        medicalLeave: leaveHistory
                          .filter((l) => l.reason.toLowerCase().includes("medical"))
                          .map((_, i) => ({ month: `Month ${i + 1}`, count: 1 })),
                        workFromHome: leaveHistory
                          .filter((l) => l.reason.toLowerCase().includes("work from home"))
                          .map((_, i) => ({ month: `Month ${i + 1}`, count: 1 })),
                      }}
                    />
                  </Box>
                </Box>
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
                            <StatusChip label={leave.status} status={leave.status} size="small" />
                          </TableCell>
                          <TableCell>{leave.daysTaken}</TableCell>
                          <TableCell>{leave.reason}</TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
      </Main>
    </Box>
  )
}

export default AdminDashboard

