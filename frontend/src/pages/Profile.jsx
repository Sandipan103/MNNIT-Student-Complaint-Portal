import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { TextField, Button, Avatar, Grid, CircularProgress } from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false); // State variable to indicate backend call loading

  const fetchUserDetail = async() => {
    const token = Cookies.get("tokenf");
    if (token) {
      try {
        setLoading(true); // Set loading to true before making the API call
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(
          `http://localhost:4000/api/v1/getUserProfileById/${userId}`
        );
        setUserData(response.data.user);
        setEditedData(response.data.user);
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false); // Set loading back to false after the API call completes
      }
    }
    else  {
      navigate('/signup');
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("tokenf");
    if (token) {
      try {
        setLoading(true); // Set loading to true before making the API call
        const response = await axios.put(
          `http://localhost:4000/api/v1/updateUserProfileById`,
          {
            userId : userData._id,
            firstName : editedData.firstName,
            lastName : editedData.lastName,
            gender : editedData.gender,
            dateOfBirth : editedData.dateOfBirth,
            contactNo : editedData.contactNo,
            regNo : editedData.regNo,
            hostel : editedData.hostel,
          }
        );
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false); // Set loading back to false after the API call completes
      }
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {loading && <CircularProgress />} {/* Render CircularProgress if loading */}
      {userData && (
        <div>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar alt="Profile Picture" src={userData.image} />
            </Grid>
            <Grid item>
              <TextField
                name="firstName"
                label="First Name"
                value={editedData.firstName || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="lastName"
                label="Last Name"
                value={editedData.lastName || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="email"
                label="Email"
                value={editedData.email || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="gender"
                label="Gender"
                value={editedData.gender || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                value={editedData.dateOfBirth || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="contactNo"
                label="Contact No"
                value={editedData.contactNo || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="regNo"
                label="Reg No"
                value={editedData.regNo || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="hostel"
                label="Hostel"
                value={editedData.hostel || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
