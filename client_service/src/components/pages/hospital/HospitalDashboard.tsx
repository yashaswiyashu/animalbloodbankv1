
import React, { useState, useContext, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

import '../../../styles/forms.css';
import '../../../styles/dashboard.css';
import gps from '../../assets/gps.png'

interface Doctor {
  _id: string;
  user_name: string;
  user_phone: string;
  hospital_id: string;
  user_email: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  specialization: string;
  govt_id_image: string;
  govt_id: string
}

interface GetDoctorResponse {
  message: string;
  doctors: Doctor[];
}


const HospitalDashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAddingDoctors, setIsAddingDoctors] = useState(false);
  const [editingDoctors, setEditingdoctors] = useState<Doctor | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    numbers: false,
    special: false
  });




  const [formData, setFormData] = useState({
    user_name: '',
    user_password: '',
    user_phone: '',
    user_email: '',
    // user_address: '',
    city: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
    pin_code: '',
    specialization: '',
    govt_id_image: null as File | null,
    govt_id: '',
  });

  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate('/login');
    }
  };
  const HospitalId = context?.user?.id;


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };


  const fetchDoctors = async () => {
    try {
      const res = await api.hospital_api.get<GetDoctorResponse>(`/doctors/hospital/${HospitalId}`);
      console.log('Fetched hospitals:', res.data); // This should be an array
      setDoctors(res.data.doctors); // Set the array directly
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData({ ...formData, govt_id_image: e.target.files[0] });
      if (formErrors.govt_id_image) {
        setFormErrors((prev) => ({ ...prev, govt_id_image: '' }));
      }
    }
  };


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const formPayload = new FormData();
  //     formPayload.append('user_name', formData.user_name);
  //     if (!editingDoctors) {
  //       formPayload.append('user_password', formData.user_password);
  //     }
  //     formPayload.append('user_phone', formData.user_phone);
  //     formPayload.append('user_email', formData.user_email);
  //     formPayload.append('city', formData.city);
  //     formPayload.append('taluk', formData.taluk);
  //     formPayload.append('district', formData.district);
  //     formPayload.append('state', formData.state);
  //     formPayload.append('country', formData.country);
  //     formPayload.append('pin_code', formData.pin_code);
  //     formPayload.append('specialization', formData.specialization);
  //     formPayload.append('govt_id', formData.govt_id);
  //     formPayload.append('hospital_id', HospitalId);
  //     formPayload.append('user_role', 'doctor');

  //     if (formData.govt_id_image) {
  //       formPayload.append('govt_id_image', formData.govt_id_image);
  //     }

  //     if (editingDoctors) {
  //       await api.hospital_api.put(`/update/${editingDoctors._id}`, formPayload, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });
  //       alert('Doctor updated successfully');
  //     } else {
  //       await api.auth_api.post('/auth/register', formPayload, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });
  //       alert('Doctor added successfully');
  //     }

  //     await fetchDoctors(); // force update table after submit
  //     resetForm();          // reset and close modal
  //   } catch (error) {
  //     console.error('Submit failed:', error);
  //     alert('Failed to submit doctor');
  //   }
  // };

  const checkPasswordStrength = (password: string) => {
    const hasLength = password.length > 10;
    const numberCount = (password.match(/\d/g) || []).length;
    const hasTwoNumbers = numberCount >= 2;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const allPassed = hasLength && hasTwoNumbers && hasSpecial;

    setPasswordChecks({
      length: hasLength,
      numbers: hasTwoNumbers,
      special: hasSpecial
    });
  };


  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.user_name) errors.user_name = 'Name is required';
    if (!formData.user_password) errors.user_password = 'Password is required';
    if (!/\S+@\S+\.\S+/.test(formData.user_email)) errors.user_email = 'Invalid email format';
    if (!/^\d{10}$/.test(formData.user_phone)) errors.user_phone = 'Phone Number must be 10 digits';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.taluk) errors.taluk = 'Taluk is required';
    if (!formData.district) errors.district = 'District is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!/^\d{6}$/.test(formData.pin_code)) errors.pin_code = 'PIN Code must be 6 digits';
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.govt_id) errors.govt_id = 'Government ID is required';
    if (!formData.govt_id_image) errors.govt_id_image = 'Government ID image is required';

    if (!passwordChecks.length || !passwordChecks.numbers || !passwordChecks.special) {
      errors.user_password = 'Password must satisfy all strength rules';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formPayload = new FormData();
      formPayload.append('user_name', formData.user_name);
      if (!editingDoctors) {
        formPayload.append('user_password', formData.user_password);
      }
      formPayload.append('user_phone', formData.user_phone);
      formPayload.append('user_email', formData.user_email);
      formPayload.append('city', formData.city);
      formPayload.append('taluk', formData.taluk);
      formPayload.append('district', formData.district);
      formPayload.append('state', formData.state);
      formPayload.append('country', formData.country);
      formPayload.append('pin_code', formData.pin_code);
      formPayload.append('specialization', formData.specialization);
      formPayload.append('govt_id', formData.govt_id);
      formPayload.append('hospital_id', HospitalId);
      formPayload.append('user_role', 'doctor');

      if (formData.govt_id_image) {
        formPayload.append('govt_id_image', formData.govt_id_image);
      }

      if (editingDoctors) {
        await api.hospital_api.put(`/update/${editingDoctors._id}`, formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ type: 'success', message: 'Doctor updated successfully' });
      } else {
        await api.auth_api.post('/auth/register', formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ type: 'success', message: 'Doctor added successfully' });
      }

      await fetchDoctors();
      resetForm();
    } catch (error) {
      console.error('Submit failed:', error);
      setToast({ type: 'error', message: 'Failed to submit doctor' });
    } finally {
      setTimeout(() => setToast(null), 5000);
    }
  };





  // const handleDeleteDoctor = async (_id: string) => {
  //   const confirmed = window.confirm('Are you sure you want to delete this doctor?');
  //   if (!confirmed) return;

  //   try {
  //     await api.hospital_api.delete(`/delete/${_id}`);
  //     await fetchDoctors(); // refresh after delete
  //   } catch (error) {
  //     console.error('Delete failed:', error);
  //     alert('Failed to delete doctor');
  //   }
  // };


  const handleDeleteDoctor = (_id: string) => {
    setDoctorToDelete(_id); // trigger modal
  };




  const resetForm = () => {
    setIsAddingDoctors(false);
    setEditingdoctors(null);
    setFormData({
      user_name: '',
      user_password: '',
      user_phone: '',
      user_email: '',
      city: '',
      taluk: '',
      district: '',
      state: '',
      country: '',
      pin_code: '',
      specialization: '',
      govt_id_image: null,
      govt_id: '',
    });
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingdoctors(doctor);
    setFormData({
      user_name: doctor.user_name,
      user_password: '', // leave empty if not changing password
      user_phone: doctor.user_phone,
      user_email: doctor.user_email,
      city: doctor.city,
      taluk: doctor.taluk,
      district: doctor.district,
      state: doctor.state,
      country: doctor.country,
      pin_code: doctor.pin_code,
      specialization: doctor.specialization,
      govt_id_image: null,
      govt_id: doctor.govt_id,
    });
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.address;
          console.log("response:", res);
          console.log("data", data);
          console.log("address", address);
          console.log("latitude", latitude);
          console.log("longitude", longitude);

          setFormData((prev) => ({
            ...prev,
            country: address.country || "",
            state: address.state || "",
            district: address.county || address.state_district || "",
            city: address.city || address.town || address.village || "",
            pin_code: address.postcode || "",
            // taluk: address.suburb || address.neighbourhood || "", // not always reliable
            taluk: address.taluk || address.taluk || "",
          }));
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          alert("Could not retrieve location details.");
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Permission denied or location unavailable.");
      }
    );
  };



  return (
    <div className="center-page">
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Hospital Dashboard</h2>
          <button className="form-button1" onClick={handleLogout}>Logout</button>
        </div>
        <div className="dashboard-content">
          {/* <h2>Doctor List</h2>

          <button
            className="form-button contact-button"
            onClick={() => setIsAddingDoctors(true)}
          >
            Add New Doctor
          </button>

          <button
            className="form-button contact-button"
            onClick={() => navigate('/hospital-desc')}
          >
            About
          </button>

          <button
            className="form-button contact-button"
            onClick={() => navigate('/hospital-img')}
          >
            Gallary
          </button> */}

          {/* Burger Menu */}
          <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>

          {/* Navigation Buttons */}
          <div className={`nav-buttons ${menuOpen ? 'show' : ''}`}>
            <button
              className="form-button contact-button"
              onClick={() => { setIsAddingDoctors(true); setMenuOpen(false); }}
            >
              Add New Doctor
            </button>

            <button
              className="form-button contact-button"
              onClick={() => { navigate('/hospital-desc'); setMenuOpen(false); }}
            >
              About
            </button>

            <button
              className="form-button contact-button"
              onClick={() => { navigate('/hospital-img'); setMenuOpen(false); }}
            >
              Gallery
            </button>
          </div>

          <h2>Doctor List</h2>

          {(isAddingDoctors || editingDoctors) && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="form-container">
                  <h3>{editingDoctors ? 'Edit Animal' : 'Add New Doctor'}</h3>
                  <form onSubmit={handleSubmit}>
                    {/* <div className='form-grid'> */}
                    <div className="form-group">
                      
                      <input
                        className={`form-input ${formErrors.user_name ? 'input-error' : ''}`}
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleInputChange}
                        placeholder="Name"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.user_name}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        type="password"
                        className={`form-input ${formErrors.user_password ? 'input-error' : ''}`}
                        value={formData.user_password}
                        onChange={(e) => {
                          const newPassword = e.target.value;
                          setFormData({ ...formData, user_password: newPassword });
                          checkPasswordStrength(newPassword);
                          if (formErrors.user_password) {
                            setFormErrors((prev) => ({ ...prev, user_password: '' }));
                          }
                        }}
                        onFocus={() => setShowPasswordRules(true)}
                        placeholder="Password"
                      />
                      {formErrors.user_password && (
                        <span className="error-text">{formErrors.user_password}</span>
                      )}

                      {/* Password Rules */}
                      {showPasswordRules && (
                        <div className="password-rules">
                          <div className={`rule ${passwordChecks.length ? 'passed' : ''}`}>
                            <span className="dot">
                              {passwordChecks.length ? '✔' : ''}
                            </span>
                            password must have At least 10 characters
                          </div>

                          <div className={`rule ${passwordChecks.numbers ? 'passed' : ''}`}>
                            <span className="dot">
                              {passwordChecks.numbers ? '✔' : ''}
                            </span>
                            password must have At least 2 numbers
                          </div>

                          <div className={`rule ${passwordChecks.special ? 'passed' : ''}`}>
                            <span className="dot">
                              {passwordChecks.special ? '✔' : ''}
                            </span>
                            password must have At least 1 special character
                          </div>
                        </div>
                      )}

                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.user_email ? 'input-error' : ''}`}
                        name="user_email"
                        value={formData.user_email}
                        onChange={handleInputChange}
                        placeholder="Email"
                      />
                      {formErrors.user_email && <span className="error-text">{formErrors.user_email}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.user_phone ? 'input-error' : ''}`}
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                      />
                      {formErrors.user_phone && <span className="error-text">{formErrors.user_phone}</span>}
                    </div>
                    <div className="form-group"
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // spacing between input and icon
                  }}
                  >
                      <input
                        className={`form-input ${formErrors.city ? 'input-error' : ''}`}
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City or Village"
                        // style={{ flex: 1 }}
                      />
                      <button
                    type="button"
                    onClick={handleLocationClick}
                    title="Use current location"
                    style={{
                      // border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: 15,
                      padding: '0px',
                      // marginLeft: '-10px',
                      lineHeight: '1',
                      flexShrink: 10, // 👈 prevents button from shrinking input
                      outline: 'none',
                      boxShadow: 'none',
                      marginRight: '-40px',
                      color: 'black',
                    }}
                  >
                    <img
                      src={gps}
                      alt="Use current location"
                      style={{ width: '20px', height: '20px' }} />
                  </button>
                      {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.taluk ? 'input-error' : ''}`}
                        name="taluk"
                        value={formData.taluk}
                        onChange={handleInputChange}
                        placeholder="Taluk"
                      />
                      {formErrors.taluk && <span className="error-text">{formErrors.taluk}</span>}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.district ? 'input-error' : ''}`}
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="District"
                      />
                      {formErrors.district && <span className="error-text">{formErrors.district}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.state ? 'input-error' : ''}`}
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                      {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.country ? 'input-error' : ''}`}
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                      {formErrors.country && <span className="error-text">{formErrors.country}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.pin_code ? 'input-error' : ''}`}
                        name="pin_code"
                        value={formData.pin_code}
                        onChange={handleInputChange}
                        placeholder="Pin Code"
                      />
                      {formErrors.pin_code && <span className="error-text">{formErrors.pin_code}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.specialization ? 'input-error' : ''}`}
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="Specialization"
                      />
                      {formErrors.specialization && <span className="error-text">{formErrors.specialization}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.govt_id ? 'input-error' : ''}`}
                        name="govt_id"
                        value={formData.govt_id}
                        onChange={handleInputChange}
                        placeholder="Government ID"
                      />
                      {formErrors.govt_id && <span className="error-text">{formErrors.govt_id}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={formErrors.govt_id_image ? 'input-error' : ''}
                      />
                      {formErrors.govt_id_image && (
                        <span className="error-text">{formErrors.govt_id_image}</span>
                      )}
                    </div>
                    {/* </div> */}

                    <div className="form-buttons">
                      <button type="submit" className="form-button">
                        {editingDoctors ? 'Update' : 'Add'} Doctor
                      </button>
                      <button
                        type="button"
                        className="form-button cancel-button"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}


          {doctorToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this doctor?</p>
                <div className="form-buttons">
                  <button
                    className="form-button"
                    onClick={async () => {
                      try {
                        await api.hospital_api.delete(`/delete/${doctorToDelete}`);
                        await fetchDoctors(); // refresh list
                        setToast({ type: 'success', message: 'Doctor deleted successfully' });
                      } catch (error) {
                        console.error('Delete failed:', error);
                        setToast({ type: 'error', message: 'Failed to delete doctor' });
                      } finally {
                        setDoctorToDelete(null);
                        setTimeout(() => setToast(null), 5000);
                      }
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="form-button cancel-button"
                    onClick={() => setDoctorToDelete(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}


          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>

                  <th>Doctor Name</th>
                  <th>Doctor Phone number</th>
                  <th>Doctor Email</th>
                  <th>Doctor Address</th>
                  <th>Doctor Specialization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors?.map((doctor) => (
                  <tr key={doctor._id}>
                    <td data-label="Doctor Name">{doctor.user_name}</td>
                    <td data-label="Phone">{doctor.user_phone}</td>
                    <td data-label="Email">{doctor.user_email}</td>

                    <td data-label="Location">
                      {doctor.city}, {doctor.taluk},<br /> {doctor.district}, {doctor.state},<br /> {doctor.country} - {doctor.pin_code}
                    </td>
                    <td data-label="Specialization">{doctor.specialization}</td>
                    <td data-label="Action">
                      <button
                        className="action-button edit"
                        onClick={() => handleEdit(doctor)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDeleteDoctor(doctor._id)}
                      >
                        Delete
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

export default HospitalDashboard;