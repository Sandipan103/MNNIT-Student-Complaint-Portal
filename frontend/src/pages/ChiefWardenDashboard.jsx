import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { Context, server } from "../index";
import toast from "react-hot-toast";
import { Button, CircularProgress } from "@mui/material";
import ChiefWardenPendingProblems from "../component/ChiefWardenPendingProblems";
const ChiefWardenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${server}/chiefWardenDashboard`);
        setComplaints(response.data.complaints);
        setHostels(response.data.hostels);
        // console.log(response.data.complaints);
        // console.log(complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
      // }
    };

    fetchComplaints();
  }, []);

  const handleHostelClick = (hostelId) => {
    const filtered = complaints.filter(
      (complaint) => complaint.hostel._id === hostelId
    );
    setFilteredComplaints(filtered);
  };

  return (
    <div className="text-4xl mt-5 mb-5">
      <h1 className="ml-10">Hostel List</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <ul>
          {hostels.map((hostel) => (
            <li key={hostel._id}>
              <Button
                variant="outlined"
                onClick={() => handleHostelClick(hostel._id)}
              >
                {hostel.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <ChiefWardenPendingProblems
        complaints={filteredComplaints}
        setComplaints={setComplaints}
      />
    </div>
  );
};

export default ChiefWardenDashboard;
