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

const LoginCareTaker = () => {
  const {isAuthenticated,setIsAuthenticated} = useContext(Context);

  const [careTakerDetail, setCareTakerDetail] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCareTakerDetail({
      ...careTakerDetail,
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
      const response = await axios.post(`${server}/loginCareTaker`,
        { email: careTakerDetail.email, password: careTakerDetail.password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);

      Cookies.set("tokencf", response.data.tokenc, {
        expires: 1,
      });
      toast.success(`careTaker logged in`)
    } catch (error) {
        console.log(error)
      console.error("careTaker login error", error);
    } finally {
      setLoading(false);
    }
  };
  if (isAuthenticated) return <Navigate to={"/caretakerdashboard"} />;

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
        Care Taker Sign in
      </h1>

      {/* <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
        Sign in to access your account and manage your complaints.
      </p> */}

      <form
        onSubmit={handleSubmit}
        className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
      >
        <p className="text-center text-lg font-medium">
          Sign in to your account
        </p>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="relative">
            <input
              type="email"
              name="email"
              value={careTakerDetail.email}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter email"
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={careTakerDetail.password}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter password"
            />

            <span className="absolute inset-y-0 end-0 grid place-content-center px-4 ">
              <IconButton edge="end" onClick={handleTogglePasswordVisibility}>
                {showPassword ? (
                  <VisibilityIcon className="text-gray-400 size-4" />
                ) : (
                  <VisibilityOffIcon  className="text-gray-400 size-4"  />
                )}
              </IconButton>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg> */}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-gray-500 ">
          No account?
          <a className="ml-2" href="/signup">
            Sign up
          </a>
        </p>
      </form>
    </div>
  </div>
    // <Grid container justifyContent="center" alignItems="center">
    //   <Grid item xs={12} sm={8} md={6} lg={4}>
    //     <Paper
    //       elevation={3}
    //       style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}
    //     >
    //       <h1>CareTaker Login Page</h1>
    //       {!loading && (
    //         <form onSubmit={handleSubmit}>
    //           <TextField
    //             label="Email"
    //             variant="outlined"
    //             type="email"
    //             name="email"
    //             value={careTakerDetail.email}
    //             onChange={handleChange}
    //             fullWidth
    //             margin="normal"
    //           />
    //           <TextField
    //             label="Password"
    //             variant="outlined"
    //             type={showPassword ? "text" : "password"}
    //             name="password"
    //             value={careTakerDetail.password}
    //             onChange={handleChange}
    //             fullWidth
    //             margin="normal"
    //             InputProps={{
    //               endAdornment: (
    //                 <InputAdornment position="end">
    //                   <IconButton
    //                     edge="end"
    //                     onClick={handleTogglePasswordVisibility}
    //                   >
    //                     {showPassword ? (
    //                       <VisibilityIcon />
    //                     ) : (
    //                       <VisibilityOffIcon />
    //                     )}
    //                   </IconButton>
    //                 </InputAdornment>
    //               ),
    //             }}
    //           />
    //           <Button
    //             type="submit"
    //             variant="contained"
    //             color="primary"
    //             fullWidth
    //             style={{ marginTop: "10px" }}
    //           >
    //             Login
    //           </Button>
    //         </form>
    //       )}

    //       {loading && <CircularProgress size={100} />}
    //     </Paper>
    //   </Grid>
    // </Grid>
  );
};

export default LoginCareTaker;
