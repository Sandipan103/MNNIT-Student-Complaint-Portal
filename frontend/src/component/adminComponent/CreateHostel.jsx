import React, { useState } from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { Context, server } from "../../index";
import axios from 'axios';
import toast from "react-hot-toast";

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  paper: {
    padding: '20px',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  },
};

const CreateHostel = () => {
  const [hostelName, setHostelName] = useState('');
  const [wings, setWings] = useState([{ wingNo: '', startRoom: '', endRoom: '' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${server}/createHostel`, { hostelName, wings });
      console.log(response.data);
      toast.success('Hostel created');

      // Clear form after successful submission
      setHostelName('');
      setWings([{ wingNo: '', startRoom: '', endRoom: '' }]);
    } catch (error) {
      console.error('Error creating hostel:', error);
      toast.error('Hostel not created, something went wrong');
    }
  };

  const handleAddWing = () => {
    setWings([...wings, { wingNo: '', startRoom: '', endRoom: '' }]);
  };

  const handleWingChange = (index, key, value) => {
    const updatedWings = [...wings];
    updatedWings[index][key] = value;
    setWings(updatedWings);
  };

  const handleRoomRangeChange = (index, key, value) => {
    const updatedWings = [...wings];
    updatedWings[index][key] = value;
    setWings(updatedWings);
  };

  const handleAddRoomRange = (wingIndex) => {
    const updatedWings = [...wings];
    const startRoom = parseInt(updatedWings[wingIndex].startRoom);
    const endRoom = parseInt(updatedWings[wingIndex].endRoom);
    if (!isNaN(startRoom) && !isNaN(endRoom) && startRoom <= endRoom) {
      // Generate room numbers between startRoom and endRoom
      const roomNumbers = Array.from({ length: endRoom - startRoom + 1 }, (_, i) => String(startRoom + i));
      updatedWings[wingIndex].roomNo = roomNumbers;
      setWings(updatedWings);
    }
  };

  return (
    <div style={styles.root}>
      <Paper style={styles.paper}>
        <Typography variant="h5" component="h2" gutterBottom>
          Create Hostel
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Hostel Name"
            variant="outlined"
            value={hostelName}
            onChange={(e) => setHostelName(e.target.value)}
            fullWidth
            required
            className="mt-3"
          />
          {wings.map((wing, wingIndex) => (
            <Box key={wingIndex} mt={2}>
              <TextField
                label="Wing Number"
                variant="outlined"
                value={wing.wingNo}
                onChange={(e) => handleWingChange(wingIndex, 'wingNo', e.target.value)}
                fullWidth
                className="mt-3"
              />
              <Box mt={2}>
                <TextField
                  label="Start Room Number"
                  variant="outlined"
                  value={wing.startRoom}
                  onChange={(e) => handleRoomRangeChange(wingIndex, 'startRoom', e.target.value)}
                  fullWidth
                  style={{ marginRight: '10px' }}
                  className="mt-3"
                />
                <TextField
                  label="End Room Number"
                  variant="outlined"
                  value={wing.endRoom}
                  onChange={(e) => handleRoomRangeChange(wingIndex, 'endRoom', e.target.value)}
                  fullWidth
                  style={{ marginRight: '10px' }}
                  className="mt-3"
                />
                <Button variant="contained" onClick={() => handleAddRoomRange(wingIndex)} className="mt-3">
                  Add Room Range
                </Button>
              </Box>
            </Box>
          ))}
          <Box mt={2}>
            <Button variant="contained" onClick={handleAddWing} className="mt-3">
              Add Wing
            </Button>
            <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }} className="mt-3">
              Create Hostel
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default CreateHostel;
