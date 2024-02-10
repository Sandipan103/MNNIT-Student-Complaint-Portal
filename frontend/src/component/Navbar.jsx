import React, { useContext, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, loading, setLoading } = useContext(Context);
  const navigate = useNavigate();
  const logoutHandler = async () => {
    setLoading(true);
    try {
      await axios.get(`${server}/logout`, {
        withCredentials: true,
      });
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
    <AppBar position="static">
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
        {/* <Button color="inherit" component={Link} to="/">Home</Button> */}
        <Button color="inherit" component={Link} to="/complaintForm">
          Complaint
        </Button>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Profile
        </Button>
        {isAuthenticated ? (
          <Button disabled={loading} onClick={logoutHandler} color="inherit">
            Logout
          </Button>
        ) : (
          <Button color="inherit"  component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
