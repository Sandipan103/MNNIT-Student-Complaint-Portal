import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import {
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Context, server } from "../index";
import { useContext } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false); // State variable to indicate backend call loading

  const { isAuthenticated } = useContext(Context);
  const hostelOptions = [
    "R.N. Tagore Hostel",
    "C.V. Raman Hostel",
    "P.D. Tandon Hostel",
    "M.M. Malviya Hostel",
    "B.G. Tilak Hostel",
    "S.V. Patel Hostel",
    "K.N. Girls Hostel",
    "P.G. Boys Hostel",
    "P.G. Girls Hostel",
  ];

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;
  
        const response = await axios.get(
          `${server}/getUserProfileById/${userId}`
        );
  
        const user = response.data.user;
        console.log("userData : ", user);
        setUserData(user);
  
        const defaultGender = user.gender || ""; 
        const defaultDateOfBirth = user.dateOfBirth || "";
        const defaultContactNo = user.contactNo || ""; 
        const defaultRegNo = user.regNo || ""; 
        const defaultHostelName = user.hostel ? user.hostel.name : ""; 
  
        setEditedData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          gender: defaultGender,
          dateOfBirth: defaultDateOfBirth,
          contactNo: defaultContactNo,
          regNo: defaultRegNo,
          hostelName: defaultHostelName,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("tokenf");
    console.log("editedData : ", editedData);
    if (token) {
      try {
        setLoading(true); 
        const response = await axios.put(`${server}/updateUserProfileById`, {
          userId: userData._id,
          firstName: editedData.firstName,
          lastName: editedData.lastName,
          gender: editedData.gender,
          dateOfBirth: editedData.dateOfBirth,
          contactNo: editedData.contactNo,
          regNo: editedData.regNo,
          hostelName: editedData.hostelName,
        });
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  if (!isAuthenticated) return <Navigate to={"/login"} />;
  return (
    <div style={{ backgroundColor: "beige", color: "white", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "black" }}>Profile Page</h1>
      {loading && <CircularProgress />}
      
      {userData && (
        <div>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Avatar alt="Profile Picture" src={userData.image} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={editedData.firstName || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={userData.lastName || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={userData.email || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="gender"
                label="Gender"
                value={editedData.gender || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="dateOfBirth"
                label="Date of Birth"
                value={editedData.dateOfBirth || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="contactNo"
                label="Contact No"
                value={editedData.contactNo || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="regNo"
                label="Reg No"
                value={editedData.regNo || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="hostelName-label" style={{ color: "white" }}>
                  Hostel
                </InputLabel>
                <Select
                  labelId="hostelName-label"
                  id="hostelName"
                  name="hostelName"
                  value={editedData.hostelName || ""}
                  onChange={handleChange}
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  {hostelOptions.map((hostel, index) => (
                    <MenuItem key={index} value={hostel}>
                      {hostel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
