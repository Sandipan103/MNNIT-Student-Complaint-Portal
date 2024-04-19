import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { Context, server } from "../index";
import toast from "react-hot-toast";
import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button,CircularProgress, Tabs, Tab, } from "@mui/material";
import WardenPendingProblems from "../component/WardenPendingProblem"
const WardenDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchComplaints = async () => {
            const token = Cookies.get('tokenwf');
            if(token){
                try {
                    setLoading(true);
                    const decodedToken = jwtDecode(token);
                    console.log("decodid",decodedToken.id)
                    const response = await axios.get(`${server}/wardenDashboard/${decodedToken.id}`);
                    setComplaints(response.data.complaints);
                    console.log(
                        response
                    );
                    console.log(complaints)
                    // setComplaints(data.data.complaints);
                    
                } catch (error) {
                    console.error('Error fetching complaints:', error);
                    // Handle error
                } finally{
                    setLoading(false);
                }
            }
            
        };

        fetchComplaints();
    }, []); 

    return (
        <div style={{ width: "90%", margin: "0 auto" }}>
          <WardenPendingProblems complaints = {complaints} setComplaints = {setComplaints} />
        </div>
    );
};

export default WardenDashboard;
