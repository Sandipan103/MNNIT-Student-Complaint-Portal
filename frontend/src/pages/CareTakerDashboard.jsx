import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { Context, server } from "../index";
import toast from "react-hot-toast";
import {
  Typography,
  Input,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
} from "@mui/material";

const CareTakerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokencf");
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const response = await axios.get(`${server}/getAllComplaints/${decodedToken.id}`);
        setComplaints(response.data.complaints);
      } catch (error) {
        toast.error('complaint not fetched');
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleSeenClick = async (complaintId) => {
    try {
      await axios.put(`/api/complaints/${complaintId}/seen`);
    } catch (error) {
      console.error('Error marking complaint as seen:', error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (!filterType || filterType === 'all') {
      return true;
    }
    return complaint.category.categoryType === filterType;
  }).filter(complaint => complaint.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="personal">Personal</MenuItem>
        <MenuItem value="common">Common</MenuItem>
      </Select>
      {loading && <CircularProgress />}
      <List>
        {filteredComplaints.map(complaint => (
          <ListItem key={complaint._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
            <ListItemText
              primary={complaint.title}
              secondary={complaint.description}
            />
            <ListItemText
              primary={`Category: ${complaint.category.categoryType}`}
              secondary={`Sub-Category: ${complaint.category.subCategoryType}`}
            />
            <ListItemText
              primary={`Created By: ${complaint.createdBy.firstName} ${complaint.createdBy.lastName}`}
              secondary={`Reg No: ${complaint.createdBy.regNo}, Room No: ${complaint.createdBy.roomNo}`}
            />
            <ListItemSecondaryAction>
              <Button onClick={() => handleSeenClick(complaint._id)}>Seen</Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CareTakerDashboard;
