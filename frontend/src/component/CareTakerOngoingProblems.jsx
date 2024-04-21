import React from 'react'
import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button,CircularProgress, Tabs, Tab, } from "@mui/material";
import "../styles/Dashboard.css";

const CareTakerOngoingProblems = ({complaints, setComplaints}) => {

  return (
    <div className='pending-container'>
        <h2>Ongoing Problems </h2>
        <div className='pending-complaint-container'>
        <List>
        {complaints.ongoing.map(complaint => (
          <ListItem key={complaint._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
            <ListItemText
              primary={complaint.title}
              secondary={complaint.description}
            />
            <ListItemText
              primary={`Category: ${complaint.category.categoryType}`}
              secondary={`Sub-Category: ${complaint.category.subCategoryType}`}
            />
            <ListItemText
              primary={`Created By: ${complaint.createdBy.firstName} ${complaint.createdBy.lastName}`}
              secondary={`Reg No: ${complaint.createdBy.regNo}, Room No: ${complaint.createdBy.roomNo}`}
            />
          </ListItem>
        ))}
      </List>
      </div>
    </div>
  )
}

export default CareTakerOngoingProblems