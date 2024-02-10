import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context, server } from "../index.js";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Tabs, Tab, Typography } from "@mui/material";

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
      setComplaints({ pending, ongoing, solved });
      console.log("response :", response);
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
      <h1>Welcome to the Dashboard</h1>
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="Pending" value="pending" />
        <Tab label="Ongoing" value="ongoing" />
        <Tab label="Solved" value="solved" />
      </Tabs>

      {currentTab === "pending" && (
        <>
          <h2>Pending Complaints</h2>
          {complaints.pending.map((complaint) => (
            <div
              key={complaint._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{complaint.title}</h3>
              <p>Category: {complaint.category.categoryType}</p>
              <p>Subcategory: {complaint.category.subCategoryType}</p>
              <p>description: {complaint.description}</p>
              <p>Status: {complaint.currentStatus}</p>
              <p>
                Time of Complaint:{" "}
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
              {complaint.image && (
                <img
                  src={complaint.image}
                  alt="Complaint Image"
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>
          ))}
        </>
      )}

      {currentTab === "ongoing" && (
        <>
          <h2>Ongoing Complaints</h2>
          {complaints.ongoing.map((complaint) => (
            <div
              key={complaint._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{complaint.title}</h3>
              <p>Category: {complaint.category.categoryType}</p>
              <p>Subcategory: {complaint.category.subCategoryType}</p>
              <p>description: {complaint.description}</p>
              <p>Status: {complaint.currentStatus}</p>
              <p>
                Time of Complaint:{" "}
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
              {complaint.image && (
                <img
                  src={complaint.image}
                  alt="Complaint Image"
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>
          ))}
        </>
      )}
      {currentTab === "solved" && (
        <>
          <h2>Solved Complaints</h2>
          {complaints.solved.map((complaint) => (
            <div
              key={complaint._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{complaint.title}</h3>
              <p>Category: {complaint.category.categoryType}</p>
              <p>Subcategory: {complaint.category.subCategoryType}</p>
              <p>description: {complaint.description}</p>
              <p>Status: {complaint.currentStatus}</p>
              <p>
                Time of Complaint:{" "}
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
              {complaint.image && (
                <img
                  src={complaint.image}
                  alt="Complaint Image"
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;
