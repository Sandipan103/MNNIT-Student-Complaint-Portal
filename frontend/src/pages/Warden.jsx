import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Context, server } from "../index";
const Warden = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`${server}/warden`); // Replace '/complaints' with your actual backend endpoint
                setComplaints(response.data.complaints);
        
                // setComplaints(data.data.complaints);
                
            } catch (error) {
                console.error('Error fetching complaints:', error);
                // Handle error
            }
        };

        fetchComplaints();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Warden Panel</h2>
            <h3>Complaints</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {complaints.map(complaint => (
                    <div key={complaint._id} style={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ marginTop: '0' }}>{complaint.title}</h3>
                        <p><strong>Category:</strong> {complaint.category.categoryType}</p>
                        <p><strong>Created By:</strong> {complaint.createdBy}</p>
                        <p><strong>Created At:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
                        {/* something change */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Warden;
