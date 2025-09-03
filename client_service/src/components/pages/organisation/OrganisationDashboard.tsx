import React, { useState, useContext, useEffect } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../../../styles/forms.css';
import '../../../styles/dashboard.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import gps from '../../assets/gps.png'

interface Hospital {
  _id: string;
  user_name: string;
  user_phone: string;
  hospital_id: string;
  user_email: string;
  // user_address: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  organisation_id: string;
}

interface HospitalFormData {
  user_name: string;
  user_password: string;
  user_phone: string;
  user_email: string;
  // user_address: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
}

interface GetHospitalResponse {
  message: string;
  hospitals: Hospital[];
}

interface Doctor {
  _id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  // user_address: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  govt_id: string;
  govt_id_image: string;
  organisation_id: string;
  hospital_id: string;
  specialization: string;
  // fileUrl: string;
  // add others if needed
}

interface GetDoctorsResponse {
  message: string;
  doctors: Doctor[];
}


const OrganisationDashboard: React.FC = () => {
  const [Hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [showDoctorTableId, setShowDoctorTableId] = useState<string | null>(null);
  const [isAddingDoctorForHospitalId, setIsAddingDoctorForHospitalId] = useState<string | null>(null);
  const [doctorsByHospital, setDoctorsByHospital] = useState<{ [hospitalId: string]: Doctor[] }>({});
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteHospitalId, setDeleteHospitalId] = useState<string | null>(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    numbers: false,
    special: false
  });



  const [doctorFormData, setDoctorFormData] = useState({
    user_name: '',
    user_password: '',
    user_email: '',
    user_phone: '',
    // user_address: '',
    city: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
    pin_code: '',
    govt_id: '',
    govt_id_image: null as File | null,
    hospital_id: '',
    specialization: '',
  });

  const [formData, setFormData] = useState<HospitalFormData>({
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
  });

  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate('/login');
    }
  };
  const organisationId = context?.user?.id;

  const fetchHospitals = async () => {
    try {
      const res = await api.organization_api.get<GetHospitalResponse>(`/hospitals/get-hospitals/${organisationId}`);
      setHospitals(res.data.hospitals);
    } catch (error) {
      console.error('Error fetching Hospitals:', error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
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
    });
    setIsAddingHospital(false);
    setEditingHospital(null);
    setShowPasswordRules(false);  // Add this
    setPasswordChecks({          // Add this
      length: false,
      numbers: false,
      special: false
    });
    setFormErrors({});
  };

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


  const validateHospitalForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.user_name) errors.user_name = 'Name is required';
    if (!editingHospital && !formData.user_password) errors.user_password = 'Password is required';
    if (!/\S+@\S+\.\S+/.test(formData.user_email)) errors.user_email = 'Invalid email format';
    if (!/^\d{10}$/.test(formData.user_phone)) errors.user_phone = 'Phone Number must be 10 digits';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.taluk) errors.taluk = 'Taluk is required';
    if (!formData.district) errors.district = 'District is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!/^\d{6}$/.test(formData.pin_code)) errors.pin_code = 'PIN Code must be 6 digits';

    // Only validate password strength if it's a new hospital or password is being changed
    if (!editingHospital && formData.user_password) {
      if (!passwordChecks.length || !passwordChecks.numbers || !passwordChecks.special) {
        errors.user_password = 'Password must satisfy all strength rules';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDoctorForm = () => {
    const errors: { [key: string]: string } = {};

    if (!doctorFormData.user_name) errors.user_name = 'Name is required';
    if (!editingDoctor && !doctorFormData.user_password) errors.user_password = 'Password is required';
    if (!/\S+@\S+\.\S+/.test(doctorFormData.user_email)) errors.user_email = 'Invalid email format';
    if (!/^\d{10}$/.test(doctorFormData.user_phone)) errors.user_phone = 'Phone Number must be 10 digits';
    if (!doctorFormData.city) errors.city = 'City is required';
    if (!doctorFormData.taluk) errors.taluk = 'Taluk is required';
    if (!doctorFormData.district) errors.district = 'District is required';
    if (!doctorFormData.state) errors.state = 'State is required';
    if (!doctorFormData.country) errors.country = 'Country is required';
    if (!/^\d{6}$/.test(doctorFormData.pin_code)) errors.pin_code = 'PIN Code must be 6 digits';
    if (!doctorFormData.specialization) errors.specialization = 'Specialization is required';
    if (!doctorFormData.govt_id) errors.govt_id = 'Government ID is required';
    if (!editingDoctor && !doctorFormData.govt_id_image) errors.govt_id_image = 'Government ID image is required';

    // Only validate password strength if it's a new doctor or password is being changed
    if (!editingDoctor && doctorFormData.user_password) {
      if (!passwordChecks.length || !passwordChecks.numbers || !passwordChecks.special) {
        errors.user_password = 'Password must satisfy all strength rules';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateHospitalForm()) return;
    try {
      const data = new FormData();
      data.append('user_name', formData.user_name);
      data.append('user_phone', formData.user_phone);
      data.append('user_email', formData.user_email);
      data.append('city', formData.city);
      data.append('taluk', formData.taluk);
      data.append('district', formData.district);
      data.append('state', formData.state);
      data.append('country', formData.country);
      data.append('pin_code', formData.pin_code);

      if (editingHospital) {
        await api.organization_api.put(`/hospitals/update-hospital/${editingHospital._id}`, formData);
        setToast({ type: 'success', message: 'Hospital updated successfully!' });
      } else {
        data.append('user_password', formData.user_password);
        data.append('user_role', 'hospital');
        data.append('organisation_id', organisationId || '');

        await api.auth_api.post('/auth/register', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ type: 'success', message: 'Hospital Registered successfully!' });
      }

      fetchHospitals();
      resetForm();
      setShowPasswordRules(false);  // Add this
      setPasswordChecks({          // Add this
        length: false,
        numbers: false,
        special: false
      });
    } catch (error) {
      console.error('Error:', error);
      setToast({ type: 'error', message: editingHospital ? 'Update failed' : 'Registration failed' });
    } finally {
      setTimeout(() => setToast(null), 5000);
    }
  };


  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      user_name: hospital.user_name,
      user_password: '',
      user_phone: hospital.user_phone,
      user_email: hospital.user_email,
      city: hospital.city,
      taluk: hospital.taluk,
      district: hospital.district,
      state: hospital.state,
      country: hospital.country,
      pin_code: hospital.pin_code,
    });
  };


  const handleDeleteHospital = (hospitalId: string) => {
    setDeleteHospitalId(hospitalId); // open modal
  };



  const toggleDoctorTable = async (hospitalId: string, orgId: string) => {
    if (showDoctorTableId === hospitalId) {
      setShowDoctorTableId(null);
    } else {
      setShowDoctorTableId(hospitalId);
      try {
        const response = await api.organization_api.get<GetDoctorsResponse>(`/hospitals/doctors/by-org/${orgId}`);
        const allDoctors = response.data.doctors;

        // Group doctors by hospital_id
        const grouped: { [hospitalId: string]: Doctor[] } = {};
        for (const doctor of allDoctors) {
          const hid = doctor.hospital_id;
          if (!grouped[hid]) grouped[hid] = [];
          grouped[hid].push(doctor);
        }

        setDoctorsByHospital(grouped);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    }
  };

  const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files) {
      setDoctorFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setDoctorFormData(prev => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setDoctorFormData({ ...doctorFormData, govt_id_image: e.target.files[0] });
      if (formErrors.govt_id_image) {
        setFormErrors((prev) => ({ ...prev, govt_id_image: '' }));
      }
    }
  };

  const resetDoctorForm = () => {
  setDoctorFormData({
    user_name: '',
    user_password: '',
    user_email: '',
    user_phone: '',
    city: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
    pin_code: '',
    govt_id: '',
    govt_id_image: null,
    hospital_id: '',
    specialization: '',
  });
  setEditingDoctor(null);
  setIsAddingDoctorForHospitalId(null);
  setShowPasswordRules(false);
  setPasswordChecks({
    length: false,
    numbers: false,
    special: false
  });
  setFormErrors({});
};



  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDoctorForm()) return;
    try {
      const data = new FormData();
      data.append('user_name', doctorFormData.user_name);
      data.append('user_email', doctorFormData.user_email);
      data.append('user_phone', doctorFormData.user_phone);
      data.append('city', doctorFormData.city);
      data.append('taluk', doctorFormData.taluk);
      data.append('district', doctorFormData.district);
      data.append('state', doctorFormData.state);
      data.append('country', doctorFormData.country);
      data.append('pin_code', doctorFormData.pin_code);
      data.append('specialization', doctorFormData.specialization);
      data.append('govt_id', doctorFormData.govt_id);
      if (doctorFormData.govt_id_image) {
        data.append('govt_id_image', doctorFormData.govt_id_image);
      }

      if (editingDoctor) {
        await api.organization_api.put(`/hospitals/update-doctor/${editingDoctor._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ type: 'success', message: 'Doctor updated successfully!' });
      } else {
        data.append('user_password', doctorFormData.user_password);
        data.append('user_role', 'doctor');
        data.append('organisation_id', isAddingDoctorForHospitalId || '');
        data.append('hospital_id', doctorFormData.hospital_id || '');
        await api.auth_api.post('/auth/register', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setToast({ type: 'success', message: 'Doctor registered successfully!' });
      }

      setDoctorFormData({
        user_name: '',
        user_password: '',
        user_email: '',
        user_phone: '',
        city: '',
        taluk: '',
        district: '',
        state: '',
        country: '',
        pin_code: '',
        govt_id: '',
        govt_id_image: null,
        hospital_id: '',
        specialization: '',
      });

      setEditingDoctor(null);
      setIsAddingDoctorForHospitalId(null);

      resetDoctorForm(); 
      if (showDoctorTableId) toggleDoctorTable(showDoctorTableId, context?.user?.id || '');

    } catch (error) {
      console.error('Error submitting doctor:', error);
      setToast({
        type: 'error',
        message: editingDoctor ? 'Update failed' : 'Doctor registration failed',
      });
    } finally {
      setTimeout(() => setToast(null), 5000); // auto-dismiss
    }
  };



  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setDoctorFormData({
      user_name: doctor.user_name,
      user_password: '',
      user_email: doctor.user_email,
      user_phone: doctor.user_phone,
      city: doctor.city,
      taluk: doctor.taluk,
      district: doctor.district,
      state: doctor.state,
      country: doctor.country,
      pin_code: doctor.pin_code,
      govt_id: doctor.govt_id,
      govt_id_image: null,
      hospital_id: doctor.hospital_id,
      specialization: doctor.specialization,
    });
    setIsAddingDoctorForHospitalId(doctor.organisation_id);
  };

  const handleDeleteDoctor = (doctorId: string) => {
    setDeleteDoctorId(doctorId); // Open confirmation modal
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


  const handleDoctorLocationClick = () => {
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

        setDoctorFormData((prev) => ({
          ...prev,
          country: address.country || "",
          state: address.state || "",
          district: address.county || address.state_district || "",
          city: address.city || address.town || address.village || "",
          pin_code: address.postcode || "",
          taluk: address.taluk || address.suburb || "",
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
          <button
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Organisation Dashboard</h2>
          <button className="form-button1" onClick={handleLogout}>Logout</button>
        </div>
        <div className="dashboard-content">
          <h2>Hospital List</h2>

          <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>

          {/* Navigation Buttons */}
          <div className={`nav-buttons ${menuOpen ? 'show' : ''}`}>
            <button
              className="form-button contact-button"
              onClick={() => { setIsAddingHospital(true); setMenuOpen(false); }}
            >
              Add New Hospital
            </button>

            <button
              className="form-button contact-button"
              onClick={() => { navigate('/organisation-desc'); setMenuOpen(false); }}
            >
              About
            </button>

            <button
              className="form-button contact-button"
              onClick={() => { navigate('/organisation-img'); setMenuOpen(false); }}
            >
              Gallery
            </button>
          </div>

          {(isAddingHospital || editingHospital) && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="form-container">
                  <h3>{editingHospital ? 'Edit Animal' : 'Add New Hospital'}</h3>
                  <form onSubmit={handleSubmit}>
                    <div className='form-grid'>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.user_name ? 'input-error' : ''}`}
                        value={formData.user_name}
                        onChange={(e) => {
                          setFormData({ ...formData, user_name: e.target.value });

                          if (formErrors.user_name) {
                            setFormErrors((prev) => ({ ...prev, user_name: '' }));
                          }
                        }}

                        placeholder="Name"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.user_name}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.user_email ? 'input-error' : ''}`}
                        value={formData.user_email}
                        onChange={(e) => {
                          setFormData({ ...formData, user_email: e.target.value });

                          if (formErrors.user_email) {
                            setFormErrors((prev) => ({ ...prev, user_email: '' }));
                          }
                        }}
                        placeholder="Email"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.user_email}</span>
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
                        className={`form-input ${formErrors.user_phone ? 'input-error' : ''}`}
                        value={formData.user_phone}
                        onChange={(e) => {
                          setFormData({ ...formData, user_phone: e.target.value });

                          if (formErrors.user_phone) {
                            setFormErrors((prev) => ({ ...prev, user_phone: '' }));
                          }
                        }}

                        placeholder="Phone"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.user_phone}</span>
                      )}
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
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });

                          if (formErrors.city) {
                            setFormErrors((prev) => ({ ...prev, city: '' }));
                          }
                        }}

                        placeholder="City or Village"
                        style={{ flex: 1 }}
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
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.city}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.taluk ? 'input-error' : ''}`}
                        value={formData.taluk}
                        onChange={(e) => {
                          setFormData({ ...formData, taluk: e.target.value });

                          if (formErrors.taluk) {
                            setFormErrors((prev) => ({ ...prev, taluk: '' }));
                          }
                        }}

                        placeholder="Taluk"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.taluk}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.district ? 'input-error' : ''}`}
                        value={formData.district}
                        onChange={(e) => {
                          setFormData({ ...formData, district: e.target.value });

                          if (formErrors.district) {
                            setFormErrors((prev) => ({ ...prev, city: '' }));
                          }
                        }}

                        placeholder="District"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.district}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.state ? 'input-error' : ''}`}
                        value={formData.state}
                        onChange={(e) => {
                          setFormData({ ...formData, state: e.target.value });

                          if (formErrors.state) {
                            setFormErrors((prev) => ({ ...prev, state: '' }));
                          }
                        }}

                        placeholder="State"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.state}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.country ? 'input-error' : ''}`}
                        value={formData.country}
                        onChange={(e) => {
                          setFormData({ ...formData, country: e.target.value });

                          if (formErrors.country) {
                            setFormErrors((prev) => ({ ...prev, country: '' }));
                          }
                        }}

                        placeholder="Country"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.country}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.pin_code ? 'input-error' : ''}`}
                        value={formData.pin_code}
                        onChange={(e) => {
                          setFormData({ ...formData, pin_code: e.target.value });

                          if (formErrors.pin_code) {
                            setFormErrors((prev) => ({ ...prev, pin_code: '' }));
                          }
                        }}

                        placeholder="Pin Code"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.pin_code}</span>
                      )}
                    </div>
                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="form-button">
                        {editingHospital ? 'Update' : 'Add'} Hospital
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

          {isAddingDoctorForHospitalId && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="form-container">
                  <h3>Add New Doctor</h3>
                  <form onSubmit={handleDoctorSubmit}>
                    <div className='form-grid'>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.user_name ? 'input-error' : ''}`}
                        name="user_name"
                        value={doctorFormData.user_name}
                        onChange={handleDoctorInputChange}
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
                        value={doctorFormData.user_password}
                        onChange={(e) => {
                          const newPassword = e.target.value;
                          setDoctorFormData({ ...doctorFormData, user_password: newPassword });
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
                        value={doctorFormData.user_email}
                        onChange={handleDoctorInputChange}
                        placeholder="Email"
                      />
                      {formErrors.user_email && <span className="error-text">{formErrors.user_email}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.user_phone ? 'input-error' : ''}`}
                        name="user_phone"
                        value={doctorFormData.user_phone}
                        onChange={handleDoctorInputChange}
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
                        value={doctorFormData.city}
                        onChange={handleDoctorInputChange}
                        placeholder="City or Village"
                        style={{ flex: 1 }}
                      />
                      <button
                    type="button"
                    onClick={handleDoctorLocationClick}
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
                        value={doctorFormData.taluk}
                        onChange={handleDoctorInputChange}
                        placeholder="Taluk"
                      />
                      {formErrors.taluk && <span className="error-text">{formErrors.taluk}</span>}
                    </div>

                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.district ? 'input-error' : ''}`}
                        name="district"
                        value={doctorFormData.district}
                        onChange={handleDoctorInputChange}
                        placeholder="District"
                      />
                      {formErrors.district && <span className="error-text">{formErrors.district}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.state ? 'input-error' : ''}`}
                        name="state"
                        value={doctorFormData.state}
                        onChange={handleDoctorInputChange}
                        placeholder="State"
                      />
                      {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.country ? 'input-error' : ''}`}
                        name="country"
                        value={doctorFormData.country}
                        onChange={handleDoctorInputChange}
                        placeholder="Country"
                      />
                      {formErrors.country && <span className="error-text">{formErrors.country}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.pin_code ? 'input-error' : ''}`}
                        name="pin_code"
                        value={doctorFormData.pin_code}
                        onChange={handleDoctorInputChange}
                        placeholder="Pin Code"
                      />
                      {formErrors.pin_code && <span className="error-text">{formErrors.pin_code}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.specialization ? 'input-error' : ''}`}
                        name="specialization"
                        value={doctorFormData.specialization}
                        onChange={handleDoctorInputChange}
                        placeholder="Specialization"
                      />
                      {formErrors.specialization && <span className="error-text">{formErrors.specialization}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.govt_id ? 'input-error' : ''}`}
                        name="govt_id"
                        value={doctorFormData.govt_id}
                        onChange={handleDoctorInputChange}
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
                    </div>
                    
                    <div className="form-buttons">
                      <button type="submit" className="form-button">Add Doctor</button>
                      <button
                        type="button"
                        className="form-button cancel-button"
                        onClick={() => setIsAddingDoctorForHospitalId(null)}
                      >
                        Cancel
                      </button>
                      
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}


          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Hospital Phone number</th>
                  <th>Hospital Email</th>
                  <th>Hospital Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Hospitals.map((hospital) => (
                  <React.Fragment key={hospital._id}>
                    <tr>
                      <td data-label="User Name">{hospital.user_name}</td>
                      <td data-label="Phone">{hospital.user_phone}</td>
                      <td data-label="Email">{hospital.user_email}</td>
                      <td data-label="Location">{hospital.city}, {hospital.taluk},<br /> {hospital.district},{hospital.state},<br /> {hospital.country} - {hospital.pin_code}</td>

                      <td data-label="Action">
                        <button
                          className="action-button edit"
                          onClick={() => toggleDoctorTable(hospital._id, hospital.organisation_id)}
                        >
                          {showDoctorTableId === hospital._id ? 'Hide Doctors' : 'View Doctors'}
                        </button>

                        <button
                          className="action-button edit"
                          onClick={() => handleEdit(hospital)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDeleteHospital(hospital._id)}
                        >
                          Delete
                        </button>

                      </td>
                    </tr>

                    {deleteHospitalId && (
                      <div className="modal-overlay">
                        <div className="modal">
                          <h3>Confirm Deletion</h3>
                          <p>Are you sure you want to delete this hospital?</p>
                          <div className="form-buttons">
                            <button
                              className="form-button"
                              onClick={async () => {
                                try {
                                  await api.organization_api.delete(`/hospitals/delete-hospital/${deleteHospitalId}`);
                                  setToast({ type: 'success', message: 'Hospital deleted successfully' });
                                  fetchHospitals();
                                } catch (error) {
                                  console.error("Error deleting hospital:", error);
                                  setToast({ type: 'error', message: 'Failed to delete hospital' });
                                } finally {
                                  setDeleteHospitalId(null);
                                  setTimeout(() => setToast(null), 5000);
                                }
                              }}
                            >
                              Yes, Delete
                            </button>
                            <button className="form-button cancel-button" onClick={() => setDeleteHospitalId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}


                    {deleteDoctorId && (
                      <div className="modal-overlay">
                        <div className="modal">
                          <h3>Confirm Deletion</h3>
                          <p>Are you sure you want to delete this doctor?</p>
                          <div className="form-buttons">
                            <button
                              className="form-button"
                              onClick={async () => {
                                try {
                                  await api.organization_api.delete(`/hospitals/delete-doctor/${deleteDoctorId}`);
                                  setToast({ type: 'success', message: 'Doctor deleted successfully' });

                                  // Refresh doctor list
                                  if (showDoctorTableId) {
                                    const orgId = context?.user?.id || '';
                                    const response = await api.organization_api.get<GetDoctorsResponse>(`/hospitals/doctors/by-org/${orgId}`);
                                    const grouped: { [hospitalId: string]: Doctor[] } = {};
                                    for (const doctor of response.data.doctors) {
                                      if (!grouped[doctor.hospital_id]) grouped[doctor.hospital_id] = [];
                                      grouped[doctor.hospital_id].push(doctor);
                                    }
                                    setDoctorsByHospital(grouped);
                                  }
                                } catch (err) {
                                  console.error("Error deleting doctor:", err);
                                  setToast({ type: 'error', message: 'Failed to delete doctor' });
                                } finally {
                                  setDeleteDoctorId(null);
                                  setTimeout(() => setToast(null), 5000);
                                }
                              }}
                            >
                              Yes, Delete
                            </button>
                            <button className="form-button cancel-button" onClick={() => setDeleteDoctorId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}



                    {showDoctorTableId === hospital._id && (
                      <tr>
                        <td colSpan={6}>
                          <div className="sub-table-container">
                            <div className='animals-header'>
                              <h3>Doctor's</h3>
                              <button
                                className="action-button add"
                                // onClick={() => setIsAddingDoctorForHospitalId(hospital.organisation_id)}
                                onClick={() => {
                                  setDoctorFormData(prev => ({ ...prev, hospital_id: hospital._id }));
                                  setIsAddingDoctorForHospitalId(hospital.organisation_id);
                                }}
                              >
                                Add Doctor
                              </button>
                            </div>
                            <table className="data-table">
                              <thead>
                                <tr>
                                  {/* <th>Organisation ID</th> */}
                                  <th>Doctor Name</th>
                                  <th>Email</th>
                                  <th>Phone</th>
                                  <th>Specialization</th>
                                  <th>Address</th>
                                  <th> Governament ID</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* {(doctorListByOrg[hospital.organisation_id] || []).map((doctor) => ( */}
                                {(doctorsByHospital[hospital._id] || []).map((doctor) => (
                                  <tr key={doctor._id}>
                                    {/* <td>{doctor.organisation_id}</td> */}
                                    <td data-label="User Name">{doctor.user_name}</td>
                                    <td data-label="Email">{doctor.user_email}</td>
                                    <td data-label="Phone">{doctor.user_phone}</td>
                                    <td data-label="Specialization">{doctor.specialization}</td>
                                    <td data-label="Location">{doctor.city}, {doctor.taluk},<br /> {doctor.district},{doctor.state},<br /> {doctor.country} - {doctor.pin_code} </td>
                                    <td data-label="Id Image">{<img
                                      // src={`http://localhost:5000/uploads/${doctor.govt_id_image}`}
                                      src={`${process.env.REACT_APP_MEDIA_URL}${doctor.govt_id_image}`}
                                      alt={'Governament ID Image'}
                                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px", }}
                                    />}</td>

                                    <td data-label="Action">
                                      <button className="action-button edit" onClick={() => handleEditDoctor(doctor)}>Edit</button>
                                      <button className="action-button delete" onClick={() => handleDeleteDoctor(doctor._id)}>Delete</button>
                                    </td>
                                  </tr>
                                ))}

                                {(!doctorsByHospital[hospital._id] || doctorsByHospital[hospital._id].length === 0) && (
                                  <tr>
                                    <td colSpan={6} style={{ textAlign: 'center' }}>No doctors found.</td>
                                  </tr>
                                )}

                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationDashboard;
