import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } =
    useContext(Context);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginTypeSelect = (type) => {
    handleClose();
    if (type === "Student") {
      navigate("/login");
    } else if (type === "Caretaker") {
      navigate("/loginCareTaker");
    }
    else if(type==="Warden"){
      navigate("/loginWarden");
    }
    else if(type==="ChiefWarden"){
      navigate("/loginChiefWarden");
    }
  };
  const logoutHandler = async () => {
    setLoading(true);
    try {
      await axios.get(`${server}/logout`, {
        withCredentials: true,
      });
      if (Cookies.get("tokenwf")) {
        Cookies.remove("tokenwf");
      }
      if (Cookies.get("tokencf")) {
        Cookies.remove("tokencf");
      }
      if (Cookies.get("tokencwf")) {
        Cookies.remove("tokencwf");
      }
      Cookies.remove("tokenf");
      toast.success("Logged Out !!!!");
      setIsAuthenticated(false);
      setLoading(false);
      // Redirect to login page after logout
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Problem while Logging out");
      setIsAuthenticated(true);
      setLoading(false);
    }
  };

  return (
    <AppBar position="static"  sx={{ backgroundColor: "#0f1924" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Complain Portal
          </Button>
        </Typography>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          sx={{
            display: { xs: "block", sm: "none" }, // Display on small screens, hide on larger screens
          }}
        >
          <MenuIcon />
        </IconButton>
        
        {Cookies.get("tokencf") ? (
          <Button color="inherit" component={Link} to="/caretakerdashboard">
            Dashboard
          </Button>
        ) : Cookies.get("tokenwf") ? (
          <Button color="inherit" component={Link} to="/wardenDashboard">
            Dashboard
          </Button>
        ) : Cookies.get("tokencwf") ? (
          <Button color="inherit" component={Link} to="/chiefWardenDashboard">
            Dashboard
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
        )}

        {(!Cookies.get("tokencf") && !Cookies.get("tokenwf") && !Cookies.get("tokencwf")) && (
          <>
            <Button color="inherit" component={Link} to="/complaintForm">
              Complaint
            </Button>
            <Button color="inherit" component={Link} to="/feed">
              Feed
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
          </>
        )}
        {isAuthenticated ? (
          <Button disabled={loading} onClick={logoutHandler} color="inherit">
            Logout
          </Button>
        ) : (
          // <Button color="inherit" component={Link} to="/login">
          //   Login
          // </Button>
          <>
            <Button
              color="inherit"
              aria-controls="login-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Login
            </Button>
            <Menu
              id="login-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleLoginTypeSelect("Student")}>
                As student
              </MenuItem>
              <MenuItem onClick={() => handleLoginTypeSelect("Caretaker")}>
                As caretaker
              </MenuItem>
              <MenuItem onClick={() => handleLoginTypeSelect("Warden")}>
                As warden
              </MenuItem>
              <MenuItem onClick={() => handleLoginTypeSelect("ChiefWarden")}>
                As chiefWarden
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
