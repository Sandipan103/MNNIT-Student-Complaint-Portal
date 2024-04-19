import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [categoryType, setCategoryType] = useState("");
  const [subCategoryType, setSubCategoryType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const { isAuthenticated } = useContext(Context);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("tokenf");
    if(!token)  {
      navigate('/signup');
    }
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      
      const response = await axios.post(
        `${server}/createPersonalComplaint`,
        {
          userId : userId,
          categoryType : categoryType,
          subCategoryType : subCategoryType,
          currentStatus:"pending",
          title : title,
          description : description,
          additionalDetails : additionalDetails,
        }
      )
       
      toast.success('complaint raised successfully');
      // console.log("response.data : ", response.data);

      setCategoryType("");
      setSubCategoryType("");
      setTitle("");
      setDescription("");
      setAdditionalDetails("");
    } catch (error) {
      toast.error('Error creating complaint');
      toast.error('you have to update  your profile');
      console.error("Error creating complaint:", error);
    }
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", width: "80%", margin: "0 auto" }}>
      <Typography variant="h5" component="h2" gutterBottom style={{ textAlign: 'center' }}>
        Complaint Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputLabel id="category-label">Category *</InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            labelId="category-label"
            id="category"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            label="Category *"
          >
            <MenuItem value="personal"> Personal Problem </MenuItem>
            <MenuItem value="common"> Common Problem </MenuItem>
          </Select>
        </FormControl>
        {categoryType && (
          <div>
            <InputLabel id="subcategory-label"> Subcategory *</InputLabel>
            <FormControl fullWidth margin="normal">
              {categoryType === "personal" && (
                <Select
                  id="subcategory"
                  value={subCategoryType}
                  onChange={(e) => setSubCategoryType(e.target.value)}
                >
                  <MenuItem value="electricity">Electricity Problem</MenuItem>
                  <MenuItem value="civil">Civil Problem</MenuItem>
                  <MenuItem value="cleaning">Cleaning Problem</MenuItem>
                  <MenuItem value="other">Other Problem</MenuItem>
                </Select>
              )}
              {categoryType === "common" && (
                <Select
                  id="subcategory"
                  value={subCategoryType}
                  onChange={(e) => setSubCategoryType(e.target.value)}
                >
                  <MenuItem value="water">Water Problem</MenuItem>
                  <MenuItem value="bathroom">Bathroom Problem</MenuItem>
                  <MenuItem value="light">Light Problem</MenuItem>
                  <MenuItem value="other">Other Problem</MenuItem>
                </Select>
              )}
            </FormControl>
          </div>
        )}
        <TextField
          fullWidth
          margin="normal"
          id="title"
          label="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          id="description"
          label="Description *"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          id="additional-details"
          label="Additional Details"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
        </Box>
      </form>
      </Paper>
    </Container>
  );
};

export default ComplaintForm;
