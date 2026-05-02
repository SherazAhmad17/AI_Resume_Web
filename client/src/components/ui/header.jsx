import { Avatar, Badge, AppBar, Toolbar, Box, Button, Typography, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/images/logo.png";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserApi } from "../../api/UserApi";

// Move styled components OUTSIDE the main function to prevent re-rendering performance issues
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }
}));

const Header = () => {
  const { isAuth, user, setUser, setAccessToken } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Profile Menu State
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleLogout = async () => {
    try {
      await UserApi.logout();
      setUser(null);
      setAccessToken(null);
      setProfileMenuAnchor(null);
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  const handleProfileMenuToggle = (event) => {
    if (profileMenuAnchor) {
      setProfileMenuAnchor(null);
    } else {
      setProfileMenuAnchor(event.currentTarget);
    }
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  let navLinks = [
    { pageName: "How It Work", path: "/how-it-works" },
    { pageName: "Services", path: "/services" },
    { pageName: "About", path: "/about" },
    { pageName: "Contact Us", path: "/contact-us" },
    { pageName: "Blog", path: "/blog" }
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(180deg, #D1E9FF 0%, #FFFFFF 100%)",
        borderTop: "1px solid #49A1F133",
        borderBottom: "1px solid #49A1F133",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1280px",
          width: "100%",
          mx: "auto",
          minHeight: "80px",
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Logo */}
        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, textDecoration: "none" }}>
          <Box component="img" src={logo} alt="Logo" sx={{ width: 36, height: 36 }} />
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1E3A8A",
              whiteSpace: "nowrap",
            }}
          >
            CurriculumVit.AI
          </Typography>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: { xs: "16px", lg: "28px" },
            flexWrap: "wrap",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {navLinks.map((item) => (
            <Link key={item.pageName} to={item.path} style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1F2937",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  position: "relative",
                  transition: "color 0.3s ease",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0%",
                    height: "2px",
                    bottom: "-4px",
                    left: "0",
                    backgroundColor: "#2563EB",
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                  "&:hover": {
                    color: "#2563EB",
                  },
                }}
              >
                {item.pageName}
              </Typography>
            </Link>
          ))}

          {/* Language Menu */}
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleLanguageClick}>
            <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: "#1F2937", whiteSpace: "nowrap" }}>
              {selectedLanguage}
            </Typography>
            <ArrowDropDownIcon sx={{ color: "#1F2937", fontSize: 20 }} />
          </Box>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLanguageClose} sx={{ "& .MuiPaper-root": { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)", borderRadius: "8px", mt: 1 } }}>
            {["English", "Spanish", "French", "German"].map((lang) => (
              <MenuItem
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                sx={{ fontFamily: "Inter, sans-serif", fontSize: "14px", backgroundColor: selectedLanguage === lang ? "#EFF6FF" : "transparent" }}
              >
                {lang}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Mobile hamburger */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", ml: "auto" }}>
          <IconButton edge="end" color="inherit" aria-label="open navigation" onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: "#1F2937" }} />
          </IconButton>
        </Box>

        {/* Auth (desktop) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {isAuth ? (
            <>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
                padding: '4px 8px 4px 12px',
                borderRadius: '50px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid transparent',
                backgroundColor: Boolean(profileMenuAnchor) ? '#F3F4F6' : 'transparent',
                borderColor: Boolean(profileMenuAnchor) ? '#E5E7EB' : 'transparent',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                  borderColor: '#E5E7EB',
                },
                '&:active': {
                  backgroundColor: '#E5E7EB',
                  transform: 'scale(0.97)'
                }
              }} 
              onClick={handleProfileMenuToggle}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#374151", display: { xs: "none", sm: "block" }, fontFamily: "'Outfit', sans-serif" }}>
                Hi, {user?.name?.split(" ")[0] || "User"}
              </Typography>
              <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                <Avatar 
                  src={user?.profilePicture?.url || ""} 
                  sx={{ 
                    bgcolor: "#2563EB", 
                    width: 36, 
                    height: 36,
                    fontSize: '14px',
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  {!user?.profilePicture?.url && (user?.name ? user.name[0].toUpperCase() : "U")}
                </Avatar>
              </StyledBadge>
            </Box>

              {/* Dropdown Menu when Avatar is clicked */}
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={() => setProfileMenuAnchor(null)}
                sx={{ 
                  mt: 1.5,
                  "& .MuiPaper-root": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    minWidth: "180px",
                    px: 1,
                    py: 1
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={Link} to="/profile" onClick={() => setProfileMenuAnchor(null)} sx={{ borderRadius: "8px", mb: 0.5, gap: 1.5 }}>
                  <PersonIcon fontSize="small" sx={{ color: "#64748B" }} />
                  <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#1E293B" }}>My Profile</Typography>
                </MenuItem>
                <MenuItem component={Link} to="/dashboard" onClick={() => setProfileMenuAnchor(null)} sx={{ borderRadius: "8px", mb: 0.5, gap: 1.5 }}>
                  <DashboardIcon fontSize="small" sx={{ color: "#64748B" }} />
                  <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#1E293B" }}>Dashboard</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ borderRadius: "8px", gap: 1.5 }}>
                  <LogoutIcon fontSize="small" sx={{ color: "#EF4444" }} />
                  <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#EF4444" }}>Log out</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Typography
                component={Link}
                to="/login"
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#2563EB",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  "&:hover": { color: "#1D4ED8" }
                }}
              >
                Log In
              </Typography>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  backgroundColor: "#2563EB",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "none",
                  px: "18px",
                  py: "8px",
                  whiteSpace: "nowrap",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#1D4ED8" },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
        <Box sx={{ width: 260, p: 2 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: "#1E3A8A" }}>
              CurriculumVit.AI
            </Typography>
          </Box>
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.pageName} disablePadding>
                <ListItemText>
                  <Link to={item.path} style={{ textDecoration: "none", color: "#1F2937" }}>
                    {item.pageName}
                  </Link>
                </ListItemText>
              </ListItem>
            ))}

            {/* Optional: Add Auth links to mobile drawer here later if needed */}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;