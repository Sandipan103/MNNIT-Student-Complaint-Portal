import React from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import "../styles/CareTakerDashBoard.css";
const CareTakerSolvedProblems = ({ complaints }) => {
  return (
    <div>
      <h2 className='text-4xl '>Solved Problems</h2>
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
          {complaints.solved.map(complaint => (
            <TableRow key={complaint._id} >
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
  );
};

export default CareTakerSolvedProblems;
