import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context, server } from "../index.js";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Tabs, Tab, Typography } from "@mui/material";
import PendingProblems from "../component/PendingProblems.jsx";
import OngoingProblems from "../component/OngoingProblems.jsx";
import SolvedProblems from "../component/SolvedProblems.jsx";

const Dashboard = () => {
  const { isAuthenticated } = useContext(Context);
  const [currentTab, setCurrentTab] = useState("pending");
  const [complaints, setComplaints] = useState({
    pending: [],
    ongoing: [],
    solved: [],
  });

  const fetchData = async () => {
    const token = Cookies.get("tokenf");
    if (!token) {
      toast.error("please login first");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      const { id: userId } = decodedToken;
      const response = await axios.get(`${server}/getMyComplaints/${userId}`);
      const { pending, ongoing, solved } = response.data.complaints;
      const personalPending = pending.filter(complaint => complaint.category.categoryType === 'personal');
      const personalOngoing = ongoing.filter(complaint => complaint.category.categoryType === 'personal');
      const personalSolved = solved.filter(complaint => complaint.category.categoryType === 'personal');

      setComplaints({ pending: personalPending, ongoing: personalOngoing, solved: personalSolved });
      console.log("response :", response.data.complaints);
      // console.log('response.pending :' , response.data.complaints.pending);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginLeft: '20px', margin:'20px' }}>Your Dashboard</h1>
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="Pending" value="pending" />
        <Tab label="Ongoing" value="ongoing" />
        <Tab label="Solved" value="solved" />
      </Tabs>

      <div style={{ width: "90%", margin: "0 auto" }}>
        {currentTab === "pending" && (
          <PendingProblems complaints={complaints.pending} />
        )}
        {currentTab === "ongoing" && (
          <OngoingProblems complaints={complaints.ongoing} setComplaints={setComplaints}/>
        )}
        {currentTab === "solved" && (
          <SolvedProblems complaints={complaints.solved} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
