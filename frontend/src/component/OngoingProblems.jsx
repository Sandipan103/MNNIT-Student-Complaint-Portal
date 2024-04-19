import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { TextField, Button } from "@mui/material";

import axios from "axios";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";

const OngoingProblems = ({ complaints, setComplaints }) => {
  const [sortBy, setSortBy] = useState(null); // State for sorting order (null, 'asc', 'desc')
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State for selected complaint

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    if (sortBy === "asc") setSortBy("desc");
    else if (sortBy === "desc") setSortBy("");
    else setSortBy("asc");
  };

  // Function to filter complaints by search term
  const filterComplaints = (complaints) => {
    return complaints.filter((complaint) =>
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredComplaints = filterComplaints(complaints);

  const markAsSolved = async (complaintId) => {
    try {
      const response = await axios.post(`${server}/markSolved`, {
        complaintId: complaintId,
      });

      const index = complaints.findIndex(
        (complaint) => complaint._id === complaintId
      );

      // Remove the complaint from the ongoing complaints array
      const updatedOngoingComplaints = [
        ...complaints.slice(0, index),
        ...complaints.slice(index + 1),
      ];

      // Update the state to reflect the changes
      setComplaints((prevState) => ({
        ...prevState,
        ongoing: updatedOngoingComplaints,
        solved: [...prevState.solved, complaints[index]],
      }));

      toast.success("complaints marked as solved");
    } catch (error) {
      toast.error("something went wrong");
      console.error("Error moving ongoing complaint to solved:", error);
    }
  };

  return (
    <div className="pending-container">
      <h2> Pending Complaints </h2>
      <div className="search-sort-container" style={{ padding: "10px" }}>
        <TextField
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <Button variant="contained" onClick={toggleSortOrder}>
          Sort by Date
        </Button>
      </div>
      {filteredComplaints.map((complaint) => (
        <div
          key={complaint._id}
          className="pending-complaint-container"
          onClick={() => setSelectedComplaint(complaint)}
        >
          <h3>{complaint.title}</h3>
          <div className="complaint-details">
            <p className="category-status-time">
              Category: {complaint.category.categoryType} | Status:{" "}
              {complaint.currentStatus} | Time of Complaint:{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>
          {selectedComplaint && selectedComplaint._id === complaint._id && (
            <div className="details-overlay">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from propagating to the card
                  setSelectedComplaint(null);
                }}
                className="close-button"
              >
                X
              </button>
              <p> Subcategory: {complaint.category.subCategoryType} </p>
              <p>Description: {complaint.description}</p>
              {complaint.image && (
                <img
                  src={complaint.image}
                  alt="Complaint Image"
                  style={{ maxWidth: "200px" }}
                />
              )}
              <div className="mark-as-solved-button">
                <IconButton
                  onClick={() => markAsSolved(complaint._id)}
                  size="large"
                >
                  <CheckCircleIcon />
                </IconButton>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    // <div>
    //   <h2> Ongoing Complaints </h2>
    //   {complaints.map((complaint) => (
    //     <div key={complaint._id} className="pending-complaint-container">
    //       <h3>{complaint.title}</h3>
    //       <div className="complaint-details">
    //         <p> Category: {complaint.category.categoryType} </p>
    //         <p> Subcategory: {complaint.category.subCategoryType} </p>
    //         <p>
    //           Time of Complaint:{" "}
    //           {new Date(complaint.createdAt).toLocaleString()}
    //         </p>
    //       </div>

    //       <p>description: {complaint.description}</p>
    //       <p>Status: {complaint.currentStatus}</p>
    //       {complaint.image && (
    //         <img
    //           src={complaint.image}
    //           alt="Complaint Image"
    //           style={{ maxWidth: "200px" }}
    //         />
    //       )}
    //       <div className="mark-as-solved-button">
    //         <IconButton
    //           onClick={() => markAsSolved(complaint._id)}
    //           size="large"
    //         >
    //           <CheckCircleIcon />
    //         </IconButton>
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
};

export default OngoingProblems;
