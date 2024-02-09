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
        </Routes>
      </Router>
      <Toaster/>
    </div>
  );
}

export default App;
