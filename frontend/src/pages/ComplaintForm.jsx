import React, { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const ComplaintForm = () => {
  const [categoryType, setCategoryType] = useState("");
  const [subcategoryType, setSubcategoryType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // step-1 : validation (no empty field)

    // step-2 : Send complaint data to backend
    console.log({
      categoryType,
      subcategoryType,
      title,
      description,
      additionalDetails,
    });

    // step-3 : Reset form fields
    setCategoryType("");
    setSubcategoryType("");
    setTitle("");
    setDescription("");
    setAdditionalDetails("");
  };

  return (
    <Container maxWidth="sm">
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
                  value={subcategoryType}
                  onChange={(e) => setSubcategoryType(e.target.value)}
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
                  value={subcategoryType}
                  onChange={(e) => setSubcategoryType(e.target.value)}
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
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default ComplaintForm;
