import '../../../styles/css/TopBar.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';

const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <div className="top-left">
        <span><FaPhoneAlt /> (+91) 9844361632</span>
        <span><FaEnvelope /> info@rscsys.com</span>
        <span><FaMapMarkerAlt /> Bangalore, India</span>
      </div>
      <div className="top-right">
        <button className="follow-btn">Follow Now</button>
        <div className="social-icons">
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaPinterest />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
