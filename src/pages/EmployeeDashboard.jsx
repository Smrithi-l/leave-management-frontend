"use client"

import { useState, useEffect } from "react"
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
  useTheme,
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
} from "@mui/material"
import {
  CalendarMonth,
  CheckCircle,
  Delete,
  Add,
  FilterList,
  Refresh,
  DateRange,
  EventNote,
  SupervisorAccount,
  Person,
  Menu as MenuIcon,
  Dashboard,
  History,
  Settings,
  Notifications,
  Logout,
  ArrowForward,
  ArrowBack,
  CalendarToday,
  HourglassEmpty,
  CheckCircleOutline,
  CancelOutlined,
  Group,
  Info,
  Help,
  Spa,
  Healing,
  Home,
  AccessTime,
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format, differenceInDays } from "date-fns"
import axios from "axios"

// Create a custom theme with a modern, elegant design
const theme = createTheme({
  palette: {
    primary: {
      main: "#6d28d9", // Deep purple
      light: "#8b5cf6",
      dark: "#5b21b6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ec4899", // Pink
      light: "#f472b6",
      dark: "#db2777",
      contrastText: "#ffffff",
    },
    success: {
      main: "#10b981", // Emerald
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b", // Amber
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444", // Red
      light: "#f87171",
      dark: "#dc2626",
    },
    info: {
      main: "#06b6d4", // Cyan
      light: "#22d3ee",
      dark: "#0891b2",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
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
    ...Array(18).fill("none"), // Fill the rest with "none"
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
            background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
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
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.1)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderColor: "rgba(226, 232, 240, 0.8)",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f8fafc",
          color: "#334155",
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
              backgroundColor: "#6d28d9",
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
          borderColor: "rgba(226, 232, 240, 0.8)",
        },
      },
    },
  },
})

// Sidebar width
const DRAWER_WIDTH = 280

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "#ffffff",
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

const CalendarCell = styled(Box)(({ theme, isSelected, hasLeave, leaveStatus, isWeekend }) => ({
  height: 80,
  padding: 1,
  border: "1px solid",
  borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
  borderRadius: 12,
  position: "relative",
  backgroundColor: hasLeave
    ? leaveStatus === "Approved"
      ? alpha(theme.palette.success.main, 0.1)
      : leaveStatus === "Rejected"
        ? alpha(theme.palette.error.main, 0.1)
        : alpha(theme.palette.warning.main, 0.1)
    : isWeekend
      ? alpha(theme.palette.grey[100], 0.5)
      : "transparent",
  transition: "all 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
    borderColor: theme.palette.primary.light,
  },
}))

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

// Custom icon for medical leave
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

const EmployeeDashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // State for sidebar
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)

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
  const [calendarView, setCalendarView] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeView, setActiveView] = useState("dashboard")

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

      const leaveResponse = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/leave-history", {
        headers: { Authorization: `Bearer ${token}` },
      })

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

      const leaveResponse = await axios.get("https://leave-management-backend-sa2e.onrender.com/api/dashboard/leave-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setCalendarView(newValue === 1)
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
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 16 }}>
              <Typography variant="body1" color="text.secondary">
                No leave requests found
              </Typography>
            </Paper>
          ) : (
            leaveHistory
              .filter((leave) => filter === "All" || leave.status === filter)
              .map((leave, index) => (
                <Grow in={true} key={leave._id || index} timeout={(index + 1) * 200}>
                  <GlassCard sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor:
                                leave.type === "Casual"
                                  ? "primary.main"
                                  : leave.type === "Sick"
                                    ? "error.main"
                                    : leave.type === "Medical"
                                      ? "info.main"
                                      : "secondary.main",
                              width: 36,
                              height: 36,
                            }}
                          >
                            <LeaveTypeIcon type={leave.type} fontSize="small" />
                          </Avatar>
                          <Typography variant="subtitle1" fontWeight="600">
                            {leave.type}
                          </Typography>
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
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                              Start Date
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarToday fontSize="small" color="primary" />
                              <Typography variant="body2" fontWeight="medium">
                                {format(new Date(leave.startDate), "MMM dd, yyyy")}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                              End Date
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarToday fontSize="small" color="primary" />
                              <Typography variant="body2" fontWeight="medium">
                                {format(new Date(leave.endDate), "MMM dd, yyyy")}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                          Duration
                        </Typography>
                        <Chip
                          label={`${differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: "medium" }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                          Reason
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.grey[100], 0.5),
                            fontStyle: "italic",
                          }}
                        >
                          "{leave.reason}"
                        </Typography>
                      </Box>

                      {leave.status === "Pending" && (
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                          <GradientButton
                            startIcon={<Delete />}
                            color="error"
                            size="small"
                            onClick={() => handleDeleteLeave(leave._id)}
                          >
                            Delete Request
                          </GradientButton>
                        </Box>
                      )}
                    </CardContent>
                  </GlassCard>
                </Grow>
              ))
          )}
        </Box>
      )
    }

    return (
      <Fade in={true} timeout={500}>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
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
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor:
                                leave.type === "Casual"
                                  ? "primary.main"
                                  : leave.type === "Sick"
                                    ? "error.main"
                                    : leave.type === "Medical"
                                      ? "info.main"
                                      : "secondary.main",
                              width: 30,
                              height: 30,
                              fontSize: "0.75rem",
                            }}
                          >
                            <LeaveTypeIcon type={leave.type} fontSize="small" />
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {leave.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarToday fontSize="small" color="primary" />
                          <Typography variant="body2">{format(new Date(leave.startDate), "MMM dd, yyyy")}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarToday fontSize="small" color="primary" />
                          <Typography variant="body2">{format(new Date(leave.endDate), "MMM dd, yyyy")}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: "medium" }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      >
                        <Tooltip title={leave.reason} placement="top">
                          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                            "{leave.reason}"
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{getStatusChip(leave.status)}</TableCell>
                      <TableCell align="center">
                        {leave.status === "Pending" ? (
                          <Tooltip title="Delete request">
                            <AnimatedIconButton color="error" size="small" onClick={() => handleDeleteLeave(leave._id)}>
                              <Delete />
                            </AnimatedIconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="View details">
                            <AnimatedIconButton color="primary" size="small">
                              <Info />
                            </AnimatedIconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Fade>
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
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 16 }}>
              <Typography variant="body1" color="text.secondary">
                No leave requests found
              </Typography>
            </Paper>
          ) : (
            leaveRequests.map((leave, index) => (
              <Grow in={true} key={leave._id} timeout={(index + 1) * 200}>
                <GlassCard sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StyledAvatar>
                          {leave.employeeName ? leave.employeeName.charAt(0).toUpperCase() : "U"}
                        </StyledAvatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            {leave.employeeName || "Employee"}
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
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                            From
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="medium">
                              {format(new Date(leave.startDate), "MMM dd, yyyy")}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                            To
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="medium">
                              {format(new Date(leave.endDate), "MMM dd, yyyy")}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                        Duration
                      </Typography>
                      <Chip
                        label={`${differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: "medium" }}
                      />
                    </Box>

                    {leave.status === "Pending" && (
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
                        <GradientButton
                          color="success"
                          fullWidth
                          size="small"
                          onClick={() => handleLeaveAction(leave._id, "Approved")}
                        >
                          Approve
                        </GradientButton>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          size="small"
                          onClick={() => handleLeaveAction(leave._id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </GlassCard>
              </Grow>
            ))
          )}
        </Box>
      )
    }

    return (
      <Fade in={true} timeout={500}>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No leave requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leaveRequests.map((leave) => (
                  <TableRow key={leave._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StyledAvatar sx={{ width: 32, height: 32 }}>
                          {leave.userId ? leave.userId.charAt(0).toUpperCase() : "U"}
                        </StyledAvatar>
                        <Typography variant="body2" fontWeight="medium">
                          {leave.userId || "Employee"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<LeaveTypeIcon type={leave.type} fontSize="small" />}
                        label={leave.type}
                        size="small"
                        color={
                          leave.type === "Casual"
                            ? "primary"
                            : leave.type === "Sick"
                              ? "error"
                              : leave.type === "Medical"
                                ? "info"
                                : "secondary"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{format(new Date(leave.startDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(leave.endDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${differenceInDays(new Date(leave.endDate), new Date(leave.startDate)) + 1} days`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: "medium" }}
                      />
                    </TableCell>
                    <TableCell>{getStatusChip(leave.status)}</TableCell>
                    <TableCell align="center">
                      {leave.status === "Pending" && (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <GradientButton
                            color="success"
                            size="small"
                            onClick={() => handleLeaveAction(leave._id, "Approved")}
                          >
                            Approve
                          </GradientButton>
                          <Button
                            variant="outlined"
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
        </StyledTableContainer>
      </Fade>
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
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 16 }}>
              <Typography variant="body1" color="text.secondary">
                No team members found
              </Typography>
            </Paper>
          ) : (
            teamMembers.map((member, index) => (
              <Grow in={true} key={member._id} timeout={(index + 1) * 200}>
                <GlassCard sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <StyledAvatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
                        {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                      </StyledAvatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.email}
                        </Typography>
                        <Chip
                          label={member.position || "Employee"}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 1, fontWeight: "medium" }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Grow>
            ))
          )}
        </Box>
      )
    }

    return (
      <Fade in={true} timeout={500}>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : teamMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No team members found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                teamMembers.map((member) => (
                  <TableRow key={member._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <StyledAvatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                          {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                        </StyledAvatar>
                        <Typography variant="body2" fontWeight="medium">
                          {member.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Chip label={member.position || "Employee"} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label="Active"
                        size="small"
                        color="success"
                        variant="outlined"
                        icon={<CheckCircle fontSize="small" />}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Fade>
    )
  }

  // Calendar view for leave visualization
  const renderCalendarView = () => {
    // Generate days for the current month
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null) // Empty cells for days before the 1st of the month
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
    }

    // Function to check if a date has a leave
    const getLeaveForDate = (date) => {
      return leaveHistory.find((leave) => {
        const startDate = new Date(leave.startDate)
        const endDate = new Date(leave.endDate)
        return date >= startDate && date <= endDate
      })
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            Previous
          </Button>

          <Typography variant="h6" fontWeight="bold">
            {format(currentMonth, "MMMM yyyy")}
          </Typography>

          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            Next
          </Button>
        </Box>

        <GlassCard>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={1}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Grid item xs={12 / 7} key={day}>
                  <Box
                    sx={{
                      p: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      color: day === "Sun" || day === "Sat" ? "error.main" : "text.primary",
                    }}
                  >
                    {day}
                  </Box>
                </Grid>
              ))}

              {days.map((day, index) => {
                if (!day) {
                  return (
                    <Grid item xs={12 / 7} key={`empty-${index}`}>
                      <Box
                        sx={{
                          height: 80,
                          p: 1,
                          bgcolor: alpha(theme.palette.grey[100], 0.3),
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                  )
                }

                const leave = getLeaveForDate(day)
                const isWeekendDay = day.getDay() === 0 || day.getDay() === 6
                const isSelected =
                  selectedDate &&
                  day.getDate() === selectedDate.getDate() &&
                  day.getMonth() === selectedDate.getMonth() &&
                  day.getFullYear() === selectedDate.getFullYear()

                return (
                  <Grid item xs={12 / 7} key={day.getDate()}>
                    <CalendarCell
                      isSelected={isSelected}
                      hasLeave={!!leave}
                      leaveStatus={leave?.status}
                      isWeekend={isWeekendDay}
                      onClick={() => setSelectedDate(day)}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 8,
                          fontWeight: isSelected ? 800 : 600,
                          color: isWeekendDay ? "error.main" : isSelected ? "primary.main" : "text.primary",
                        }}
                      >
                        {day.getDate()}
                      </Typography>

                      {leave && (
                        <Tooltip title={`${leave.type} - ${leave.status}`}>
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 5,
                              left: 5,
                              right: 5,
                              p: 0.5,
                              borderRadius: 8,
                              bgcolor:
                                leave.status === "Approved"
                                  ? "success.main"
                                  : leave.status === "Rejected"
                                    ? "error.main"
                                    : "warning.main",
                              color: "#fff",
                              fontSize: "0.7rem",
                              textAlign: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                            }}
                          >
                            <LeaveTypeIcon type={leave.type} fontSize="inherit" />
                            {leave.type}
                          </Box>
                        </Tooltip>
                      )}
                    </CalendarCell>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </GlassCard>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: 8, bgcolor: theme.palette.success.main }} />
            <Typography variant="body2">Approved</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: 8, bgcolor: theme.palette.warning.main }} />
            <Typography variant="body2">Pending</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: 8, bgcolor: theme.palette.error.main }} />
            <Typography variant="body2">Rejected</Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  // Sidebar content
  const sidebarContent = (
    <Box sx={{ width: DRAWER_WIDTH }}>
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonth color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Leave Management
          </Typography>
        </Box>
      </DrawerHeader>

      <Divider sx={{ mb: 2 }} />

      <List>
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
          selected={activeView === "leaveHistory"}
          onClick={() => {
            setActiveView("leaveHistory")
            if (isMobile) setDrawerOpen(false)
          }}
        >
          <ListItemIcon>
            <History color={activeView === "leaveHistory" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Leave History" />
        </ListItemButton>

        <ListItemButton
          selected={activeView === "calendar"}
          onClick={() => {
            setActiveView("calendar")
            if (isMobile) setDrawerOpen(false)
            setTabValue(1)
          }}
        >
          <ListItemIcon>
            <CalendarMonth color={activeView === "calendar" ? "primary" : "inherit"} />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItemButton>

        {isTeamLead && (
          <>
            <ListItemButton
              selected={activeView === "teamMembers"}
              onClick={() => {
                setActiveView("teamMembers")
                if (isMobile) setDrawerOpen(false)
                fetchTeamData()
              }}
            >
              <ListItemIcon>
                <Group color={activeView === "teamMembers" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Team Members" />
            </ListItemButton>

            <ListItemButton
              selected={activeView === "teamRequests"}
              onClick={() => {
                setActiveView("teamRequests")
                if (isMobile) setDrawerOpen(false)
                fetchTeamData()
              }}
            >
              <ListItemIcon>
                <EventNote color={activeView === "teamRequests" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Team Requests" />
            </ListItemButton>
          </>
        )}

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
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          {/* App Bar */}
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

              {isTeamLead ? (
                <SupervisorAccount sx={{ mr: 2, display: { xs: "none", sm: "block" }, color: "primary.main" }} />
              ) : (
                <Person sx={{ mr: 2, display: { xs: "none", sm: "block" }, color: "primary.main" }} />
              )}

              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.25rem" }, fontWeight: 600 }}
              >
                {activeView === "dashboard"
                  ? isTeamLead
                    ? "Team Lead Dashboard"
                    : "Employee Dashboard"
                  : activeView === "leaveHistory"
                    ? "Leave History"
                    : activeView === "calendar"
                      ? "Leave Calendar"
                      : activeView === "teamMembers"
                        ? "Team Members"
                        : activeView === "teamRequests"
                          ? "Team Leave Requests"
                          : activeView === "settings"
                            ? "Settings"
                            : activeView === "help"
                              ? "Help & Support"
                              : "Dashboard"}
              </Typography>

              <StyledBadge badgeContent={pendingLeaves} color="error" sx={{ mr: 2 }}>
                <AnimatedIconButton color="primary">
                  <Notifications />
                </AnimatedIconButton>
              </StyledBadge>

              <AnimatedIconButton
                color="primary"
                onClick={() => setOpen(true)}
                sx={{ display: { xs: "flex", sm: "none" } }}
              >
                <Add />
              </AnimatedIconButton>
            </Toolbar>
          </StyledAppBar>

          {/* Fixed Sidebar for desktop, SwipeableDrawer for mobile */}
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

          {/* Main Content */}
          <Main open={drawerOpen && !isMobile}>
            <DrawerHeader />
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 4 }}>
              {/* Dashboard View */}
              {activeView === "dashboard" && (
                <>
                  {/* Team Lead Section - Only visible to team leads */}
                  {isTeamLead && (
                    <Fade in={true} timeout={800}>
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                          Team Overview
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                          <Grid item xs={12} sm={6}>
                            <GlassCard>
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                    <Group />
                                  </Avatar>
                                  <Typography variant="h6">Team Members</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color="primary.main">
                                  {teamMembers.length}
                                </Typography>
                                <Button
                                  variant="text"
                                  color="primary"
                                  endIcon={<ArrowForward />}
                                  onClick={() => setActiveView("teamMembers")}
                                  sx={{ mt: 2 }}
                                >
                                  View All
                                </Button>
                              </CardContent>
                            </GlassCard>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <GlassCard>
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                  <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                                    <HourglassEmpty />
                                  </Avatar>
                                  <Typography variant="h6">Pending Requests</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color="warning.main">
                                  {leaveRequests.filter((req) => req.status === "Pending").length}
                                </Typography>
                                <Button
                                  variant="text"
                                  color="primary"
                                  endIcon={<ArrowForward />}
                                  onClick={() => setActiveView("teamRequests")}
                                  sx={{ mt: 2 }}
                                >
                                  View All
                                </Button>
                              </CardContent>
                            </GlassCard>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />
                      </Box>
                    </Fade>
                  )}

                  {/* Personal Dashboard - Visible to all users */}
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
                          My Dashboard
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Welcome back! Here's an overview of your leave status
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <GradientButton
                          startIcon={<Add />}
                          onClick={() => setOpen(true)}
                          sx={{ display: { xs: "none", sm: "flex" } }}
                        >
                          Apply for Leave
                        </GradientButton>
                        <GradientButton
                          onClick={() => setOpen(true)}
                          sx={{
                            display: { xs: "flex", sm: "none" },
                            minWidth: 0,
                            width: 40,
                            height: 40,
                            p: 0,
                          }}
                        >
                          <Add />
                        </GradientButton>
                        <Tooltip title="Refresh data">
                          <AnimatedIconButton
                            onClick={fetchLeaveHistory}
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

                  {/* Stats Cards */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Leave Balance Card */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                        <StatCard accentColor={theme.palette.primary.main}>
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                            >
                              <Box>
                                <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                                  {leaveBalance.total}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 0.5 }}>
                                  Leave Balance
                                </Typography>
                              </Box>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  width: 56,
                                  height: 56,
                                }}
                              >
                                <CalendarMonth sx={{ fontSize: 28 }} />
                              </Avatar>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      bgcolor: "primary.main",
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    Casual:{" "}
                                    <Box component="span" fontWeight="medium">
                                      {leaveBalance.casual}
                                    </Box>
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      bgcolor: "error.main",
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    Sick:{" "}
                                    <Box component="span" fontWeight="medium">
                                      {leaveBalance.sick}
                                    </Box>
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      bgcolor: "info.main",
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    Medical:{" "}
                                    <Box component="span" fontWeight="medium">
                                      {leaveBalance.medical}
                                    </Box>
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      bgcolor: "secondary.main",
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    WFH:{" "}
                                    <Box component="span" fontWeight="medium">
                                      {leaveBalance.Workfromhome}
                                    </Box>
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </StatCard>
                      </Zoom>
                    </Grid>

                    {/* Pending Requests Card */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                        <StatCard accentColor={theme.palette.warning.main}>
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                            >
                              <Box>
                                <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                                  {pendingLeaves}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 0.5 }}>
                                  Pending Requests
                                </Typography>
                              </Box>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                  color: theme.palette.warning.main,
                                  width: 56,
                                  height: 56,
                                }}
                              >
                                <HourglassEmpty sx={{ fontSize: 28 }} />
                              </Avatar>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                              <Box sx={{ flexGrow: 1, mr: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    Math.min(
                                      (pendingLeaves / (pendingLeaves + approvedLeaves + rejectedLeaves)) * 100,
                                      100,
                                    ) || 0
                                  }
                                  color="warning"
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                Awaiting approval
                              </Typography>
                            </Box>
                          </CardContent>
                        </StatCard>
                      </Zoom>
                    </Grid>

                    {/* Approved Leaves Card */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Zoom in={true} style={{ transitionDelay: "300ms" }}>
                        <StatCard accentColor={theme.palette.success.main}>
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                            >
                              <Box>
                                <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                                  {approvedLeaves}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 0.5 }}>
                                  Approved Leaves
                                </Typography>
                              </Box>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  color: theme.palette.success.main,
                                  width: 56,
                                  height: 56,
                                }}
                              >
                                <CheckCircleOutline sx={{ fontSize: 28 }} />
                              </Avatar>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <DateRange sx={{ color: "success.main", fontSize: 20, mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Total days:
                                </Typography>
                              </Box>
                              <Chip
                                label={totalDaysTaken}
                                size="small"
                                color="success"
                                variant="filled"
                                sx={{ fontWeight: "medium" }}
                              />
                            </Box>
                          </CardContent>
                        </StatCard>
                      </Zoom>
                    </Grid>

                    {/* Rejected Requests Card */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Zoom in={true} style={{ transitionDelay: "400ms" }}>
                        <StatCard accentColor={theme.palette.error.main}>
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                            >
                              <Box>
                                <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                                  {rejectedLeaves}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 0.5 }}>
                                  Rejected Requests
                                </Typography>
                              </Box>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  color: theme.palette.error.main,
                                  width: 56,
                                  height: 56,
                                }}
                              >
                                <CancelOutlined sx={{ fontSize: 28 }} />
                              </Avatar>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                              <Box sx={{ flexGrow: 1, mr: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    Math.min(
                                      (rejectedLeaves / (pendingLeaves + approvedLeaves + rejectedLeaves)) * 100,
                                      100,
                                    ) || 0
                                  }
                                  color="error"
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                Review and reapply
                              </Typography>
                            </Box>
                          </CardContent>
                        </StatCard>
                      </Zoom>
                    </Grid>
                  </Grid>

                  {/* Tabs */}
                  <Fade in={true} timeout={800}>
                    <GlassCard sx={{ mb: 4, overflow: "hidden" }}>
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant={isMobile ? "fullWidth" : "standard"}
                        sx={{
                          borderBottom: 1,
                          borderColor: "divider",
                          "& .MuiTab-root": {
                            fontWeight: 600,
                            py: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                            },
                          },
                        }}
                      >
                        <Tab
                          icon={<FilterList />}
                          label={isMobile ? "REQUESTS" : "LEAVE REQUESTS"}
                          iconPosition="start"
                        />
                        <Tab
                          icon={<EventNote />}
                          label={isMobile ? "CALENDAR" : "LEAVE CALENDAR"}
                          iconPosition="start"
                        />
                      </Tabs>

                      {/* Tab Content */}
                      <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        {tabValue === 0 && (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mb: 3,
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 1,
                              }}
                            >
                              <FormControl
                                variant="outlined"
                                size="small"
                                sx={{
                                  minWidth: { xs: "100%", sm: 200 },
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 10,
                                  },
                                }}
                              >
                                <InputLabel id="filter-label">Filter by Status</InputLabel>
                                <Select
                                  labelId="filter-label"
                                  value={filter}
                                  onChange={(e) => setFilter(e.target.value)}
                                  label="Filter by Status"
                                  startAdornment={<FilterList sx={{ mr: 1, color: "primary.main" }} />}
                                >
                                  <MenuItem value="All">All Requests</MenuItem>
                                  <MenuItem value="Pending">Pending</MenuItem>
                                  <MenuItem value="Approved">Approved</MenuItem>
                                  <MenuItem value="Rejected">Rejected</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>

                            {renderLeaveHistoryTable()}
                          </>
                        )}

                        {tabValue === 1 && renderCalendarView()}
                      </Box>
                    </GlassCard>
                  </Fade>
                </>
              )}

              {/* Leave History View */}
              {activeView === "leaveHistory" && (
                <Fade in={true} timeout={500}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                      <Typography variant="h4" component="h1" fontWeight="bold">
                        Leave History
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormControl
                          variant="outlined"
                          size="small"
                          sx={{
                            minWidth: { xs: "100%", sm: 200 },
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 10,
                            },
                          }}
                        >
                          <InputLabel id="filter-label">Filter by Status</InputLabel>
                          <Select
                            labelId="filter-label"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            label="Filter by Status"
                            startAdornment={<FilterList sx={{ mr: 1, color: "primary.main" }} />}
                          >
                            <MenuItem value="All">All Requests</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                        <Tooltip title="Refresh data">
                          <AnimatedIconButton
                            onClick={fetchLeaveHistory}
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
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>{renderLeaveHistoryTable()}</CardContent>
                    </GlassCard>
                  </Box>
                </Fade>
              )}

              {/* Calendar View */}
              {activeView === "calendar" && (
                <Fade in={true} timeout={500}>
                  <Box>
                    <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
                      Leave Calendar
                    </Typography>

                    <GlassCard>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>{renderCalendarView()}</CardContent>
                    </GlassCard>
                  </Box>
                </Fade>
              )}

              {/* Team Members View */}
              {activeView === "teamMembers" && (
                <Fade in={true} timeout={500}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                      <Typography variant="h4" component="h1" fontWeight="bold">
                        Team Members
                      </Typography>
                      <Tooltip title="Refresh team data">
                        <AnimatedIconButton onClick={fetchTeamData} color="primary">
                          <Refresh />
                        </AnimatedIconButton>
                      </Tooltip>
                    </Box>

                    <GlassCard>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>{renderTeamMembersTable()}</CardContent>
                    </GlassCard>
                  </Box>
                </Fade>
              )}

              {/* Team Requests View */}
              {activeView === "teamRequests" && (
                <Fade in={true} timeout={500}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                      <Typography variant="h4" component="h1" fontWeight="bold">
                        Team Leave Requests
                      </Typography>
                      <Tooltip title="Refresh team data">
                        <AnimatedIconButton onClick={fetchTeamData} color="primary">
                          <Refresh />
                        </AnimatedIconButton>
                      </Tooltip>
                    </Box>

                    <GlassCard>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>{renderTeamLeaveRequestsTable()}</CardContent>
                    </GlassCard>
                  </Box>
                </Fade>
              )}

              {/* Settings View */}
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

              {/* Help & Support View */}
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

              {/* Apply Leave Dialog */}
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                  sx: {
                    borderRadius: isMobile ? 0:5,
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
                  <Add /> Apply for Leave
                </DialogTitle>
                <DialogContent sx={{ pt: 3, mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={formErrors.type}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10 } }}
                      >
                        <InputLabel id="leave-type-label">Leave Type</InputLabel>
                        <Select
                          labelId="leave-type-label"
                          value={leaveData.type}
                          onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}
                          label="Leave Type"
                        >
                          <MenuItem value="casualleave">Casual Leave</MenuItem>
                          <MenuItem value="sickleave">Sick Leave</MenuItem>
                          <MenuItem value="medicalleave">Medical Leave</MenuItem>
                          <MenuItem value="workfromhome">Work from Home</MenuItem>
                        </Select>
                        {formErrors.type && <FormHelperText>Please select a leave type</FormHelperText>}
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
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10 } }}
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
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10 } }}
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
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 10 } }}
                      />
                    </Grid>

                    {leaveData.startDate && leaveData.endDate && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 10,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px dashed ${theme.palette.primary.main}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <DateRange color="primary" />
                          <Typography variant="body1" color="primary.main" fontWeight="medium">
                            Duration:{" "}
                            <strong>{differenceInDays(leaveData.endDate, leaveData.startDate) + 1} days</strong>
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                  <Button
                    onClick={() => setOpen(false)}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 10, textTransform: "none", fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
                  <GradientButton
                    onClick={handleApplyLeave}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </GradientButton>
                </DialogActions>
              </Dialog>

              {/* Snackbar for notifications */}
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
            </Container>
          </Main>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default EmployeeDashboard

