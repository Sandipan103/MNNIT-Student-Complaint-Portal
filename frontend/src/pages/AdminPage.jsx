import React, { useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import CreateCareTaker from '../component/adminComponent/CreateCareTaker';
import CreateWarden from '../component/adminComponent/CreateWarden';
import CreateHostel from '../component/adminComponent/CreateHostel';

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'createCaretaker':
        return <CreateCareTaker />;
      case 'createWarden':
        return <CreateWarden />;
      case 'createHostel':
        return <CreateHostel />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px' }}>
        <Typography variant="h4" gutterBottom>
          Admin Portal
        </Typography>
        <Button onClick={() => handleClick('createCaretaker')} variant="contained" color="primary" fullWidth style={{ marginBottom: '10px' }}>
          Create Caretaker
        </Button>
        <Button onClick={() => handleClick('createWarden')} variant="contained" color="primary" fullWidth style={{ marginBottom: '10px' }}>
          Create Warden
        </Button>
        <Button onClick={() => handleClick('createHostel')} variant="contained" color="primary" fullWidth>
          Create Hostel
        </Button>
      </Paper>
      <div style={{ marginLeft: '20px' }}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminPage;
