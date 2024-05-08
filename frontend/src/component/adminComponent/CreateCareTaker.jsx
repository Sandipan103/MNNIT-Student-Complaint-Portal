import React, { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { Context, server } from "../../index";
import axios from 'axios';
import toast from "react-hot-toast";

const CreateCareTaker = () => {
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hostelName, setHostelName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${server}/createCaretaker`, {
        name,
        contactNo,
        email,
        password,
        hostelName
      });
      console.log(response.data);
      toast.success('Caretaker created successfully');
      // Clear form fields after successful creation
      setName('');
      setContactNo('');
      setEmail('');
      setPassword('');
      setHostelName('');
    } catch (error) {
      console.error('Error creating caretaker:', error);
      toast.error('Failed to create caretaker. Please try again.');
    }
  };

  return (
    <Paper elevation={3} style={{
      padding: '20px',
      maxWidth: '400px',
      margin: 'auto',
      marginTop: '50px',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}>
      <h1> Create CareTaker </h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          className="mt-3"
        />
        <TextField
          label="Contact Number"
          variant="outlined"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          fullWidth
          className="mt-3"
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          className="mt-3"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          className="mt-3"
        />
        <TextField
          label="Hostel Name"
          variant="outlined"
          value={hostelName}
          onChange={(e) => setHostelName(e.target.value)}
          fullWidth
          required
          className="mt-3"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth className="mt-3">
          Create Caretaker
        </Button>
      </form>
    </Paper>
  );
};

export default CreateCareTaker;
