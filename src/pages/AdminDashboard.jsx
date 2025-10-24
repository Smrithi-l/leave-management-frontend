"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  LinearProgress,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
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
  useTheme as useMuiTheme,
  Stack,
  Badge,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Fade,
  Grow,
  Zoom,
  styled,
  alpha,
  Drawer,
  CssBaseline,
  SwipeableDrawer,
  ThemeProvider,
  createTheme,
  Menu,
  ListItem,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import {
  Dashboard,
  Person,
  Event,
  Assessment,
  ExitToApp,
  Search,
  Add,
  Check,
  Close,
  Notifications,
  FilterList,
  ChevronLeft,
  ChevronRight,
  Today,
  History,
  AttachMoney,
  Menu as MenuIcon,
  MoreVert,
  Edit,
  Brightness4,
  Brightness7,
  Refresh,
  CheckCircleOutline,
  CancelOutlined,
  HourglassEmpty,
  Group,
  CalendarMonth,
  DateRange,
  Download,
  SupervisorAccount,
  Settings,
  Help,
  Logout,
  BarChart,
  PieChart,
  Info,
  Delete,
  Spa,
  Healing,
  Home,
  AccessTime,
} from "@mui/icons-material"
import axios from "axios"
import { format, differenceInDays } from "date-fns"

import { LeaveHistoryChart } from "../components/leave-history-chart"
import { EmployeeLeaveDistribution } from "../components/employee-leave-distribution"
import { LeaveTypeDistribution } from "../components/leave-type-distribution"
import { MonthlyLeaveReport } from "../components/monthly-leave-report"
import { EmployeeLeaveComparison } from "../components/employee-leave-comparsion"
import { EmployeeSection } from "../components/employee-section"
import GenerateSalary from "../components/generate-salary"

// <CHANGE> Added theme configuration matching employee dashboard
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563eb",
        light: "#2563eb",
        dark: "rgba(101, 41, 198, 1)",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ec4899",
        light: "#f472b6",
        dark: "#db2777",
        contrastText: "#ffffff",
      },
      success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
      },
      warning: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
      },
      error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
      },
      info: {
        main: "#06b6d4",
        light: "#22d3ee",
        dark: "#0891b2",
      },
      background: {
        default: mode === "light" ? "#f8fafc" : "#0f172a",
        paper: mode === "light" ? "#ffffff" : "#1e293b",
      },
      text: {
        primary: mode === "light" ? "#1e293b" : "#f1f5f9",
        secondary: mode === "light" ? "#64748b" : "#94a3b8",
      },
      grey: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
      },
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: "-0.025em",
      },
      h2: {
        fontWeight: 700,
        letterSpacing: "-0.025em",
      },
      h3: {
        fontWeight: 700,
        letterSpacing: "-0.025em",
      },
      h4: {
        fontWeight: 600,
        letterSpacing: "-0.025em",
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      "none",
      "0px 1px 2px rgba(15, 23, 42, 0.1)",
      "0px 2px 4px rgba(15, 23, 42, 0.08)",
      "0px 4px 8px rgba(15, 23, 42, 0.08)",
      "0px 8px 16px rgba(15, 23, 42, 0.08)",
      "0px 16px 24px rgba(15, 23, 42, 0.08)",
      "0px 20px 32px rgba(15, 23, 42, 0.08)",
      ...Array(18).fill("none"),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: "none",
            padding: "10px 20px",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          },
          contained: {
            "&.MuiButton-containedPrimary": {
              background: "linear-gradient(135deg, #2563eb, rgba(159, 123, 244, 1))",
            },
            "&.MuiButton-containedSecondary": {
              background: "linear-gradient(135deg, #ec4899, #f472b6)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === "light" ? "0 4px 20px rgba(15, 23, 42, 0.06)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            border: `1px solid ${mode === "light" ? "rgba(226, 232, 240, 0.8)" : "rgba(71, 85, 105, 0.3)"}`,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: mode === "light" ? "0 10px 30px rgba(15, 23, 42, 0.1)" : "0 10px 30px rgba(0, 0, 0, 0.5)",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "16px",
            borderColor: mode === "light" ? "rgba(226, 232, 240, 0.8)" : "rgba(71, 85, 105, 0.3)",
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === "light" ? "#f8fafc" : "#1e293b",
            color: mode === "light" ? "#334155" : "#cbd5e1",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 8,
          },
          filled: {
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: "4px 8px",
            padding: "10px 16px",
            "&.Mui-selected": {
              backgroundColor: "rgba(109, 40, 217, 0.08)",
              "&:hover": {
                backgroundColor: "rgba(109, 40, 217, 0.12)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: "20%",
                height: "60%",
                width: 4,
                backgroundColor: "#2563eb",
                borderRadius: "0 4px 4px 0",
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: "none",
            boxShadow: "4px 0 24px rgba(15, 23, 42, 0.08)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 10px rgba(15, 23, 42, 0.05)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          outlined: {
            borderRadius: 10,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: "1.25rem",
            fontWeight: 600,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            minHeight: 48,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            height: 8,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === "light" ? "rgba(226, 232, 240, 0.8)" : "rgba(71, 85, 105, 0.3)",
          },
        },
      },
    },
  })

