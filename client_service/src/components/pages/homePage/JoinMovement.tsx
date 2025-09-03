import React from 'react';
import '../../../styles/css/JoinMovement.css'; 
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
const JoinMovement: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Join the movement — save a life today.</h1>
        <p>Be a hero for animals in need.</p>
        <div className="buttons">
          <button className="register-button"><PetsIcon/> &nbsp;Register Now</button>
          <button className="partner-button"> <FavoriteIcon className='heart'/> &nbsp;Partner With Us</button>
        </div>
      </div>
      <div className="benefits">
        <h2>Why Choose Our Animal Blood Bank?</h2>
        <div className="benefits-grid">
          <div className="benefit">
            <h3>Trusted Network</h3>
            <p>Connected with certified veterinarians and animal care professionals across the country.</p>
          </div>
          <div className="benefit">
            <h3>Quality Assured</h3>
            <p>Strict quality control measures and standardized testing procedures for all blood donations.</p>
          </div>
          <div className="benefit">
            <h3>24/7 Support</h3>
            <p>Round-the-clock emergency support and rapid response for critical situations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinMovement;
