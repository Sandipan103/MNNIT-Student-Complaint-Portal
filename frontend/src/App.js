import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ComplaintForm from "./pages/ComplaintForm";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./component/Navbar";
import { Toaster } from "react-hot-toast";
import Feed from "./pages/Feed";
import WardenDashboard from "./pages/WardenDashboard";
import LoginCareTaker from "./pages/LoginCareTaker";
import CareTakerDashboard from "./pages/CareTakerDashboard";
import LoginWarden from "./pages/LoginWarden";
import LoginChiefWarden from "./pages/LoginChiefWarden";
import ChiefWardenDashboard from "./pages/ChiefWardenDashboard";
import AdminPage from "./pages/AdminPage";
function App() {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/complaintForm" element={<ComplaintForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/loginWarden" element={<LoginWarden />} />
          <Route path="/loginChiefWarden" element={<LoginChiefWarden />} />
          <Route path="/wardenDashboard" element={<WardenDashboard />} />
          <Route path="/chiefWardenDashboard" element={<ChiefWardenDashboard />} />
          <Route path="/loginCareTaker" element={<LoginCareTaker />} />
          <Route path="/careTakerDashBoard" element={<CareTakerDashboard />} />

          {/* admin controll */}
          <Route path="/adminPage" element={<AdminPage />} />
        </Routes>
      </Router>
       <Toaster
        position="top-right"
        toastOptions={{
          style: {
            right: 0,
            top: "100%", // Position at the middle of the screen vertically
            transform: "translateY(-50%)", // Adjust to center vertically
            margin: "50px",
            maxWidth: "100%",
            width: "250px", // Adjust width as needed
          },
        }}
      />
    </div>
  );
}

export default App;
