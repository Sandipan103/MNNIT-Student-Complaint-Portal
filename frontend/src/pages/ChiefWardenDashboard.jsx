import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { Context, server } from "../index";
import toast from "react-hot-toast";
import { Typography, Input, Select, MenuItem, List, ListItem, ListItemText, ListItemSecondaryAction, Button,CircularProgress, Tabs, Tab, } from "@mui/material";
import ChiefWardenPendingProblems from "../component/ChiefWardenPendingProblems"
const ChiefWardenDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchComplaints = async () => {
            // const token = Cookies.get('tokencwf');
            // if(token){
                try {
                    setLoading(true);
                    // const decodedToken = jwtDecode(token);
                    // console.log("decodid",decodedToken.id)
                    const response = await axios.get(`${server}/chiefWardenDashboard`);
                    setComplaints(response.data.complaints);
                    console.log(
                        response.data.complaints
                    );
                    console.log(complaints)
                    // setComplaints(data.data.complaints);
                    
                } catch (error) {
                    console.error('Error fetching complaints:', error);
                    // Handle error
                } finally{
                    setLoading(false);
                }
            // }
            
        };

        fetchComplaints();
    }, []); 

    return (
        <div style={{ width: "90%", margin: "0 auto" }}>
          <ChiefWardenPendingProblems complaints = {complaints} setComplaints = {setComplaints} />
        </div>
    );
};

export default ChiefWardenDashboard;
