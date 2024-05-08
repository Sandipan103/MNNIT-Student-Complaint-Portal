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
  const [selectedHostel, setSelectedHostel] = useState(null);
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

  const handleHostelClick = (hostelId, hostelName) => {
    const filtered = complaints.filter(
      (complaint) => complaint.hostel._id === hostelId
    );
    setFilteredComplaints(filtered);
    setSelectedHostel(hostelName);
  };

  return (
    <div className="text-4xl mt-5 mb-5">
      <h1 className="ml-8">Hostels List</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <ul className="flex flex-wrap gap-4 mt-4">
          {hostels.map((hostel) => (
            <li key={hostel._id}>
              <Button
                variant="outlined"
                onClick={() => handleHostelClick(hostel._id, hostel.name)}
              >
                {hostel.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <h1 className=" mt-2 ml-8">
        {selectedHostel ? ` ${selectedHostel} Complaints` : "Select a Hostel "}
      </h1>
      <ChiefWardenPendingProblems
        complaints={filteredComplaints}
        setComplaints={setComplaints}
        selectedHostel = {selectedHostel}
      />
    </div>
  );
};

export default ChiefWardenDashboard;
