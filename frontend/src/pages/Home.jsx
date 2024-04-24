import React from "react";
import { Link } from "react-router-dom";
import BannerImage from "./complaint.png"; // Import your banner image

const Home = () => {
  const bannerStyle = {
    backgroundImage: `url(${BannerImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "300px",
    borderRadius: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
  };

  const ctaButtonStyle = {
    display: "inline-block",
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "5px",
  };

  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Complaint Portal
            <span className="sm:block"> MNNITA </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            Submit your feedback and concerns seamlessly with our hostel
            complaint portal, ensuring a responsive and efficient resolution
            process for a better living experience.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              href="/complaintForm"
            >
              Get Started
            </a>

            <a
              className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              href="/signup"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </section>
    // <div>
    //   <header style={{ backgroundColor: '#0f1924', color: '#fff', padding: '5px 0', textAlign: 'center' }}>
    //     <h1>Welcome to Complaint Portal</h1>
    //   </header>
    //   <div className="banner" style={bannerStyle}>
    //     <h1 style ={{color:'black', margin:'20px'}}>Submit Your Complaints Online</h1>
    //     <Link to="/ComplaintForm" style={ctaButtonStyle}>Submit a Complaint</Link>
    //   </div>
    //   <div className="container" style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
    //     <section id="about-us" style={{ marginBottom: '40px' }}>
    //       <h2>About Us</h2>
    //       <p>We are dedicated to providing a platform for students, faculty, and staff to voice their concerns and complaints regarding various aspects of college life. Our goal is to ensure that every complaint is addressed promptly and efficiently.</p>
    //     </section>
    //     <section id="contact-us" style={{ marginBottom: '40px' }}>
    //       <h2>Contact Us</h2>
    //       <p>If you have any questions or need assistance, feel free to contact us:</p>
    //       <ul>
    //         <li>Email: complaints@example.com</li>
    //         <li>Phone: 123-456-7890</li>
    //       </ul>
    //     </section>
    //   </div>
    // </div>
  );
};

export default Home;
