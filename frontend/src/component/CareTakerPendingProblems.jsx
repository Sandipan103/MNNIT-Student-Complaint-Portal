import React, { useState } from 'react';
import axios from "axios";
import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button, CircularProgress } from "@mui/material";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";

const CareTakerPendingProblems = ({ complaints, setComplaints }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoryType, setFilterCategoryType] = useState('all');
    const [filterSubCategoryType, setFilterSubCategoryType] = useState('all');

    const handleSeenClick = async (complaintId) => {
        try {
            const response = await axios.post(
                `${server}/markOngoing`,
                { complaintId : complaintId, }
              )
            const pendingComplaintIndex = complaints.pending.findIndex(complaint => complaint._id === complaintId);
            if (pendingComplaintIndex !== -1) {
                const pendingComplaint = complaints.pending[pendingComplaintIndex];
                const updatedPendingComplaints = [...complaints.pending.slice(0, pendingComplaintIndex), ...complaints.pending.slice(pendingComplaintIndex + 1)];
                setComplaints(prevState => ({
                    ...prevState,
                    pending: updatedPendingComplaints
                }));
                setComplaints(prevState => ({
                    ...prevState,
                    ongoing: [...prevState.ongoing, pendingComplaint]
                }));
            }
            toast.success('complaints marked ongoing');
        } catch (error) {
            toast.error('something went wrong');
            console.error('Error moving pending complaint to ongoing:', error);
        }
    }

    const filteredComplaints = complaints.pending.filter(complaint => {
        // Filter based on title
        const titleMatch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
        // Filter based on categoryType
        const categoryTypeMatch = !filterCategoryType || filterCategoryType === 'all' || complaint.category.categoryType === filterCategoryType;
        // Filter based on subCategoryType
        const subCategoryTypeMatch = !filterSubCategoryType || filterSubCategoryType === 'all' || complaint.category.subCategoryType === filterSubCategoryType;
        return titleMatch && categoryTypeMatch && subCategoryTypeMatch;
    });

    return (
        <div>
            <Typography variant="h6">CareTaker Pending Problems</Typography>
            <Input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
                value={filterCategoryType}
                onChange={(e) => setFilterCategoryType(e.target.value)}
            >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="common">Common</MenuItem>
            </Select>
            <Select
                value={filterSubCategoryType}
                onChange={(e) => setFilterSubCategoryType(e.target.value)}
            >
                <MenuItem value="all">All Subcategories</MenuItem>
                <MenuItem value="electricity">Electricity</MenuItem>
                <MenuItem value="civil">Civil</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
                <MenuItem value="water">Water</MenuItem>
                <MenuItem value="bathroom">Bathroom</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="other">Other</MenuItem>
            </Select>
            <List>
                {filteredComplaints.map(complaint => (
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
                        <ListItemSecondaryAction>
                            <Button onClick={() => handleSeenClick(complaint._id)}>Seen</Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default CareTakerPendingProblems;
