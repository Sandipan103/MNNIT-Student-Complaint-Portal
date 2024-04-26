import React, { useState } from 'react';
import { Typography, Input, Select, MenuItem, Button, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import axios from "axios";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';
import "../styles/CareTakerDashBoard.css";

const CareTakerPendingProblems = ({ complaints, setComplaints, userId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoryType, setFilterCategoryType] = useState('all');
    const [filterSubCategoryType, setFilterSubCategoryType] = useState('all');

    const filteredComplaints = complaints ? complaints.filter(complaint => {
        // Filter based on title
        const titleMatch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
        // Filter based on categoryType
        const categoryTypeMatch = !filterCategoryType || filterCategoryType === 'all' || complaint.category.categoryType === filterCategoryType;
        // Filter based on subCategoryType
        const subCategoryTypeMatch = !filterSubCategoryType || filterSubCategoryType === 'all' || complaint.category.subCategoryType === filterSubCategoryType;
        return titleMatch && categoryTypeMatch && subCategoryTypeMatch;
    }) : [];

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

    const sendMailToCaretaker = async() => {
        // send a mail to the caretaker
        try {
            const response = await axios.post(
                `${server}/sendMailToCaretaker`,
                { userId: userId }
            );
            toast.success('mail send successfully');
        } catch (error) {
            toast.error('Something went wrong while sending mail to caretaker');
            console.error('error while sending mail to caretaker : ', error);
        }
    }

    return (
        <div>
            <h2 className='text-4xl ml-5'>Warden Pending Problems</h2>
            <Input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                className='mr-10 mt-10 ml-5'
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
            <Button onClick={handleDownloadExcel}>Download Excel</Button>
            <Button onClick={sendMailToCaretaker}> Send Mail </Button>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CareTakerPendingProblems;
