import React from "react";
import { IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "../styles/Dashboard.css";

const OngoingProblems = ({ complaints }) => {
  const markAsSolved = async (complaintId) => {
    // Your logic to mark the complaint as solved
    console.log(`Marking complaint with ID ${complaintId} as solved...`);
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
