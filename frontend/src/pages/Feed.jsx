import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { server } from "../index.js";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";

const Feed = () => {
  const [commonComplaints, setCommonComplaints] = useState([]);

  useEffect(() => {
    fetchCommonComplaints();
  }, []);

  const fetchCommonComplaints = async () => {
    const token = Cookies.get("tokenf");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      const { id: userId } = decodedToken;
      const response = await axios.get(
        `${server}/getCommonComplaint/${userId}`
      );
      const commonComplaints = response.data.complaints.filter(
        (complaint) => complaint.category.categoryType === "common"
      );
      setCommonComplaints(commonComplaints);
      console.log("Common complaints response:", commonComplaints);
    } catch (error) {
      console.error("Error fetching common complaints:", error);
    }
  };

  const handleUpvote = (complaintId) => {
    // Implement upvote functionality here
  };

  const handleComment = (complaintId, comment) => {
    // Implement comment functionality here
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 style={{ marginBottom: "20px" }}>Common Complaints Feed</h1>
      {commonComplaints.map((complaint) => (
        <Card
          key={complaint._id}
          style={{
            width: "400px",
            margin: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
            },
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={complaint.image}
            alt="Complaint Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {complaint.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {complaint.description}
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FavoriteIcon />}
                onClick={() => handleUpvote(complaint._id)}
              >
                Like
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ChatIcon />}
                style={{ marginLeft: "10px" }}
              >
                Comment
              </Button>
            </div>
            <TextField
              id={`comment-${complaint._id}`}
              label="Add a comment"
              variant="outlined"
              fullWidth
              margin="normal"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const comment = e.target.value;
                  handleComment(complaint._id, comment);
                  e.target.value = "";
                }
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Feed;
