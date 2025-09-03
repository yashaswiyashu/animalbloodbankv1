import React from 'react';
import '../../../styles/css/NewsLetter.css';

const Newsletter: React.FC = () => {
  return (
    <div className="newsletter-container">
      <div className="newsletter-content">
        <h1>🏥 Stay Connected with Animal Blood Bank ❤️</h1>
        <p>Join our community to receive updates about blood donation drives, animal health tips, and partner programs.</p>
        <form className="newsletter-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select id="role" required>
              <option value="">Select...</option>
              <option value="farmer">Farmer</option>
              {/* Additional options can be added here */}
            </select>
          </div>
        </form>
        <div className='subscribe-button-container'>
          <button type="submit" className="subscribe-button">Subscribe to Newsletter ✉️</button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
