import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "../styles/Dashboard.css";

const SolvedProblems = ({ complaints }) => {
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SolvedProblems;
