import React from "react";
import { IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";

const OngoingProblems = ({ complaints, setComplaints }) => {

  const markAsSolved = async (complaintId) => {
    try {
        const response = await axios.post(
          `${server}/markSolved`,
          { complaintId : complaintId, }
        )

        const index = complaints.findIndex(complaint => complaint._id === complaintId);

        // Remove the complaint from the ongoing complaints array
        const updatedOngoingComplaints = [...complaints.slice(0, index), ...complaints.slice(index + 1)];
  
        // Update the state to reflect the changes
        setComplaints(prevState => ({
          ...prevState,
          ongoing: updatedOngoingComplaints,
          solved: [...prevState.solved, complaints[index]]
        }));
      
      toast.success('complaints marked as solved');
    } catch (error) {
      toast.error('something went wrong');
      console.error('Error moving ongoing complaint to solved:', error);
    }
  };

  return (
    <div>
      <h2> Ongoing Complaints </h2>
      {complaints.map((complaint) => (
        <div key={complaint._id} className="pending-complaint-container">
          <h3>{complaint.title}</h3>
          <div className="complaint-details">
            <p> Category: {complaint.category.categoryType} </p>
            <p> Subcategory: {complaint.category.subCategoryType} </p>
            <p>
              Time of Complaint:{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>

          <p>description: {complaint.description}</p>
          <p>Status: {complaint.currentStatus}</p>
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
      ))}
    </div>
  );
};

export default OngoingProblems;
