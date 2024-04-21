import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "../styles/Dashboard.css";


const PendingProblems = ({ complaints }) => {
  const [sortBy, setSortBy] = useState(null); // State for sorting order (null, 'asc', 'desc')
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    if(sortBy === "asc") setSortBy("desc");
    else if(sortBy === "desc")  setSortBy("");
    else  setSortBy("asc");
  };

  // Function to sort complaints by date
  const sortComplaints = (complaints) => {
    if (sortBy === "asc") {
      return complaints
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "desc") {
      return complaints
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return complaints;
  };

  // Function to filter complaints by search term
  const filterComplaints = (complaints) => {
    return complaints.filter((complaint) =>
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortedComplaints = sortComplaints(complaints);
  const filteredComplaints = filterComplaints(sortedComplaints);

  return (
    <div className="pending-container">
      <h2> Pending Complaints </h2>
      <div className="search-sort-container">
        <TextField
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <Button variant="contained" onClick={toggleSortOrder} >
          Sort by Date 
        </Button>
      </div>
      {filteredComplaints.map((complaint) => (
        <div key={complaint._id} className="pending-complaint-container">
          <h3>{complaint.title}</h3>
          <div className="complaint-details">
            <p> Category: {complaint.category.categoryType} </p>
            <p> Subcategory: {complaint.category.subCategoryType} </p>
            <p>
              Time of Complaint:
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
        </div>
      ))}
    </div>
  );
};

export default PendingProblems;
