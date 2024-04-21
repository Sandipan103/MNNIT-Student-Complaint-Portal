import React, { useState } from 'react';
import axios from "axios";
import { Context, server } from "../index.js";
import { Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button } from "@mui/material";
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
                { complaintId: complaintId }
            );
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
            toast.success('Complaint marked ongoing');
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error moving pending complaint to ongoing:', error);
        }
    }

    const filteredComplaints = complaints.pending.filter(complaint => {
        const titleMatch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryTypeMatch = !filterCategoryType || filterCategoryType === 'all' || complaint.category.categoryType === filterCategoryType;
        const subCategoryTypeMatch = !filterSubCategoryType || filterSubCategoryType === 'all' || complaint.category.subCategoryType === filterSubCategoryType;
        return titleMatch && categoryTypeMatch && subCategoryTypeMatch;
    });

    const handleDownloadExcel = () => {
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
            cost: "",
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(downloadComplaints);
        XLSX.utils.book_append_sheet(wb, ws, "Pending Complaints");
        XLSX.writeFile(wb, "pending_complaints.xlsx");
    }

    return (
        <div className='pending-complaints'>
            <h2 variant="h6">Pending Problems</h2>
            <div className="search-sort-container">
                <Input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                    value={filterCategoryType}
                    onChange={(e) => setFilterCategoryType(e.target.value)}
                    className="filter-select"
                >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="common">Common</MenuItem>
                </Select>
                <Select
                    value={filterSubCategoryType}
                    onChange={(e) => setFilterSubCategoryType(e.target.value)}
                    className="filter-select"
                >
                    <MenuItem value="all">All Subcategories</MenuItem>
                    {/* Other MenuItems */}
                </Select>
                <Button onClick={handleDownloadExcel} className="download-button">Download Excel</Button>
            </div>
            <List>
                {filteredComplaints.map(complaint => (
                    <ListItem key={complaint._id} className="list-item-container">
                        <ListItemText
                            primary={complaint.title}
                            secondary={complaint.description}
                            className="list-item-text"
                        />
                        <ListItemText
                            primary={`Category: ${complaint.category.categoryType}`}
                            secondary={`Sub-Category: ${complaint.category.subCategoryType}`}
                            className="list-item-text"
                        />
                        <ListItemText
                            primary={`Created By: ${complaint.createdBy.firstName} ${complaint.createdBy.lastName}`}
                            secondary={`Reg No: ${complaint.createdBy.regNo}, Room No: ${complaint.createdBy.roomNo}`}
                            className="list-item-text"
                        />
                        <ListItemSecondaryAction>
                            <Button onClick={() => handleSeenClick(complaint._id)} className="mark-as-seen-button">Seen</Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default CareTakerPendingProblems;
