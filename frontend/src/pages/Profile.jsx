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
  Paper,
  Box,
} from "@mui/material";
import { Context, server } from "../index";
import { useContext } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);

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
        const defaultImage = user.image ? user.image : "NULL";
  
        setEditedData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          gender: defaultGender,
          dateOfBirth: defaultDateOfBirth,
          contactNo: defaultContactNo,
          regNo: defaultRegNo,
          roomNo : user.roomNo || "",
          hostelName: defaultHostelName,
          image : defaultImage,
        });
      } catch (error) {
        toast.error('profile data not fetched');
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
    if (name === "contactNo" && !/^\d{0,10}$/.test(value))  {
      toast.error('invalid contact number');
      return;
    }
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  setSelectedFile(file);
  setEditedData((prevData) => ({
    ...prevData,
    image: ``,
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
          roomNo : editedData.roomNo,
        });
        toast.success('profile updated');
      } catch (error) {
        toast.error('profile not updated');
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  if (!isAuthenticated) return <Navigate to={"/login"} />;
  return (
    <div style={{  padding: "20px" }}>
      <Paper
        style={{
          width: "80%",
          margin: "0 auto",
          boxShadow: "0px 3px 6px #00000029",
          padding: "20px",
          // backgroundColor: "beige",
        }}
      >
      {loading && <CircularProgress />}
      
      {userData && (
        <div>
          <Grid container spacing={2} justifyContent="flex-start">
              <Grid item xs={12} md={3} justifyContent={"flex-start"}>
                <Avatar
                  alt="Profile Picture"
                  src={editedData.image}
                  sx={{ width: 100, height: 100 }}
                />
                <input type="file" onChange={handleFileChange} />
              </Grid>
              <br/>
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
                value={editedData.lastName || ""}
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
                disabled
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={editedData.gender || ""}
                  onChange={handleChange}
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}  sm={6}>
              <TextField
                fullWidth
                name="dateOfBirth"
                label="Date of Birth"
                value={editedData.dateOfBirth || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12}  sm={6}>
              <TextField
                fullWidth
                name="contactNo"
                label="Contact No"
                value={editedData.contactNo || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12}  sm={6}>
              <TextField
                fullWidth
                name="regNo"
                label="Reg No"
                value={editedData.regNo || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
            <Grid item xs={12}  sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="roomNo"
                label="Room No"
                value={editedData.roomNo || ""}
                onChange={handleChange}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            Save
          </Button>
          </Box>
        </div>
      )}
      </Paper>
    </div>
  );
};

export default Profile;
