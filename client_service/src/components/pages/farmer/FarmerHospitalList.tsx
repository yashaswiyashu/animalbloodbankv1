import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { Link } from 'react-router-dom';
import '../../../styles/dashboard.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Hospital {
  _id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  user_phone: string;
  city: string;
  taluk:string
  district:string
  state:string
  country:string
  pin_code:string

}

interface GetUsersResponse {
  message: string;
  users: Hospital[];
}


const HospitalList: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = hospitals.filter((hospital) => {
  const term = searchTerm.toLowerCase();
  return (
    hospital.user_name?.toLowerCase().includes(term) ||
    // doctor.specialization?.toLowerCase().includes(term) ||
    hospital.city?.toLowerCase().includes(term) ||
    hospital.taluk?.toLowerCase().includes(term) ||
    hospital.district?.toLowerCase().includes(term) ||
    hospital.state?.toLowerCase().includes(term) ||
    hospital.country?.toLowerCase().includes(term) ||
    hospital.pin_code?.toLowerCase().includes(term)
  );
});


const fetchHospitals = async () => {
    try {
      const response = await api.auth_api.get<GetUsersResponse>('/auth/get-hospitals');
      setHospitals(response.data.users);
    //   setShowHospitals(true);
    } catch (err) {
      console.error('Failed to fetch hospitals', err);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="center-page">
      <div className="dashboard-header"> 
        <Link className="back-button" to="/farmer"><ArrowBackIcon/></Link> 
        <h2>Available Hospital</h2>  
      </div>
      <div className="dashboard-container">
        <div className="table-container">
          
          <div className="dashboard-content">
          <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
          />
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                {/* <th>Specialization</th> */}
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map(hospital => (
                <tr key={hospital._id}>
                  <td data-label="Hospital Name">{hospital.user_name}</td>
                  <td data-label="Hospital Email">{hospital.user_email}</td>
                  <td data-label="Hospital Phone">{hospital.user_phone}</td>
                  <td data-label="Hospital Location">{hospital.city}, {hospital.taluk}, {hospital.district}, <br /> {hospital.state}, {hospital.country} - {hospital.pin_code}</td>
                  {/* <td>{doctor.specialization}</td> */}
                  <td>
                    <button
                      className="form-button"
                    //   onClick={() => navigate(`/doctor/${doctor._id}`)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalList;
