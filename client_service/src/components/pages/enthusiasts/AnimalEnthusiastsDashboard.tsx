import React, { useState, useContext, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

import '../../../styles/forms.css';
import '../../../styles/dashboard.css';

interface Entry {
  _id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
}

const AnimalEnthusiasts: React.FC = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);


  const [entries, setEntries] = useState<Entry[]>([]);
  const [entryType, setEntryType] = useState<'Hospital' | 'Organisation'> ('Hospital');

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate('/login');
    }
  };

  const fetchEntries = async (type: 'Hospital' | 'Organisation') => {
    try {
      const endpoint = type === 'Hospital' ? 'enthusist/hospitals' : 'enthusist/organisations';
      const response = await api.ae_api.get<Entry[]>(endpoint);
      setEntries(response.data);
      setEntryType(type);
    } catch (err) {
      console.error(`Failed to fetch ${type.toLowerCase()}s`, err);
    }
  };

  useEffect(() => {
    fetchEntries(entryType);
  }, []);


  return (
  <div className="center-page">
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Animal Enthusiasts Dashboard</h2>
        <button className="form-button1" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">

        {/* Burger Menu */}
        <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Navigation Buttons */}
        <div className={`nav-buttons ${menuOpen ? 'show' : ''}`}>
          <button
            className="form-button contact-button"
            onClick={() => { fetchEntries('Hospital'); setMenuOpen(false); }}
          >
            Hospital
          </button>

          <button
            className="form-button contact-button"
            onClick={() => { fetchEntries('Organisation'); setMenuOpen(false); }}
          >
            Organisation
          </button>
        </div>

        <h2>Make a contribution to help Poor Animals.....</h2>


          {entryType && (
            <div className="table-container">
              <h3 className='entry_type'>{entryType}s</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <tr key={entry._id}>
                        <td data-label="User Name">{entry.user_name}</td>
                        <td data-label="Phone">{entry.user_phone}</td>
                        <td data-label="Email">{entry.user_email}</td>
                        <td data-label="Location">{entry.city}, {entry.taluk},<br /> {entry.district}, {entry.state},<br /> {entry.country} - {entry.pin_code}</td>
                        <td>
                        <button
                        className="form-button"
                        // onClick={() => navigate(`/doctor/${doctor._id}`)}
                        onClick={() => navigate(`/profile/${entryType.toLowerCase()}/${entry._id}`,{
                          state: { name: entry.user_name },
                        })
                      }  
                        >
                        View Profile
                        </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5}>No {entryType.toLowerCase()}s found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalEnthusiasts;
