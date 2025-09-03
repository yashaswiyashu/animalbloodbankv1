import '../../../styles/css/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li><a href="#hero">Blood Product Supply</a></li>
            <li><a href="#about">Canine Fresh Frozen Plasma (FFP)</a></li>
            <li><a href="#services">Blood Typing Services</a></li>
            <li><a href="#contact">Donor Program Management</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>Bangalore, India</p>
          <p>Email: info@rscsys.com</p>
          <p>Phone: (+91) 9844361632</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Rsc Systems Pvt Ltd.</p>
      </div>
    </footer>
  );
};

export default Footer;
