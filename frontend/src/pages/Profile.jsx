import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import {
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Box,
} from "@mui/material";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { Context, server } from "../index";
import { useContext } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { isAuthenticated } = useContext(Context);
  const hostelOptions = [
    "R.N. Tagore Hostel",
    "C.V. Raman Hostel",
    "S.V.B.H",
    "P.D. Tandon Hostel",
    "M.M. Malviya Hostel",
    "B.G. Tilak Hostel",
    "S.V. Patel Hostel",
    "K.N. Girls Hostel",
    "P.G. Boys Hostel",
    "P.G. Girls Hostel",
  ];

  const fetchUserDetail = async () => {
    const token = Cookies.get("tokenf");
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const { id: userId } = decodedToken;

        const response = await axios.get(
          `${server}/getUserProfileById/${userId}`
        );

        const user = response.data.user;
        console.log("userData : ", user);
        setUserData(user);

        const defaultGender = user.gender || "";
        const defaultDateOfBirth = user.dateOfBirth || "";
        const defaultContactNo = user.contactNo || "";
        const defaultRegNo = user.regNo || "";
        const defaultHostelName = user.hostel ? user.hostel.name : "";
        const defaultImage = user.image?user.image:"NULL";
        setEditedData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          gender: defaultGender,
          dateOfBirth: defaultDateOfBirth,
          contactNo: defaultContactNo,
          regNo: defaultRegNo,
          roomNo: user.roomNo || "",
          hostelName: defaultHostelName,
          image : defaultImage,
        });
      } catch (error) {
        toast.error("profile data not fetched");
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNo" && !/^\d{0,10}$/.test(value)) {
      toast.error("invalid contact number");
      return;
    }
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  setSelectedFile(file);
  setEditedData((prevData) => ({
    ...prevData,
    image: ``,
  }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("tokenf");
    console.log("editedData : ", editedData);
    if (token) {
      try {
        setLoading(true);
        const response = await axios.put(`${server}/updateUserProfileById`, {
          userId: userData._id,
          firstName: editedData.firstName,
          lastName: editedData.lastName,
          gender: editedData.gender,
          dateOfBirth: editedData.dateOfBirth,
          contactNo: editedData.contactNo,
          regNo: editedData.regNo,
          hostelName: editedData.hostelName,
          roomNo: editedData.roomNo,
        });
        toast.success("profile updated");
        setIsEditing(false);
      } catch (error) {
        toast.error("profile not updated");
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };


  if (!isAuthenticated) return <Navigate to={"/login"} />;
  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-4">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <Link to="/">Home</Link>
              </MDBBreadcrumbItem>
              {/* <MDBBreadcrumbItem>
                <a href="/profile">User</a>
              </MDBBreadcrumbItem> */}
              <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
              <MDBBreadcrumbItem>
                {!isEditing && (
                  <MDBBtn outline onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </MDBBtn>
                )}
                {isEditing && (
                  <>
                    <MDBBtn onClick={handleSubmit}>Save</MDBBtn>
                    <MDBBtn
                      outline
                      className="ms-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </MDBBtn>
                  </>
                )}
              </MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol
            lg="4"
            className=" d-flex   justify-content-center row-cols-1 h-100"
          >
            <MDBCard className="mb-4  h-100">
              <MDBCardBody className="text-center  h-100 ">
                <MDBCardImage
                  src={
                    userData?.image ||
                    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  }
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px", marginLeft:"100px"}}
                  fluid
                />
                <p className="text-muted mb-1">
                {isEditing ? (
                      <TextField
                        name="roomNo"
                        label="Room No"
                        value={editedData.roomNo || ""}
                        onChange={handleChange}
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    ) : (
                      <MDBCardText className="text-muted">
                     Room No {editedData.roomNo}
                    </MDBCardText>
                    )}
                </p>
                <p className="text-muted mb-4">
                {isEditing ? (
                      <TextField
                        name="regNo"
                        label="Reg No"
                        value={editedData.regNo || ""}
                        onChange={handleChange}
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    ) : (
                      <MDBCardText className="text-muted">
                     Registration No {editedData.regNo ||" " }
                    </MDBCardText>
                    )}
                </p>
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn>
                    <Link to="/dashboard" style={{ color: "white" }}>
                      Dashboard
                    </Link>
                  </MDBBtn>
                  <MDBBtn outline className="ms-1">
                    <Link to="/complaintForm">Register Complaint</Link>
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                  {isEditing ? (
                      <TextField
                        name="firstName"
                        label="Name"
                        value={`${editedData.firstName || ''}`}
                        onChange={handleChange}
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    ) : (
                      <MDBCardText className="text-muted">
                        {editedData?.firstName}
                    </MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                   <MDBCardText className="text-muted">
                    {editedData.email}
                    </MDBCardText> 
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                  {isEditing ? (
                     <TextField
                     fullWidth
                     name="contactNo"
                     label="Contact No"
                     value={editedData.contactNo || ""}
                     onChange={handleChange}
                     style={{ backgroundColor: "white", color: "black" }}
                   />
                    ) : (
                      <MDBCardText className="text-muted">
                      {editedData.contactNo}
                    </MDBCardText> 
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Gender</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                  {isEditing ? (
                     <FormControl fullWidth>
                     <Select
                       labelId="gender-label"
                       id="gender"
                       name="gender"
                       value={editedData.gender || ""}
                       onChange={handleChange}
                       style={{ backgroundColor: "white", color: "black" }}
                     >
                       <MenuItem value="Male">Male</MenuItem>
                       <MenuItem value="Female">Female</MenuItem>
                     </Select>
                   </FormControl>
                    ) : (
                      <MDBCardText className="text-muted">
                      {editedData.gender}
                    </MDBCardText> 
                    )}
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Hostel</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                  {isEditing ? (
                     <FormControl fullWidth>
                     <Select
                       labelId="hostelName-label"
                       id="hostelName"
                       name="hostelName"
                       value={editedData.hostelName || ""}
                       onChange={handleChange}
                       style={{ backgroundColor: "white", color: "black" }}
                     >
                       {hostelOptions.map((hostel, index) => (
                         <MenuItem key={index} value={hostel}>
                           {hostel}
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>
                    ) : (
                      <MDBCardText className="text-muted">
                      {editedData.hostelName || " "}
                    </MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1">
                        Your Complaints
                      </span>{" "}
                      Pending
                    </MDBCardText>
                    <MDBCardText
                      className="mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Web Design
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Website Markup
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      One Page
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Mobile Template
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Backend API
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1">
                        Your Compaints
                      </span>{" "}
                      Solved
                    </MDBCardText>
                    <MDBCardText
                      className="mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Web Design
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Website Markup
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      One Page
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Mobile Template
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Backend API
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default Profile;
