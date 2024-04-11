import React from 'react'
import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button,CircularProgress, Tabs, Tab, } from "@mui/material";

const CareTakerSolvedProblems = ({complaints, setComplaints}) => {

  return (
    <div>
        <h2> CareTakerSolvedProblems </h2>
        <List>
        {complaints.solved.map(complaint => (
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
  )
}

export default CareTakerSolvedProblems