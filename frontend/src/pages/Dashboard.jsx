import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { Context } from '../index';

const Dashboard = () => {
  const { isAuthenticated } = useContext(Context);
  if (!isAuthenticated) return <Navigate to={"/login"} />;
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard