import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { Context, server } from "../index";
import toast from "react-hot-toast";
import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button,CircularProgress, Tabs, Tab, } from "@mui/material";
import CareTakerPendingProblems from '../component/CareTakerPendingProblems';
import CareTakerOngoingProblems from '../component/CareTakerOngoingProblems';
import CareTakerSolvedProblems from '../component/CareTakerSolvedProblems';

const CareTakerDashboard = () => {
  const [complaints, setComplaints] = useState({
    pending: [],
    ongoing: [],
    solved: [],
  });
  const [currentTab, setCurrentTab] = useState("pending");
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokencf");
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const response = await axios.get(`${server}/getAllComplaints/${decodedToken.id}`);
        const pendingComplaints = response.data.complaints.filter(complaint => complaint.currentStatus === 'pending');
        const ongoingComplaints = response.data.complaints.filter(complaint => complaint.currentStatus === 'ongoing');
        const solvedComplaints = response.data.complaints.filter(complaint => complaint.currentStatus === 'solved');
        setComplaints({pending : pendingComplaints, ongoing : ongoingComplaints, solved : solvedComplaints});
        console.log(pendingComplaints);
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


  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div>
      {loading && <CircularProgress />}
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="Pending" value="pending" />
        <Tab label="Ongoing" value="ongoing" />
        <Tab label="Solved" value="solved" />
      </Tabs>

      <div style={{ width: "90%", margin: "0 auto" }}>
        {currentTab === "pending" && (
          <CareTakerPendingProblems complaints = {complaints} setComplaints = {setComplaints} />
        )}
        {currentTab === "ongoing" && (
          <CareTakerOngoingProblems complaints = {complaints} setComplaints = {setComplaints} />
        )}
        {currentTab === "solved" && (
          <CareTakerSolvedProblems complaints = {complaints} setComplaints = {setComplaints} />
        )}
      </div>
    </div>
  );
};

export default CareTakerDashboard;
