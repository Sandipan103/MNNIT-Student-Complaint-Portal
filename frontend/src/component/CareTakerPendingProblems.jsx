import React, { useState } from 'react';
import axios from "axios";
// import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button, CircularProgress } from "@mui/material";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
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

    const handleReject = async(complaintId) => {
        // send a mail to the user that complaint rejected
        try {
            const response = await axios.post(
                `${server}/rejectComplaint`,
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
            }
            toast.success('Complaint rejected');
        } catch (error) {
            toast.error('Something went wrong');
            console.error('error while rejecting complaint : ', error);
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
        <div>
            <h2 className='text-4xl '>Pending Problems</h2>
            <Input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                className='mr-10 mt-10 '
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
                value={filterCategoryType}
                className='mr-5'
                onChange={(e) => setFilterCategoryType(e.target.value)}
            >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="common">Common</MenuItem>
            </Select>
            <Select
                value={filterSubCategoryType}
                className='mr-10'
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
            <Button variant="outlined" onClick={handleDownloadExcel}>Download Excel</Button>
            <div>
            <Table className="table-container mt-10">
    <TableHead>
        <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Sub-Category</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Registration No</TableCell>
            <TableCell>Room No</TableCell>
            <TableCell>Action</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {filteredComplaints.map(complaint => (
            <TableRow key={complaint._id}>
                <TableCell>{complaint.title}</TableCell>
                <TableCell>{complaint.description}</TableCell>
                <TableCell>{complaint.category.categoryType}</TableCell>
                <TableCell>{complaint.category.subCategoryType}</TableCell>
                <TableCell>{`${complaint.createdBy.firstName} ${complaint.createdBy.lastName}`}</TableCell>
                <TableCell>{complaint.createdBy.regNo}</TableCell>
                <TableCell>{complaint.createdBy.roomNo}</TableCell>
                <TableCell className="button-container">
                    <Button onClick={() => handleSeenClick(complaint._id)}>Seen</Button>
                    <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleReject(complaint._id)}>Reject</Button>
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
</Table>

</div>
</div>          
    );
}

export default CareTakerPendingProblems;
