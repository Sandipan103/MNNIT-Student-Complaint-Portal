import React, { useState } from 'react';
import axios from "axios";
import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button, CircularProgress } from "@mui/material";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';
import "../styles/CareTakerDashBoard.css";

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

    const handleDownloadExcel = () => {
        // console.log(filteredComplaints);
        const downloadComplaints = filteredComplaints.map(complaint => ({
            title: complaint.title,
            description: complaint.description,
            categoryType: complaint.category.categoryType,
            subcategoryType: complaint.category.subCategoryType,
            createdBy: `${complaint.createdBy.firstName} ${complaint.createdBy.lastName}`,
            roomNo: complaint.createdBy.roomNo,
            contactNo: complaint.createdBy.contactNo,
            createdAt: complaint.createdAt,
            upvoteCount: complaint.upvotes.length,
            cost : "",
        }));
        // console.log(downloadComplaints);
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Convert data to worksheet
        const ws = XLSX.utils.json_to_sheet(downloadComplaints);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "Pending Complaints");

        // Generate the Excel file and trigger the download
        XLSX.writeFile(wb, "pending_complaints.xlsx");
    }

    return (
        <div>
            <h2 variant="h6">Pending Problems</h2>
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
            <Button onClick={handleDownloadExcel}>Download Excel</Button>
            <List>
                {filteredComplaints.map(complaint => (
                    <ListItem key={complaint._id} className="list-item-container">
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
