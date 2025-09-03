import React from 'react';
import '../../../styles/css/FooterSection.css';

const FooterSection: React.FC = () => {
    return (
        <>
            <div className='gradient'></div>
            <footer className="footer">
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Blog</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Legal</h3>
                    <ul>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <ul>
                        <li>Facebook</li>
                        <li>Twitter</li>
                        <li>Instagram</li>
                        <li>LinkedIn</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>📞 +91-XXXXXXXXXX</p>
                    <p>✉️ support@animalbloodbank.in</p>
                    <p>🏠 123 Animal Welfare Lane, Bengaluru, India</p>
                </div>
                
                <div className="footer-bottom">
                    <p>© 2025 Animal Blood Bank. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default FooterSection;
