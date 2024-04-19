import React from 'react';
import { Link } from 'react-router-dom';
import BannerImage from './complaint.png'; // Import your banner image

const Home = () => {
  const bannerStyle = {
    backgroundImage: `url(${BannerImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '300px',
    borderRadius:'30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
  };

  const ctaButtonStyle = {
    display: 'inline-block',
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    textDecoration: 'none',
    borderRadius: '5px',
  };

  return (
    <div>
      <header style={{ backgroundColor: '#0f1924', color: '#fff', padding: '5px 0', textAlign: 'center' }}>
        <h1>Welcome to Complaint Portal</h1>
      </header>
      <div className="banner" style={bannerStyle}>
        <h1 style ={{color:'black', margin:'20px'}}>Submit Your Complaints Online</h1>
        <Link to="/ComplaintForm" style={ctaButtonStyle}>Submit a Complaint</Link>
      </div>
      <div className="container" style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
        <section id="about-us" style={{ marginBottom: '40px' }}>
          <h2>About Us</h2>
          <p>We are dedicated to providing a platform for students, faculty, and staff to voice their concerns and complaints regarding various aspects of college life. Our goal is to ensure that every complaint is addressed promptly and efficiently.</p>
        </section>
        <section id="contact-us" style={{ marginBottom: '40px' }}>
          <h2>Contact Us</h2>
          <p>If you have any questions or need assistance, feel free to contact us:</p>
          <ul>
            <li>Email: complaints@example.com</li>
            <li>Phone: 123-456-7890</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
