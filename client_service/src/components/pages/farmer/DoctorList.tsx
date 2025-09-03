import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../../../styles/dashboard.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Doctor {
  _id: string;
  user_name?: string;
  user_email?: string;
  user_role?: string;
  user_phone?: string;
  city?: string;
  taluk?: string
  district?: string
  state?: string
  country?: string
  pin_code?: string
  specialization?: string;
  // user_address?: string;
  govt_id_number?: string;
  govt_id_image?: string;
}

interface GetUsersResponse {
  message: string;
  users: Doctor[];
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.toLowerCase();
    return (
      doctor.user_name?.toLowerCase().includes(term) ||
      doctor.specialization?.toLowerCase().includes(term) ||
      doctor.user_email?.toLowerCase().includes(term) ||
      doctor.city?.toLowerCase().includes(term) ||
      doctor.taluk?.toLowerCase().includes(term) ||
      doctor.district?.toLowerCase().includes(term) ||
      doctor.state?.toLowerCase().includes(term) ||
      doctor.country?.toLowerCase().includes(term) ||
      doctor.pin_code?.toLowerCase().includes(term)
    );
  });


  const fetchDoctors = async () => {
    try {
      const res = await api.auth_api.get<GetUsersResponse>('/auth/get-doctors');
      setDoctors(res.data.users);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const location = useLocation();

  return (
    <div className="center-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link to="/farmer" className="back-button"><ArrowBackIcon /></Link>
          <h2>Available Doctors</h2>
        </div>
        <div className="table-container">
          <div className='doctorList-container'>
            <div className="dashboard-content">
              <input
                type="text"
                placeholder="Search by specialization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-box"
              />
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Specialization</th>
                    <th>Actions</th>

                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map(doctor => (
                    <tr key={doctor._id}>
                      <td data-label="User Name">{doctor.user_name}</td>
                      <td data-label="Email">{doctor.user_email}</td>
                      <td data-label="Location">{doctor.city}, {doctor.taluk},<br /> {doctor.district},  {doctor.state},<br /> {doctor.country}, {doctor.pin_code}</td>
                      <td data-label="Specialization">{doctor.specialization}</td>
                      <td>
                        <button
                          className="form-button"
                          onClick={() => navigate(`/doctor/${doctor._id}`, {
                            state: { selectedAnimal: location.state?.selectedAnimal }
                          })}
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
    </div>
  );
};

export default DoctorList;
