"use client"

import { useState, useEffect, useCallback } from "react"
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
  useMediaQuery,
  useTheme,
  Menu,
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
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
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
  [theme.breakpoints.down("sm")]: {
    padding: "8px 6px",
    fontSize: "0.75rem",
  },
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
      [theme.breakpoints.down("sm")]: {
        padding: "0 4px",
        fontSize: "0.625rem",
      },
    },
    border: `1px solid ${alpha(color, 0.3)}`,
    [theme.breakpoints.down("sm")]: {
      height: "24px",
    },
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
  [theme.breakpoints.down("sm")]: {
    padding: "2px",
  },
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
    [theme.breakpoints.down("sm")]: {
      height: "14px",
      fontSize: "8px",
      padding: "1px 2px",
    },
  }
})

const drawerWidth = 240

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile" })(
  ({ theme, open, isMobile }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open &&
      !isMobile && {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
      }),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }),
)

const StyledTab = styled(Tab)(({ theme }) => ({
  borderRadius: "8px 8px 0 0",
  minHeight: "48px",
  fontWeight: "medium",
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
  [theme.breakpoints.down("sm")]: {
    minHeight: "40px",
    fontSize: "0.75rem",
    padding: "6px 8px",
  },
}))

const ResponsiveTableContainer = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    overflowX: "auto",
  },
}))

const AdminDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const [leaveRequests, setLeaveRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [open, setOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [dayLeaves, setDayLeaves] = useState([])
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null)
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null)
  const [selectedActionUser, setSelectedActionUser] = useState(null)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [leaveComment, setLeaveComment] = useState("")
  const [leaveToUpdate, setLeaveToUpdate] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    isTeamLeader: false,
    teamLeaderId: "",
    teamMembers: [],
    totalLeaves: 12,
    sickleave: 0,
    casualleave: 0,
    medicalleave: 0,
    Workfromhome: 0,
    salary: 0,
  })
  const [employeeToEdit, setEmployeeToEdit] = useState(null)

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

  // Effect to handle drawer state based on screen size
  useEffect(() => {
    setDrawerOpen(!isMobile)
  }, [isMobile])

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
      const response = await axios.get(
        "https://leave-management-backend-sa2e.onrender.com/api/dashboard/overall-stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setOverallStats(response.data)
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

  const updateLeaveStatus = async (id, status, comment = "") => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `https://leave-management-backend-sa2e.onrender.com/api/dashboard/update-leave/${id}`,
        { status, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      fetchLeaveRequests()
      alert(`Leave request ${status.toLowerCase()} successfully!`)
      setLeaveComment("")
    } catch (error) {
      console.error("Error updating leave request:", error)
      alert("Failed to update leave request.")
    }
  }

  const handleLeaveAction = (leave, status) => {
    if (status === "Approved") {
      setLeaveToUpdate({ id: leave._id, status })
      setCommentDialogOpen(true)
    } else {
      updateLeaveStatus(leave._id, status)
    }
  }

  const handleCommentSubmit = () => {
    if (leaveToUpdate) {
      updateLeaveStatus(leaveToUpdate.id, leaveToUpdate.status, leaveComment)
      setCommentDialogOpen(false)
      setLeaveToUpdate(null)
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

  const handleFilter = useCallback(() => {
    let filtered = leaveRequests
    if (searchQuery) {
      filtered = filtered.filter((leave) => leave.userId.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (filterStatus !== "All") {
      filtered = filtered.filter((leave) => leave.status === filterStatus)
    }
    setFilteredRequests(filtered)
  }, [leaveRequests, searchQuery, filterStatus])

  const calculateLeaveSummary = useCallback(() => {
    const total = leaveRequests.length
    const pending = leaveRequests.filter((req) => req.status === "Pending").length
    const approved = leaveRequests.filter((req) => req.status === "Approved").length
    const rejected = leaveRequests.filter((req) => req.status === "Rejected").length

    return { total, pending, approved, rejected }
  }, [leaveRequests])

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
        isTeamLeader: false,
        teamMembers: [],
        totalLeaves: 12,
        sickleave: 0,
        casualleave: 0,
        medicalleave: 0,
        Workfromhome: 0,
        salary: 0,
      })
      alert("Employee added successfully!")
    } catch (error) {
      console.error("Error adding employee:", error)
      alert(error.response?.data?.message || "Failed to add employee.")
    }
  }

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      isTeamLeader: employee.isTeamLeader || false,
      teamMembers: employee.teamMembers || [],
      totalLeaves: employee.totalLeaves || 12,
      sickleave: employee.sickleave || 0,
      casualleave: employee.casualleave || 0,
      medicalleave: employee.medicalleave || 0,
      Workfromhome: employee.Workfromhome || 0,
      salary: employee.salary || 0,
    })
    setEditDialogOpen(true)
  }

  const handleUpdateEmployee = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:5000/api/dashboard/update-employee/${employeeToEdit._id}`,
        employeeToEdit,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchUsers()
      setEditDialogOpen(false)
      setEmployeeToEdit(null)
      alert("Employee updated successfully!")
    } catch (error) {
      console.error("Error updating employee:", error)
      alert(error.response?.data?.message || "Failed to update employee.")
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

  const generateCalendarData = useCallback(() => {
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
  }, [currentMonth, leaveRequests])

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
      weekday: isSmall ? "short" : "long",
      year: "numeric",
      month: isSmall ? "short" : "long",
      day: "numeric",
    })
  }

  const handleTabChange = (newValue) => {
    setActiveTab(newValue)
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  const handleHistoryTabChange = (event, newValue) => {
    setHistoryTab(newValue)
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null)
  }

  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchorEl(event.currentTarget)
    setSelectedActionUser(user)
  }

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null)
    setSelectedActionUser(null)
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
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
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              fontWeight: "bold",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              fontSize: isSmall ? "1rem" : "1.25rem",
            }}
          >
            <DashboardIcon sx={{ mr: 1, fontSize: isSmall ? "1.25rem" : "1.5rem" }} />
            {!isSmall && "LeaveManagement"}
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            {!isSmall && (
              <TextField
                placeholder="Search employees..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: isMobile ? "60%" : "40%",
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
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size={isSmall ? "medium" : "large"} color="primary">
              <Badge badgeContent={pending} color="error">
                <NotificationsIcon fontSize={isSmall ? "small" : "medium"} />
              </Badge>
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", ml: isSmall ? 1 : 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: isSmall ? 28 : 36, height: isSmall ? 28 : 36 }}>A</Avatar>
              {!isSmall && (
                <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: "medium" }}>
                  Admin
                </Typography>
              )}
            </Box>
          </Box>
        </Toolbar>

        {isSmall && (
          <Box sx={{ px: 2, pb: 1 }}>
            <TextField
              placeholder="Search employees..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
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
        )}
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={drawerOpen}
        onClose={() => isMobile && setDrawerOpen(false)}
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
            {/* Generate Salary Option */}
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
      <Main open={drawerOpen} isMobile={isMobile}>
        <Toolbar />
        {isSmall && <Box sx={{ height: 48 }} /> /* Extra space for search bar on small screens */}

        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage employee leave requests and accounts
              </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={isSmall ? 2 : 3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={6} md={3}>
                <SummaryCard cardcolor="#3f51b5">
                  <CardContent sx={{ p: isSmall ? 1.5 : 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ fontSize: isSmall ? "0.7rem" : "inherit" }}
                        >
                          Total Leaves
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: "bold", mt: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}
                        >
                          {total}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: alpha("#3f51b5", 0.1),
                          color: "primary.main",
                          width: isSmall ? 28 : 40,
                          height: isSmall ? 28 : 40,
                        }}
                      >
                        <AssessmentIcon fontSize={isSmall ? "small" : "medium"} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <SummaryCard cardcolor="#ff9800">
                  <CardContent sx={{ p: isSmall ? 1.5 : 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ fontSize: isSmall ? "0.7rem" : "inherit" }}
                        >
                          Pending
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: "bold", mt: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}
                        >
                          {pending}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: alpha("#ff9800", 0.1),
                          color: "#ff9800",
                          width: isSmall ? 28 : 40,
                          height: isSmall ? 28 : 40,
                        }}
                      >
                        <EventIcon fontSize={isSmall ? "small" : "medium"} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <SummaryCard cardcolor="#4caf50">
                  <CardContent sx={{ p: isSmall ? 1.5 : 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ fontSize: isSmall ? "0.7rem" : "inherit" }}
                        >
                          Approved
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: "bold", mt: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}
                        >
                          {approved}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: alpha("#4caf50", 0.1),
                          color: "#4caf50",
                          width: isSmall ? 28 : 40,
                          height: isSmall ? 28 : 40,
                        }}
                      >
                        <CheckIcon fontSize={isSmall ? "small" : "medium"} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>

              <Grid item xs={6} sm={6} md={3}>
                <SummaryCard cardcolor="#f44336">
                  <CardContent sx={{ p: isSmall ? 1.5 : 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ fontSize: isSmall ? "0.7rem" : "inherit" }}
                        >
                          Rejected
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: "bold", mt: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}
                        >
                          {rejected}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: alpha("#f44336", 0.1),
                          color: "#f44336",
                          width: isSmall ? 28 : 40,
                          height: isSmall ? 28 : 40,
                        }}
                      >
                        <CloseIcon fontSize={isSmall ? "small" : "medium"} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </Grid>
            </Grid>

            {/* Pending Leave Requests */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: isSmall ? "1rem" : "1.25rem" }}>
                  Pending Leave Requests
                </Typography>
                <FormControl size="small" sx={{ minWidth: isSmall ? 120 : 150 }}>
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
                <ResponsiveTableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Employee</StyledTableCell>
                        <StyledTableCell>Start Date</StyledTableCell>
                        <StyledTableCell>End Date</StyledTableCell>
                        {!isSmall && <StyledTableCell>Reason</StyledTableCell>}
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={isSmall ? 5 : 6} align="center" sx={{ py: 3 }}>
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
                                  <Avatar
                                    sx={{
                                      width: isSmall ? 24 : 32,
                                      height: isSmall ? 24 : 32,
                                      mr: 1,
                                      bgcolor: "primary.main",
                                    }}
                                  >
                                    {getInitials(leave.userId)}
                                  </Avatar>
                                  {isSmall ? getInitials(leave.userId) : leave.userId}
                                </Box>
                              </TableCell>
                              <TableCell>{leave.startDate}</TableCell>
                              <TableCell>{leave.endDate}</TableCell>
                              {!isSmall && <TableCell>{leave.reason}</TableCell>}
                              <TableCell>
                                <StatusChip label={leave.status} status={leave.status} size="small" />
                              </TableCell>
                              <TableCell align="right">
                                {isSmall ? (
                                  <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, leave)}>
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                ) : (
                                  <>
                                    <Button
                                      variant="outlined"
                                      color="success"
                                      size="small"
                                      startIcon={<CheckIcon />}
                                      onClick={() => handleLeaveAction(leave, "Approved")}
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
                                  </>
                                )}
                              </TableCell>
                            </StyledTableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isSmall ? 5 : 6} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              No pending leave requests found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ResponsiveTableContainer>
              </Paper>
            </Box>

            {/* Employee Management */}
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: isSmall ? "1rem" : "1.25rem" }}>
                Employee Management
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={!isSmall && <AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: 8,
                  px: isSmall ? 2 : 3,
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                  },
                }}
              >
                {isSmall ? <AddIcon /> : "Add Employee"}
              </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
              <ResponsiveTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      {!isSmall && <StyledTableCell>Email</StyledTableCell>}
                      <StyledTableCell>Role</StyledTableCell>
                      <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={isSmall ? 3 : 4} align="center" sx={{ py: 3 }}>
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
                                  width: isSmall ? 24 : 32,
                                  height: isSmall ? 24 : 32,
                                  mr: 1,
                                  bgcolor: user.role === "admin" ? "secondary.main" : "primary.main",
                                }}
                              >
                                {getInitials(user.name)}
                              </Avatar>
                              {user.name}
                            </Box>
                          </TableCell>
                          {!isSmall && <TableCell>{user.email}</TableCell>}
                          <TableCell>
                            <StatusChip
                              label={user.role === "admin" ? "Admin" : "Employee"}
                              status={user.role === "admin" ? "Admin" : "Employee"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                              <Button
                                variant="text"
                                color="primary"
                                size="small"
                                onClick={() => handleEmployeeClick(user.name)}
                                sx={{ borderRadius: 8 }}
                              >
                                {isSmall ? "View" : "View History"}
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={!isSmall && <EditIcon />}
                                onClick={() => handleEditEmployee(user)}
                                sx={{ borderRadius: 8 }}
                              >
                                {isSmall ? <EditIcon fontSize="small" /> : "Edit"}
                              </Button>
                            </Box>
                          </TableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </Paper>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}>
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
                  p: isSmall ? 1 : 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <Button
                  startIcon={<ChevronLeftIcon />}
                  onClick={handlePrevMonth}
                  sx={{ borderRadius: 8, p: isSmall ? "4px 8px" : undefined }}
                  size={isSmall ? "small" : "medium"}
                >
                  {isSmall ? "" : "Previous"}
                </Button>
                <Typography variant="h6" sx={{ fontWeight: "medium", fontSize: isSmall ? "0.9rem" : "1.25rem" }}>
                  {currentMonth.toLocaleDateString("en-US", {
                    month: isSmall ? "short" : "long",
                    year: "numeric",
                  })}
                </Typography>
                <Button
                  endIcon={<ChevronRightIcon />}
                  onClick={handleNextMonth}
                  sx={{ borderRadius: 8, p: isSmall ? "4px 8px" : undefined }}
                  size={isSmall ? "small" : "medium"}
                >
                  {isSmall ? "" : "Next"}
                </Button>
              </Box>

              {/* Calendar Grid */}
              <Box sx={{ p: isSmall ? 1 : 2 }}>
                <Grid container spacing={isSmall ? 0.5 : 1} sx={{ mb: isSmall ? 1 : 2 }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <Grid item xs={12 / 7} key={index}>
                      <Box
                        sx={{
                          textAlign: "center",
                          fontWeight: "medium",
                          color: index === 0 || index === 6 ? "error.main" : "inherit",
                          fontSize: isSmall ? "0.7rem" : "inherit",
                        }}
                      >
                        {isSmall ? day.charAt(0) : day}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={isSmall ? 0.5 : 1}>
                  {calendarData.map((day, index) => (
                    <Grid item xs={12 / 7} key={index}>
                      {day.day && (
                        <CalendarDay
                          isWeekend={day.isWeekend}
                          isToday={day.isToday}
                          hasLeave={day.leaves.length > 0}
                          onClick={() => handleDateClick(day.date, day.leaves)}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: isSmall ? 0.5 : 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: day.isToday ? "bold" : "normal",
                                fontSize: isSmall ? "0.7rem" : "inherit",
                              }}
                            >
                              {day.day}
                            </Typography>
                            {day.leaves.length > 0 && (
                              <Chip
                                label={day.leaves.length}
                                size="small"
                                sx={{
                                  height: isSmall ? "14px" : "18px",
                                  fontSize: isSmall ? "8px" : "10px",
                                  bgcolor: "primary.main",
                                  color: "white",
                                }}
                              />
                            )}
                          </Box>
                          {!isSmall && (
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
                          )}
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
                    p: isSmall ? 1.5 : 2,
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "medium",
                      display: "flex",
                      alignItems: "center",
                      fontSize: isSmall ? "0.9rem" : "1.25rem",
                    }}
                  >
                    <TodayIcon sx={{ mr: 1, fontSize: isSmall ? "1rem" : "1.5rem" }} />
                    {formatDate(selectedDate)}
                  </Typography>
                  <IconButton size="small" onClick={() => setSelectedDate(null)}>
                    <CloseIcon fontSize={isSmall ? "small" : "medium"} />
                  </IconButton>
                </Box>
                <ResponsiveTableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Employee</StyledTableCell>
                        <StyledTableCell>Start Date</StyledTableCell>
                        <StyledTableCell>End Date</StyledTableCell>
                        {!isSmall && <StyledTableCell>Reason</StyledTableCell>}
                        <StyledTableCell>Status</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dayLeaves.length > 0 ? (
                        dayLeaves.map((leave, index) => (
                          <StyledTableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                  sx={{
                                    width: isSmall ? 24 : 32,
                                    height: isSmall ? 24 : 32,
                                    mr: 1,
                                    bgcolor: "primary.main",
                                  }}
                                >
                                  {getInitials(leave.userId)}
                                </Avatar>
                                {isSmall ? getInitials(leave.userId) : leave.userId}
                              </Box>
                            </TableCell>
                            <TableCell>{leave.startDate}</TableCell>
                            <TableCell>{leave.endDate}</TableCell>
                            {!isSmall && <TableCell>{leave.reason}</TableCell>}
                            <TableCell>
                              <StatusChip label={leave.status} status={leave.status} size="small" />
                            </TableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isSmall ? 4 : 5} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              No leaves found for this date
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ResponsiveTableContainer>
              </Paper>
            )}
          </>
        )}

        {/* View History Section */}
        {activeTab === 3 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}>
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
                <Tabs
                  value={historyTab}
                  onChange={handleHistoryTabChange}
                  aria-label="history tabs"
                  variant={isSmall ? "fullWidth" : "standard"}
                >
                  <StyledTab label={isSmall ? "Distribution" : "Leave Distribution"} />
                  <StyledTab label={isSmall ? "Trends" : "Monthly Trends"} />
                </Tabs>
              </Box>

              {historyTab === 0 && (
                <Box sx={{ p: isSmall ? 1.5 : 3 }}>
                  <Grid container spacing={isSmall ? 2 : 3}>
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "medium", fontSize: isSmall ? "1rem" : "1.25rem" }}
                      >
                        Leave Distribution by Type
                      </Typography>
                      <Box sx={{ height: isSmall ? 200 : 300 }}>
                        <LeaveTypeDistribution data={leaveStats} />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "medium", fontSize: isSmall ? "1rem" : "1.25rem" }}
                      >
                        Employee Leave Distribution
                      </Typography>
                      <Box sx={{ height: isSmall ? 300 : 400 }}>
                        <EmployeeLeaveDistribution data={overallStats.leavesByEmployee} />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {historyTab === 1 && (
                <Box sx={{ p: isSmall ? 1.5 : 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", fontSize: isSmall ? "1rem" : "1.25rem" }}>
                    Monthly Leave Trends
                  </Typography>
                  <Box sx={{ height: isSmall ? 300 : 400 }}>
                    <LeaveHistoryChart data={leaveStats} />
                  </Box>
                </Box>
              )}
            </Paper>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: isSmall ? "1rem" : "1.25rem" }}>
                Employee Leave History
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
              <ResponsiveTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Employee</StyledTableCell>
                      <StyledTableCell>Total</StyledTableCell>
                      {!isSmall && (
                        <>
                          <StyledTableCell>Sick</StyledTableCell>
                          <StyledTableCell>Casual</StyledTableCell>
                          <StyledTableCell>Medical</StyledTableCell>
                          <StyledTableCell>WFH</StyledTableCell>
                        </>
                      )}
                      <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={isSmall ? 3 : 7} align="center" sx={{ py: 3 }}>
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
                                <Avatar
                                  sx={{
                                    width: isSmall ? 24 : 32,
                                    height: isSmall ? 24 : 32,
                                    mr: 1,
                                    bgcolor: "primary.main",
                                  }}
                                >
                                  {getInitials(user.name)}
                                </Avatar>
                                {user.name}
                              </Box>
                            </TableCell>
                            <TableCell>{user.totalLeaves || 12}</TableCell>
                            {!isSmall && (
                              <>
                                <TableCell>{user.sickleave || 0}</TableCell>
                                <TableCell>{user.casualleave || 0}</TableCell>
                                <TableCell>{user.medicalleave || 0}</TableCell>
                                <TableCell>{user.Workfromhome || 0}</TableCell>
                              </>
                            )}
                            <TableCell align="right">
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleEmployeeClick(user.name)}
                                sx={{ borderRadius: 8 }}
                              >
                                {isSmall ? "View" : "View Details"}
                              </Button>
                            </TableCell>
                          </StyledTableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTableContainer>
            </Paper>
          </>
        )}

        {/* Show Employee Section when activeTab is 2 */}
        {activeTab === 2 && <EmployeeSection />}

        {/* Reports Section */}
        {activeTab === 4 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, fontSize: isSmall ? "1.5rem" : "2.125rem" }}>
                Leave Reports
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive reports and analytics on employee leaves
              </Typography>
            </Box>

            <Grid container spacing={isSmall ? 2 : 3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.08)",
                    p: isSmall ? 1.5 : 3,
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", fontSize: isSmall ? "1rem" : "1.25rem" }}>
                    Leave Distribution by Type
                  </Typography>
                  <Box sx={{ height: isSmall ? 200 : 300 }}>
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
                    p: isSmall ? 1.5 : 3,
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", fontSize: isSmall ? "1rem" : "1.25rem" }}>
                    Monthly Leave Trends
                  </Typography>
                  <Box sx={{ height: isSmall ? 200 : 300 }}>
                    <MonthlyLeaveReport data={overallStats.leavesByMonth} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.08)",
                    p: isSmall ? 1.5 : 3,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", fontSize: isSmall ? "1rem" : "1.25rem" }}>
                    Employee Leave Comparison
                  </Typography>
                  <Box sx={{ height: isSmall ? 300 : 400 }}>
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
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth fullScreen={isSmall}>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: isSmall ? "1.1rem" : "1.25rem" }}>
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
              startIcon={!isSmall && <AddIcon />}
              sx={{
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                },
              }}
            >
              {isSmall ? <AddIcon /> : "Add Employee"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isSmall}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: isSmall ? "1.1rem" : "1.25rem" }}>
              Edit Employee
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {employeeToEdit && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    margin="dense"
                    value={employeeToEdit.name}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    margin="dense"
                    value={employeeToEdit.email}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total Leaves"
                    type="number"
                    margin="dense"
                    value={employeeToEdit.totalLeaves}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, totalLeaves: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sick Leave"
                    type="number"
                    margin="dense"
                    value={employeeToEdit.sickleave}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, sickleave: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    type="number"
                    margin="dense"
                    value={employeeToEdit.salary}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, salary: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Casual Leave"
                    type="number"
                    margin="dense"
                    value={employeeToEdit.casualleave}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, casualleave: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Medical Leave"
                    type="number"
                    margin="dense"
                    value={employeeToEdit.medicalleave}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, medicalleave: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Work From Home"
                    type="number"
                    margin="dense"
                    value={employeeToEdit.Workfromhome}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, Workfromhome: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={employeeToEdit.role}
                      label="Role"
                      onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, role: e.target.value })}
                    >
                      <MenuItem value="employee">Employee</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={employeeToEdit.isTeamLeader}
                        onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, isTeamLeader: e.target.checked })}
                      />
                    }
                    label="Is Team Leader?"
                  />
                </Grid>
                {employeeToEdit.isTeamLeader && (
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Select Team Members</InputLabel>
                      <Select
                        multiple
                        value={employeeToEdit.teamMembers}
                        onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, teamMembers: e.target.value })}
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
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              color="inherit"
              variant="outlined"
              sx={{ borderRadius: 8 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateEmployee}
              color="primary"
              variant="contained"
              startIcon={!isSmall && <EditIcon />}
              sx={{
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                },
              }}
            >
              {isSmall ? <EditIcon /> : "Update Employee"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Employee Leave History Dialog */}
        <Dialog
          open={Boolean(selectedEmployee)}
          onClose={() => setSelectedEmployee(null)}
          maxWidth="md"
          fullWidth
          fullScreen={isSmall}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: isSmall ? "1.1rem" : "1.25rem" }}>
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
                  <Box sx={{ height: isSmall ? 200 : 300 }}>
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
                <ResponsiveTableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Start Date</StyledTableCell>
                        <StyledTableCell>End Date</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        {!isSmall && <StyledTableCell>Days Taken</StyledTableCell>}
                        {!isSmall && <StyledTableCell>Reason</StyledTableCell>}
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
                          {!isSmall && <TableCell>{leave.daysTaken}</TableCell>}
                          {!isSmall && <TableCell>{leave.reason}</TableCell>}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ResponsiveTableContainer>
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

        {/* Action Menu for Mobile */}
        <Menu anchorEl={actionMenuAnchorEl} open={Boolean(actionMenuAnchorEl)} onClose={handleActionMenuClose}>
          {selectedActionUser && (
            <>
              <MenuItem
                onClick={() => {
                  handleLeaveAction(selectedActionUser, "Approved")
                  handleActionMenuClose()
                }}
              >
                <CheckIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                Approve
              </MenuItem>
              <MenuItem
                onClick={() => {
                  updateLeaveStatus(selectedActionUser._id, "Rejected")
                  handleActionMenuClose()
                }}
              >
                <CloseIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                Reject
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Comment Dialog */}
        <Dialog
          open={commentDialogOpen}
          onClose={() => setCommentDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isSmall}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: isSmall ? "1.1rem" : "1.25rem" }}>
              Add Comment for Approval
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add an optional message that will be included in the email notification to the employee.
            </Typography>
            <TextField
              fullWidth
              label="Comment"
              multiline
              rows={4}
              value={leaveComment}
              onChange={(e) => setLeaveComment(e.target.value)}
              placeholder="Great job on your recent project! Enjoy your time off."
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setCommentDialogOpen(false)}
              color="inherit"
              variant="outlined"
              sx={{ borderRadius: 8 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCommentSubmit}
              color="primary"
              variant="contained"
              startIcon={!isSmall && <CheckIcon />}
              sx={{
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(63, 81, 181, 0.3)",
                },
              }}
            >
              {isSmall ? <CheckIcon /> : "Approve with Comment"}
            </Button>
          </DialogActions>
        </Dialog>
      </Main>
    </Box>
  )
}

export default AdminDashboard
