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
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import BannerImage from "./complaint.png"; // Import your banner image

const Feed = () => {
  const [commonComplaints, setCommonComplaints] = useState([]);
  const [userUpvotedComplaints, setUserUpvotedComplaints] = useState([]);

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
    } catch (error) {
      console.error("Error fetching common complaints:", error);
    }
  };

  const handleUpvote = async (complaintId) => {
    try {
      const token = Cookies.get("tokenf");
      if (!token) {
        toast.error("Please login first");
        return;
      }
      const decodedToken = jwtDecode(token);
      const { id: userId } = decodedToken;

      if (userUpvotedComplaints.includes(complaintId)) {
        await axios.post(`${server}/downvoteComplaint/${userId}`, {
          complaintId,
        });
      } else {
        await axios.post(`${server}/upvoteComplaint/${userId}`, {
          complaintId,
        });
      }

      fetchCommonComplaints();
    } catch (error) {
      console.error("Error upvoting/downvoting complaint:", error);
    }
  };

  const handleComment = (complaintId, comment) => {
    // Implement comment functionality here
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "50px", textAlign: "center" }}>
        Common Complaints Feed
      </h1>
      <Grid container spacing={5}>
        {commonComplaints.map((complaint) => (
          <Grid item xs={12} sm={6} md={4} key={complaint._id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                borderRadius: 10,
                width:"80%",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardMedia
                component="img"
                // height="45"
                image={complaint.image || BannerImage}
                alt="Complaint Image"
                style={{width:"80%",objectFit:"contain",margin:"auto",aspectRatio:"3/2"}}
              />
              <CardContent  style={{marginLeft:"20px"}}>
                <Typography variant="h6" component="div">
                  {complaint.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 1, flexGrow: 1 }}
                >
                  {complaint.description}
                </Typography>
                {/* <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "8px", // Reduced margin here
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FavoriteIcon />}
                    onClick={() => handleUpvote(complaint._id)}
                  >
                    {userUpvotedComplaints.includes(complaint._id)
                      ? "Downvote"
                      : "Upvote"}{" "}
                    ({complaint.upvotes.length})
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ChatIcon />}
                  >
                    Comment
                  </Button>
                </div> */}
              </CardContent>
              {/* <div style={{ padding: "8px" }}>
                <TextField
                  // label="Filled"
                  id={`comment-${complaint._id}`}
                  label="Add a comment"
                  variant="filled"
                  size="small"
                  fullWidth
                  InputProps={{
                    style: {
                      borderRadius: 8,
                      padding: "6px",
                      fontSize: "0.875rem",
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const comment = e.target.value;
                      handleComment(complaint._id, comment);
                      e.target.value = "";
                    }
                  }}
                />
              </div> */}
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Feed;
