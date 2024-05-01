import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { Context, server } from "../../index";
import axios from 'axios';
import toast from "react-hot-toast";

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
    <form onSubmit={handleSubmit}>
      <TextField
        label="Hostel Name"
        variant="outlined"
        value={hostelName}
        onChange={(e) => setHostelName(e.target.value)}
        fullWidth
        required
      />
      {wings.map((wing, wingIndex) => (
        <Box key={wingIndex}>
          <TextField
            label="Wing Number"
            variant="outlined"
            value={wing.wingNo}
            onChange={(e) => handleWingChange(wingIndex, 'wingNo', e.target.value)}
            fullWidth
          />
          <Box>
            <TextField
              label="Start Room Number"
              variant="outlined"
              value={wing.startRoom}
              onChange={(e) => handleRoomRangeChange(wingIndex, 'startRoom', e.target.value)}
              fullWidth
              style={{ marginRight: '10px' }}
            />
            <TextField
              label="End Room Number"
              variant="outlined"
              value={wing.endRoom}
              onChange={(e) => handleRoomRangeChange(wingIndex, 'endRoom', e.target.value)}
              fullWidth
              style={{ marginRight: '10px' }}
            />
            <Button variant="contained" onClick={() => handleAddRoomRange(wingIndex)}>
              Add Room Range
            </Button>
          </Box>
        </Box>
      ))}
      <Button variant="contained" onClick={handleAddWing}>
        Add Wing
      </Button>
      <Button type="submit" variant="contained" color="primary">
        Create Hostel
      </Button>
    </form>
  );
};

export default CreateHostel;
