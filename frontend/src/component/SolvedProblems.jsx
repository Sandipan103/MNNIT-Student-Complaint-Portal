import React from "react";

const SolvedProblems = ({ complaints }) => {
  return (
    <>
      <h2>Solved Complaints</h2>
      {complaints.map((complaint) => (
        <div key={complaint._id} className="pending-complaint-container">
          <h3>{complaint.title}</h3>
          <div className="complaint-details">
            <p> Category: {complaint.category.categoryType} </p>
            <p> Subcategory: {complaint.category.subCategoryType} </p>
            <p> Time of Complaint: {new Date(complaint.createdAt).toLocaleString()} </p>
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
    </>
  );
};

export default SolvedProblems;
