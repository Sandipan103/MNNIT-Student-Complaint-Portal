import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";

const LoginChiefWarden = () => {
  const {isAuthenticated,setIsAuthenticated} = useContext(Context);

  const [chiefWardenDetail, setChiefWardenDetail] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setChiefWardenDetail({
      ...chiefWardenDetail,
      [event.target.name]: event.target.value,
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${server}/loginChiefWarden`,
        { email: chiefWardenDetail.email, password: chiefWardenDetail.password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);

      Cookies.set("tokencwf", response.data.tokencw, {
        expires: 1,
      });
      toast.success(`warden logged in`)
    } catch (error) {
        console.log(error)
      console.error("warden login error", error);
    } finally {
      setLoading(false);
    }
  };
  if (isAuthenticated) return <Navigate to={"/chiefWardenDashboard"} />;

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}
        >
          <h1>chief warden Login Page</h1>
          {!loading && (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={chiefWardenDetail.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={chiefWardenDetail.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleTogglePasswordVisibility}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Login
              </Button>
            </form>
          )}

          {loading && <CircularProgress size={100} />}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginChiefWarden;