// <CHANGE> Added styled components matching employee dashboard
const DRAWER_WIDTH = 260

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
  zIndex: theme.zIndex.drawer + 1,
}))

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
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
    marginLeft: 0,
  }),
}))

const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: "blur(10px)",
  borderRadius: 20,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 30px 0 rgba(31, 38, 135, 0.12)",
  },
}))

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}))

const StatusChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: 10,
  fontWeight: 600,
  boxShadow: "0 2px 5px 0 rgba(0,0,0,0.05)",
  "& .MuiChip-icon": {
    fontSize: 16,
  },
}))

const GradientButton = styled(Button)(({ theme, color = "primary" }) => ({
  borderRadius: 10,
  padding: "10px 20px",
  fontWeight: 600,
  textTransform: "none",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  color: "white",
  "&:hover": {
    boxShadow: "0 6px 15px 0 rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
  "& .MuiTableHead-root": {
    backgroundColor: alpha(theme.palette.grey[100], 0.8),
  },
  "& .MuiTableCell-head": {
    color: theme.palette.grey[700],
    fontWeight: 600,
    padding: "16px",
  },
  "& .MuiTableRow-root:nth-of-type(even)": {
    backgroundColor: alpha(theme.palette.grey[50], 0.5),
  },
  "& .MuiTableRow-root:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  border: `2px solid ${theme.palette.background.paper}`,
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.paper, 0.95)})`,
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "none",
  },
}))

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3, 2),
  ...theme.mixins.toolbar,
}))

const StatCard = styled(Card)(({ theme, accentColor }) => ({
  borderRadius: 20,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: accentColor || theme.palette.primary.main,
  },
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
  },
}))

const CircularProgressWithLabel = ({ value, color, label, total }) => {
  const normalizedValue = Math.min((value / total) * 100, 100)

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={80}
        thickness={4}
        sx={{
          color: (theme) => alpha(theme.palette.grey[300], 0.3),
          position: "absolute",
        }}
      />
      <CircularProgress
        variant="determinate"
        value={normalizedValue}
        size={80}
        thickness={4}
        sx={{
          color: color,
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          {value || 0}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  )
}

const LeaveTypeIcon = ({ type, ...props }) => {
  switch (type?.toLowerCase()) {
    case "casual":
    case "casualleave":
      return <Spa {...props} />
    case "sick":
    case "sickleave":
      return <Healing {...props} />
    case "medical":
    case "medicalleave":
      return <LocalHospital {...props} />
    case "work from home":
    case "workfromhome":
      return <Home {...props} />
    default:
      return <AccessTime {...props} />
  }
}

const LocalHospital = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM18 14H14V18H10V14H6V10H10V6H14V10H18V14Z"
        fill="currentColor"
      />
    </svg>
  )
}

const AdminDashboard = () => {
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(muiTheme.breakpoints.down("md"))

  // <CHANGE> Added dark mode state management
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode")
    return saved ? JSON.parse(saved) : false
  })

  const theme = getTheme(darkMode ? "dark" : "light")

  const [drawerOpen, setDrawerOpen] = useState(!isMobile)
  const [activeView, setActiveView] = useState("dashboard")
  const [notificationAnchor, setNotificationAnchor] = useState(null)

  // <CHANGE> Added snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // ... existing code ...

  const [leaveRequests, setLeaveRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [open, setOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
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

  // <CHANGE> Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

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
      const response = await axios.get("http://localhost:5000/api/dashboard/overall-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
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
      // <CHANGE> Using snackbar instead of alert
      setSnackbar({
        open: true,
        message: "Failed to fetch leave history.",
        severity: "error",
      })
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
      // <CHANGE> Using snackbar instead of alert
      setSnackbar({
        open: true,
        message: `Leave request ${status.toLowerCase()} successfully!`,
        severity: "success",
      })
      setLeaveComment("")
    } catch (error) {
      console.error("Error updating leave request:", error)
      setSnackbar({
        open: true,
        message: "Failed to update leave request.",
        severity: "error",
      })
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
      // <CHANGE> Using snackbar instead of alert
      setSnackbar({
        open: true,
        message: "Employee added successfully!",
        severity: "success",
      })
    } catch (error) {
      console.error("Error adding employee:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add employee.",
        severity: "error",
      })
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
      // <CHANGE> Using snackbar instead of alert
      setSnackbar({
        open: true,
        message: "Employee updated successfully!",
        severity: "success",
      })
    } catch (error) {
      console.error("Error updating employee:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update employee.",
        severity: "error",
      })
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
      weekday: isMobile ? "short" : "long",
      year: "numeric",
      month: isMobile ? "short" : "long",
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

  // <CHANGE> Added status chip renderer matching employee dashboard
  const getStatusChip = (status) => {
    switch (status) {
      case "Approved":
        return (
          <StatusChip icon={<CheckCircleOutline />} label="Approved" color="success" size="small" variant="filled" />
        )
      case "Rejected":
        return <StatusChip icon={<CancelOutlined />} label="Rejected" color="error" size="small" variant="filled" />
      case "Pending":
        return <StatusChip icon={<HourglassEmpty />} label="Pending" color="warning" size="small" variant="filled" />
      default:
        return <StatusChip label={status} size="small" />
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // <CHANGE> Added sidebar content with modern styling
  const sidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <DrawerHeader>
      </DrawerHeader>

      <Divider sx={{ my: 2 }} />

      <List sx={{ flexGrow: 1, px: 1 }}>
        <ListItemButton
          selected={activeView === "dashboard"}
          onClick={() => {
            setActiveView("dashboard")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <Dashboard color={activeView === "dashboard" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          selected={activeView === "leaveRequests"}
          onClick={() => {
            setActiveView("leaveRequests")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <Event color={activeView === "leaveRequests" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Leave Requests" />
          {pending > 0 && (
            <Chip label={pending} size="small" color="warning" sx={{ height: 20, fontSize: "0.75rem" }} />
          )}
        </ListItemButton>

        <ListItemButton
          selected={activeView === "employees"}
          onClick={() => {
            setActiveView("employees")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <Person color={activeView === "employees" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Employees" />
        </ListItemButton>

        <ListItemButton
          selected={activeView === "analytics"}
          onClick={() => {
            setActiveView("analytics")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <Assessment color={activeView === "analytics" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItemButton>

        <ListItemButton
          selected={activeView === "calendar"}
          onClick={() => {
            setActiveView("calendar")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <CalendarMonth color={activeView === "calendar" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItemButton>

        <ListItemButton
          selected={activeView === "salary"}
          onClick={() => {
            setActiveView("salary")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <AttachMoney color={activeView === "salary" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Salary" />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItemButton
          selected={activeView === "settings"}
          onClick={() => {
            setActiveView("settings")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <Settings color={activeView === "settings" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton
          selected={activeView === "help"}
          onClick={() => {
            setActiveView("help")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <Help color={activeView === "help" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <Logout color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: "error" }} />
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* <CHANGE> Modern AppBar with dark mode toggle */}
        <StyledAppBar position="fixed">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, ...(drawerOpen && !isMobile && { display: "none" }) }}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon />
            </IconButton>

            <SupervisorAccount sx={{ mr: 2, display: { xs: "none", sm: "block" }, color: "primary.main" }} />

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, fontWeight: 600 }}
              >
                {activeView === "dashboard"
                  ? "Admin Dashboard"
                  : activeView === "leaveRequests"
                    ? "Leave Requests"
                    : activeView === "employees"
                      ? "Employee Management"
                      : activeView === "analytics"
                        ? "Analytics & Reports"
                        : activeView === "calendar"
                          ? "Leave Calendar"
                          : activeView === "salary"
                            ? "Salary Management"
                            : activeView === "settings"
                              ? "Settings"
                              : activeView === "help"
                                ? "Help & Support"
                                : "Dashboard"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                Manage your organization efficiently
              </Typography>
            </Box>

            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
              <AnimatedIconButton color="primary" onClick={() => setDarkMode(!darkMode)} sx={{ mr: 1 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </AnimatedIconButton>
            </Tooltip>

            <StyledBadge badgeContent={pending} color="error" sx={{ mr: 2 }}>
              <AnimatedIconButton color="primary" onClick={(e) => setNotificationAnchor(e.currentTarget)}>
                <Notifications />
              </AnimatedIconButton>
            </StyledBadge>

            <Tooltip title="Admin">
              <StyledAvatar sx={{ bgcolor: theme.palette.primary.main, cursor: "pointer" }}>A</StyledAvatar>
            </Tooltip>
          </Toolbar>
        </StyledAppBar>

        {/* <CHANGE> Notification menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={() => setNotificationAnchor(null)}
          PaperProps={{
            sx: {
              width: 350,
              maxHeight: 400,
              borderRadius: 3,
              mt: 1,
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="bold">
              Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You have {pending} pending leave request{pending !== 1 ? "s" : ""}
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {leaveRequests
              .filter((leave) => leave.status === "Pending")
              .slice(0, 5)
              .map((leave, index) => (
                <ListItem key={leave._id || index} divider>
                  <ListItemIcon>
                    <HourglassEmpty color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${leave.userId} - ${leave.type}`}
                    secondary={`${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            {pending === 0 && (
              <ListItem>
                <ListItemText
                  primary="No pending notifications"
                  secondary="All caught up!"
                  sx={{ textAlign: "center" }}
                />
              </ListItem>
            )}
          </List>
          {pending > 0 && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", textAlign: "center" }}>
              <Button
                size="small"
                onClick={() => {
                  setActiveView("leaveRequests")
                  setNotificationAnchor(null)
                }}
              >
                View All
              </Button>
            </Box>
          )}
        </Menu>

        {/* <CHANGE> Modern drawer with swipeable support on mobile */}
        {isMobile ? (
          <SwipeableDrawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "85%", sm: DRAWER_WIDTH },
                boxSizing: "border-box",
                backgroundImage: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              },
            }}
          >
            {sidebarContent}
          </SwipeableDrawer>
        ) : (
          <StyledDrawer variant="permanent" open={drawerOpen}>
            {sidebarContent}
          </StyledDrawer>
        )}

        <Main open={drawerOpen && !isMobile}>
          <DrawerHeader />
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 4 }}>
            {/* <CHANGE> Dashboard view with modern stat cards */}
            {activeView === "dashboard" && (
              <>
                <Fade in={true} timeout={500}>
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
                    <Box>
                      <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } }}
                      >
                        Admin Dashboard
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Overview of leave requests and employee management
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <GradientButton startIcon={<Add />} onClick={() => setOpen(true)}>
                        Add Employee
                      </GradientButton>
                      <Tooltip title="Refresh data">
                        <AnimatedIconButton
                          onClick={fetchLeaveRequests}
                          color="primary"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Refresh />
                        </AnimatedIconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Fade>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                      <StatCard accentColor={theme.palette.primary.main}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              Total Requests
                            </Typography>
                            <Event color="primary" />
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                            <CircularProgressWithLabel
                              value={total}
                              total={Math.max(total, 10)}
                              color={theme.palette.primary.main}
                              label="requests"
                            />
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">
                              All time
                            </Typography>
                            <Chip label={total} size="small" color="primary" variant="filled" />
                          </Box>
                        </CardContent>
                      </StatCard>
                    </Zoom>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                      <StatCard accentColor={theme.palette.warning.main}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              Pending
                            </Typography>
                            <HourglassEmpty color="warning" />
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                            <CircularProgressWithLabel
                              value={pending}
                              total={Math.max(total, 10)}
                              color={theme.palette.warning.main}
                              label="pending"
                            />
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((pending / Math.max(total, 1)) * 100, 100) || 0}
                                color="warning"
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                              {Math.round((pending / Math.max(total, 1)) * 100) || 0}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </StatCard>
                    </Zoom>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Zoom in={true} style={{ transitionDelay: "300ms" }}>
                      <StatCard accentColor={theme.palette.success.main}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              Approved
                            </Typography>
                            <CheckCircleOutline color="success" />
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                            <CircularProgressWithLabel
                              value={approved}
                              total={Math.max(total, 10)}
                              color={theme.palette.success.main}
                              label="approved"
                            />
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((approved / Math.max(total, 1)) * 100, 100) || 0}
                                color="success"
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                              {Math.round((approved / Math.max(total, 1)) * 100) || 0}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </StatCard>
                    </Zoom>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Zoom in={true} style={{ transitionDelay: "400ms" }}>
                      <StatCard accentColor={theme.palette.error.main}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              Rejected
                            </Typography>
                            <CancelOutlined color="error" />
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                            <CircularProgressWithLabel
                              value={rejected}
                              total={Math.max(total, 10)}
                              color={theme.palette.error.main}
                              label="rejected"
                            />
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <Box sx={{ flexGrow: 1, mr: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((rejected / Math.max(total, 1)) * 100, 100) || 0}
                                color="error"
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                              {Math.round((rejected / Math.max(total, 1)) * 100) || 0}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </StatCard>
                    </Zoom>
                  </Grid>
                </Grid>

                <Fade in={true} timeout={800}>
                  <GlassCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                        Recent Leave Requests
                      </Typography>

                      {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                          <CircularProgress size={40} />
                        </Box>
                      ) : (
                        <StyledTableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                                {!isMobile && <TableCell>Duration</TableCell>}
                                <TableCell>Status</TableCell>
                                {!isMobile && <TableCell align="center">Actions</TableCell>}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {leaveRequests.slice(0, 5).map((leave) => (
                                <TableRow key={leave._id} hover>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <StyledAvatar sx={{ width: 32, height: 32 }}>
                                        {getInitials(leave.userId)}
                                      </StyledAvatar>
                                      <Typography variant="body2" fontWeight="medium">
                                        {leave.userId}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      icon={<LeaveTypeIcon type={leave.type} fontSize="small" />}
                                      label={leave.type}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                                  <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                                  {!isMobile && (
                                    <TableCell>
                                      <Chip
                                        label={`${differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    </TableCell>
                                  )}
                                  <TableCell>{getStatusChip(leave.status)}</TableCell>
                                  {!isMobile && (
                                    <TableCell align="center">
                                      {leave.status === "Pending" && (
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                          <Tooltip title="Approve">
                                            <IconButton
                                              size="small"
                                              color="success"
                                              onClick={() => handleLeaveAction(leave, "Approved")}
                                            >
                                              <Check />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Reject">
                                            <IconButton
                                              size="small"
                                              color="error"
                                              onClick={() => updateLeaveStatus(leave._id, "Rejected")}
                                            >
                                              <Close />
                                            </IconButton>
                                          </Tooltip>
                                        </Stack>
                                      )}
                                    </TableCell>
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </StyledTableContainer>
                      )}

                      <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button
                          variant="outlined"
                          onClick={() => setActiveView("leaveRequests")}
                          sx={{ borderRadius: 10 }}
                        >
                          View All Requests
                        </Button>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Fade>
              </>
            )}

            {/* <CHANGE> Leave Requests view with modern table */}
            {activeView === "leaveRequests" && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 4,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h4" component="h1" fontWeight="bold">
                      Leave Requests
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <TextField
                        size="small"
                        placeholder="Search employee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: searchQuery && (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={() => setSearchQuery("")}>
                                <Close fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ minWidth: { xs: "100%", sm: 200 } }}
                      />
                      <FormControl
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: { xs: "100%", sm: 150 },
                        }}
                      >
                        <InputLabel id="filter-label">Filter</InputLabel>
                        <Select
                          labelId="filter-label"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          label="Filter"
                        >
                          <MenuItem value="All">All</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Approved">Approved</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                      <Tooltip title="Refresh data">
                        <AnimatedIconButton
                          onClick={fetchLeaveRequests}
                          color="primary"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        >
                          <Refresh />
                        </AnimatedIconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <GlassCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                          <CircularProgress size={40} />
                        </Box>
                      ) : filteredRequests.length === 0 ? (
                        <Paper sx={{ p: 3, textAlign: "center", borderRadius: 16 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchQuery || filterStatus !== "All"
                              ? "No matching leave requests found"
                              : "No leave requests found"}
                          </Typography>
                        </Paper>
                      ) : isMobile ? (
                        <Box sx={{ mt: 2 }}>
                          {filteredRequests.map((leave, index) => (
                            <Grow in={true} key={leave._id} timeout={(index + 1) * 200}>
                              <GlassCard sx={{ mb: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <StyledAvatar>{getInitials(leave.userId)}</StyledAvatar>
                                      <Box>
                                        <Typography variant="subtitle1" fontWeight="600">
                                          {leave.userId}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {leave.type}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    {getStatusChip(leave.status)}
                                  </Box>

                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                                      mb: 2,
                                    }}
                                  >
                                    <Grid container spacing={2}>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ display: "block", mb: 0.5 }}
                                        >
                                          From
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                          {new Date(leave.startDate).toLocaleDateString()}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ display: "block", mb: 0.5 }}
                                        >
                                          To
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                          {new Date(leave.endDate).toLocaleDateString()}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>

                                  {leave.status === "Pending" && (
                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
                                      <GradientButton
                                        color="success"
                                        fullWidth
                                        size="small"
                                        onClick={() => handleLeaveAction(leave, "Approved")}
                                      >
                                        Approve
                                      </GradientButton>
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth
                                        size="small"
                                        onClick={() => updateLeaveStatus(leave._id, "Rejected")}
                                      >
                                        Reject
                                      </Button>
                                    </Box>
                                  )}
                                </CardContent>
                              </GlassCard>
                            </Grow>
                          ))}
                        </Box>
                      ) : (
                        <StyledTableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredRequests.map((leave) => (
                                <TableRow key={leave._id} hover>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <StyledAvatar sx={{ width: 32, height: 32 }}>
                                        {getInitials(leave.userId)}
                                      </StyledAvatar>
                                      <Typography variant="body2" fontWeight="medium">
                                        {leave.userId}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      icon={<LeaveTypeIcon type={leave.type} fontSize="small" />}
                                      label={leave.type}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                                  <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`${differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days`}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        maxWidth: 200,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {leave.reason}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>{getStatusChip(leave.status)}</TableCell>
                                  <TableCell align="center">
                                    {leave.status === "Pending" && (
                                      <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Approve">
                                          <IconButton
                                            size="small"
                                            color="success"
                                            onClick={() => handleLeaveAction(leave, "Approved")}
                                          >
                                            <Check />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => updateLeaveStatus(leave._id, "Rejected")}
                                          >
                                            <Close />
                                          </IconButton>
                                        </Tooltip>
                                      </Stack>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </StyledTableContainer>
                      )}
                    </CardContent>
                  </GlassCard>
                </Box>
              </Fade>
            )}

            {/* <CHANGE> Employees view with modern cards */}
            {activeView === "employees" && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                      Employee Management
                    </Typography>
                    <GradientButton startIcon={<Add />} onClick={() => setOpen(true)}>
                      Add Employee
                    </GradientButton>
                  </Box>

                  <GlassCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                          <CircularProgress size={40} />
                        </Box>
                      ) : users.length === 0 ? (
                        <Paper sx={{ p: 3, textAlign: "center", borderRadius: 16 }}>
                          <Typography variant="body1" color="text.secondary">
                            No employees found
                          </Typography>
                        </Paper>
                      ) : isMobile ? (
                        <Box sx={{ mt: 2 }}>
                          {users.map((user, index) => (
                            <Grow in={true} key={user._id} timeout={(index + 1) * 200}>
                              <GlassCard sx={{ mb: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                    <StyledAvatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
                                      {getInitials(user.name)}
                                    </StyledAvatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography variant="subtitle1" fontWeight="600">
                                        {user.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                      </Typography>
                                    </Box>
                                    <IconButton size="small" onClick={() => handleEditEmployee(user)}>
                                      <Edit fontSize="small" />
                                    </IconButton>
                                  </Box>

                                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <Chip label={user.role} size="small" color="primary" variant="outlined" />
                                    {user.isTeamLeader && (
                                      <Chip label="Team Leader" size="small" color="secondary" variant="outlined" />
                                    )}
                                  </Box>

                                  <Divider sx={{ my: 2 }} />

                                  <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary">
                                        Total Leaves
                                      </Typography>
                                      <Typography variant="body2" fontWeight="medium">
                                        {user.totalLeaves || 0}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary">
                                        Salary
                                      </Typography>
                                      <Typography variant="body2" fontWeight="medium">
                                        ${user.salary || 0}
                                      </Typography>
                                    </Grid>
                                  </Grid>

                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleEmployeeClick(user.name)}
                                    sx={{ mt: 2, borderRadius: 10 }}
                                  >
                                    View Leave History
                                  </Button>
                                </CardContent>
                              </GlassCard>
                            </Grow>
                          ))}
                        </Box>
                      ) : (
                        <StyledTableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Total Leaves</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {users.map((user) => (
                                <TableRow key={user._id} hover>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <StyledAvatar sx={{ width: 32, height: 32 }}>
                                        {getInitials(user.name)}
                                      </StyledAvatar>
                                      <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                          {user.name}
                                        </Typography>
                                        {user.isTeamLeader && (
                                          <Chip
                                            label="Team Leader"
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            sx={{ height: 16, fontSize: "0.65rem" }}
                                          />
                                        )}
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    <Chip label={user.role} size="small" color="primary" variant="outlined" />
                                  </TableCell>
                                  <TableCell>{user.totalLeaves || 0}</TableCell>
                                  <TableCell>${user.salary || 0}</TableCell>
                                  <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                      <Tooltip title="Edit">
                                        <IconButton size="small" color="primary" onClick={() => handleEditEmployee(user)}>
                                          <Edit fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="View History">
                                        <IconButton
                                          size="small"
                                          color="info"
                                          onClick={() => handleEmployeeClick(user.name)}
                                        >
                                          <History fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </StyledTableContainer>
                      )}
                    </CardContent>
                  </GlassCard>
                </Box>
              </Fade>
            )}

            {/* <CHANGE> Analytics view */}
            {activeView === "analytics" && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                    Analytics & Reports
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <GlassCard>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Leave Type Distribution
                          </Typography>
                          <Box sx={{ height: 300 }}>
                            <LeaveTypeDistribution data={overallStats.leavesByType} />
                          </Box>
                        </CardContent>
                      </GlassCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <GlassCard>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Monthly Leave Report
                          </Typography>
                          <Box sx={{ height: 300 }}>
                            <MonthlyLeaveReport data={overallStats.leavesByMonth} />
                          </Box>
                        </CardContent>
                      </GlassCard>
                    </Grid>

                    <Grid item xs={12}>
                      <GlassCard>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Employee Leave Comparison
                          </Typography>
                          <Box sx={{ height: 400 }}>
                            <EmployeeLeaveComparison data={overallStats.leavesByEmployee} />
                          </Box>
                        </CardContent>
                      </GlassCard>
                    </Grid>

                    <Grid item xs={12}>
                      <GlassCard>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            Employee Leave Distribution
                          </Typography>
                          <Box sx={{ height: 400 }}>
                            <EmployeeLeaveDistribution data={leaveStats} />
                          </Box>
                        </CardContent>
                      </GlassCard>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* <CHANGE> Calendar view */}
            {activeView === "calendar" && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                    Leave Calendar
                  </Typography>

                  <GlassCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <IconButton onClick={handlePrevMonth} color="primary">
                          <ChevronLeft />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold">
                          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </Typography>
                        <IconButton onClick={handleNextMonth} color="primary">
                          <ChevronRight />
                        </IconButton>
                      </Box>

                      <Grid container spacing={1}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <Grid item xs={12 / 7} key={day}>
                            <Typography variant="caption" fontWeight="bold" align="center" display="block">
                              {day}
                            </Typography>
                          </Grid>
                        ))}

                        {calendarData.map((dayData, index) => (
                          <Grid item xs={12 / 7} key={index}>
                            {dayData.day ? (
                              <Box
                                onClick={() => dayData.leaves.length > 0 && handleDateClick(dayData.date, dayData.leaves)}
                                sx={{
                                  height: 80,
                                  p: 1,
                                  border: "1px solid",
                                  borderColor: dayData.isToday ? "primary.main" : "divider",
                                  borderRadius: 2,
                                  bgcolor: dayData.isWeekend
                                    ? alpha(theme.palette.grey[100], 0.5)
                                    : dayData.leaves.length > 0
                                      ? alpha(theme.palette.primary.main, 0.1)
                                      : "transparent",
                                  cursor: dayData.leaves.length > 0 ? "pointer" : "default",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    boxShadow: dayData.leaves.length > 0 ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
                                    transform: dayData.leaves.length > 0 ? "translateY(-2px)" : "none",
                                  },
                                }}
                              >
                                <Typography variant="body2" fontWeight={dayData.isToday ? "bold" : "normal"}>
                                  {dayData.day}
                                </Typography>
                                {dayData.leaves.length > 0 && (
                                  <Chip
                                    label={dayData.leaves.length}
                                    size="small"
                                    color="primary"
                                    sx={{ height: 16, fontSize: "0.65rem", mt: 0.5 }}
                                  />
                                )}
                              </Box>
                            ) : (
                              <Box sx={{ height: 80 }} />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </GlassCard>

                  {selectedDate && (
                    <Dialog
                      open={Boolean(selectedDate)}
                      onClose={() => setSelectedDate(null)}
                      maxWidth="sm"
                      fullWidth
                      PaperProps={{
                        sx: {
                          borderRadius: 3,
                        },
                      }}
                    >
                      <DialogTitle>
                        <Typography variant="h6" fontWeight="bold">
                          Leaves on {formatDate(selectedDate)}
                        </Typography>
                      </DialogTitle>
                      <DialogContent>
                        <List>
                          {dayLeaves.map((leave, index) => (
                            <ListItem key={index} divider>
                              <ListItemIcon>
                                <StyledAvatar sx={{ width: 32, height: 32 }}>{getInitials(leave.userId)}</StyledAvatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={leave.userId}
                                secondary={`${leave.type} - ${getStatusChip(leave.status)}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setSelectedDate(null)} sx={{ borderRadius: 10 }}>
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}
                </Box>
              </Fade>
            )}

            {/* <CHANGE> Salary view */}
            {activeView === "salary" && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                    Salary Management
                  </Typography>

                  <GlassCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <GenerateSalary />
                    </CardContent>
                  </GlassCard>
                </Box>
              </Fade>
            )}

            {/* <CHANGE> Settings view */}
            {activeView === "settings" && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                    Settings
                  </Typography>

                  <GlassCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        Settings panel will be available soon.
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Box>
              </Fade>
            )}

            {/* <CHANGE> Help view */}
            {activeView === "help" && (
              <Fade in={true} timeout={500}>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                    Help & Support
                  </Typography>

                  <GlassCard>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        Help and support resources will be available soon.
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Box>
              </Fade>
            )}
          </Container>
        </Main>

        {/* <CHANGE> Modern dialogs with animations */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 5,
              overflow: "hidden",
              backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            },
          }}
        >
          <DialogTitle
            sx={{
              py: 2,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "primary.main",
            }}
          >
            <Add /> Add New Employee
          </DialogTitle>
          <DialogContent sx={{ pt: 3, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Leaves"
                  type="number"
                  value={newEmployee.totalLeaves}
                  onChange={(e) => setNewEmployee({ ...newEmployee, totalLeaves: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sick Leave"
                  type="number"
                  value={newEmployee.sickleave}
                  onChange={(e) => setNewEmployee({ ...newEmployee, sickleave: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Casual Leave"
                  type="number"
                  value={newEmployee.casualleave}
                  onChange={(e) => setNewEmployee({ ...newEmployee, casualleave: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medical Leave"
                  type="number"
                  value={newEmployee.medicalleave}
                  onChange={(e) => setNewEmployee({ ...newEmployee, medicalleave: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Work From Home"
                  type="number"
                  value={newEmployee.Workfromhome}
                  onChange={(e) => setNewEmployee({ ...newEmployee, Workfromhome: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newEmployee.role}
                    label="Role"
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
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
                      checked={newEmployee.isTeamLeader}
                      onChange={(e) => setNewEmployee({ ...newEmployee, isTeamLeader: e.target.checked })}
                    />
                  }
                  label="Is Team Leader?"
                />
              </Grid>
              {newEmployee.isTeamLeader && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
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
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 10, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <GradientButton onClick={handleAddEmployee} startIcon={<Add />}>
              Add Employee
            </GradientButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 5,
              overflow: "hidden",
              backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            },
          }}
        >
          <DialogTitle
            sx={{
              py: 2,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "primary.main",
            }}
          >
            <Edit /> Edit Employee
          </DialogTitle>
          <DialogContent sx={{ pt: 3, mt: 2 }}>
            {employeeToEdit && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={employeeToEdit.name}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={employeeToEdit.email}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Leaves"
                    type="number"
                    value={employeeToEdit.totalLeaves}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, totalLeaves: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    type="number"
                    value={employeeToEdit.salary}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, salary: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sick Leave"
                    type="number"
                    value={employeeToEdit.sickleave}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, sickleave: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Casual Leave"
                    type="number"
                    value={employeeToEdit.casualleave}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, casualleave: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Medical Leave"
                    type="number"
                    value={employeeToEdit.medicalleave}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, medicalleave: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Work From Home"
                    type="number"
                    value={employeeToEdit.Workfromhome}
                    onChange={(e) => setEmployeeToEdit({ ...employeeToEdit, Workfromhome: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
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
                    <FormControl fullWidth>
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
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 10, textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <GradientButton onClick={handleUpdateEmployee} startIcon={<Edit />}>
              Update Employee
            </GradientButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Boolean(selectedEmployee)}
          onClose={() => setSelectedEmployee(null)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              {selectedEmployee}'s Leave History
            </Typography>
          </DialogTitle>
          <DialogContent>
            {leaveHistory.length > 0 ? (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
                    Leave Distribution
                  </Typography>
                  <Box sx={{ height: isMobile ? 200 : 300 }}>
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
                <StyledTableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Status</TableCell>
                        {!isMobile && <TableCell>Days Taken</TableCell>}
                        {!isMobile && <TableCell>Reason</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveHistory.map((leave, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{leave.startDate}</TableCell>
                          <TableCell>{leave.endDate}</TableCell>
                          <TableCell>{getStatusChip(leave.status)}</TableCell>
                          {!isMobile && <TableCell>{leave.daysTaken}</TableCell>}
                          {!isMobile && <TableCell>{leave.reason}</TableCell>}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
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
              variant="contained"
              sx={{
                borderRadius: 10,
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

        <Dialog
          open={commentDialogOpen}
          onClose={() => setCommentDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Add Comment for Approval
            </Typography>
          </DialogTitle>
          <DialogContent>
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
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 10 }}
            >
              Cancel
            </Button>
            <GradientButton onClick={handleCommentSubmit} startIcon={<Check />}>
              Approve with Comment
            </GradientButton>
          </DialogActions>
        </Dialog>

        {/* <CHANGE> Modern snackbar notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          TransitionComponent={Grow}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              borderRadius: 10,
              fontWeight: 500,
            }}
            icon={
              snackbar.severity === "success" ? (
                <CheckCircleOutline />
              ) : snackbar.severity === "error" ? (
                <CancelOutlined />
              ) : snackbar.severity === "warning" ? (
                <HourglassEmpty />
              ) : (
                <Info />
              )
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default AdminDashboard