// import '../../../styles/css/Navbar.css';
// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import logo from '../../../assets/Logo.png';

// const Navbar: React.FC = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <>
//       <nav className="main-navbar">
//         <div className="navbar-container">
//           <img src={logo} />
//           <div className="logo">
//             <Link to="/">Prani <span>Mithra</span></Link>
//           </div>

//           <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
//             {menuOpen ? '✖' : '☰'}
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu Modal */}
//       {menuOpen && (
//         <div className="mobile-menu-overlay">
//           <div className="mobile-menu-container">
//             <div className="close-btn" onClick={() => setMenuOpen(false)}>✖</div>
//             <ul className="mobile-menu">
//               <li><Link to="/stories"  onClick={() => setMenuOpen(false)}>Gallery</Link></li>
//               <li><Link to="/login" onClick={() => setMenuOpen(false)}>Log In</Link></li>
//               <li><Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;






import '../../../styles/css/Navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../../assets/Logo.png';
const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
          <img src={logo}/>
        <div className="logo">
          <Link to="/">Prani <span>Mithra</span></Link>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </div>


        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/stories" className='nav-btn gallery-btn'>Gallery</Link></li>
          <li><Link to="/login" className="nav-btn login-btn">Log In</Link></li>
          <li><Link to="/register" className="nav-btn signup-btn">Sign Up</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
