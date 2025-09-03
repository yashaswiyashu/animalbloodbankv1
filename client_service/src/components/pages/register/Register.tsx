import React, { useState } from 'react';
import api from '../../../api/axiosConfig';
import { Link } from 'react-router-dom';
import '../../../styles/forms.css';
import Navbar from '../homePage/Navbar';
import TopBar from '../homePage/TopBar';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import BiotechIcon from '@mui/icons-material/Biotech';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import StorefrontIcon from '@mui/icons-material/Storefront';
import gps from '../../assets/gps.png'

const roles = ["doctor", "hospital", "pharmacy", "lab", "organisation", "vendor", "Animal Enthusiasts"];
// const roles = ["doctor", "hospital",  "organisation", "Animal Enthusiasts"];

const Register: React.FC = () => {
  const [accountType, setAccountType] = useState<'Prani Experts' | 'Prani Guardian'>('Prani Experts');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    numbers: false,
    special: false
  });




  const initialFormState = {
    user_name: '',
    user_email: '',
    user_password: '',
    user_role: '',
    user_phone: '',
    city: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
    pin_code: '',
    specialization: '',
    govt_id: '',
    gst_number: '',
    govt_id_image: null as File | null,
    farmer_name: '',
    farmer_password: '',
    farmer_phone: '',
    farmer_city: '',
    farmer_taluk: '',
    farmer_district: '',
    farmer_state: '',
    farmer_country: '',
    farmer_pin_code: '',
  };

  const [form, setForm] = useState(initialFormState);
  // setForm(initialFormState);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setForm({ ...form, govt_id_image: e.target.files[0] });
    }
  };


  // const handleRegister = async () => {
  //   try {
  //     if (accountType === 'Prani Experts') {
  //       const formData = new FormData();
  //       Object.entries(form).forEach(([key, value]) => {
  //         if (
  //           value !== null &&
  //           (
  //             key.startsWith('user_') ||
  //             ['govt_id', 'specialization' , 'gst_number', 'govt_id_image', 'city', 'taluk', 'district', 'state', 'country', 'pin_code'].includes(key)
  //             // (key.startsWith('user_') || key === 'govt_id' || key === 'gst_number' || key === 'govt_id_image' || key ==='specialization')
  //           )
  //         ) {
  //           formData.append(key, value as string | Blob);
  //         }
  //       });

  //       await api.auth_api.post('/auth/register', formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' }
  //       });

  //       alert('Registered successfully!');
  //     } else {
  //       await api.auth_api.post('/auth/registerFarmer', {
  //         farmer_name: form.farmer_name,
  //         farmer_password: form.farmer_password,
  //         farmer_phone: form.farmer_phone,
  //         farmer_city: form.farmer_city,
  //         farmer_taluk: form.farmer_taluk,
  //         farmer_district: form.farmer_district,
  //         farmer_state: form.farmer_state,
  //         farmer_country: form.farmer_country,
  //         farmer_pin_code: form.farmer_pin_code,
  //         farmer_role: 'farmer'
  //       });

  //       alert('Farmer Registered!');
  //     }

  //     // ✅ Clear form
  //     setForm(initialFormState);

  //   } catch (error) {
  //     alert('Registration failed');
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

    // auto-hide if all satisfied
    // if (allPassed) {
    //   setShowPasswordRules(false);
    // }
  };




  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (accountType === 'Prani Experts') {
      if (!form.user_name?.trim()) errors.user_name = 'Name is required';
      if (!form.user_password?.trim()) errors.user_password = 'Password is required';
      if (!/\S+@\S+\.\S+/.test(form.user_email)) errors.user_email = 'Invalid email format';
      if (!/^\d{10}$/.test(form.user_phone)) errors.user_phone = 'Phone Number must be 10 digits';
      if (!form.city?.trim()) errors.city = 'City is required';
      if (!form.taluk?.trim()) errors.taluk = 'Taluk is required';
      if (!form.district?.trim()) errors.district = 'District is required';
      if (!form.state?.trim()) errors.state = 'State is required';
      if (!form.country?.trim()) errors.country = 'Country is required';
      if (!/^\d{6}$/.test(form.pin_code)) errors.pin_code = 'PIN Code must be 6 digits';

      if (!passwordChecks.length || !passwordChecks.numbers || !passwordChecks.special) {
        errors.user_password = 'Password must satisfy all strength rules';
      }


      if (form.user_role === 'doctor') {
        if (!form.specialization?.trim()) errors.specialization = 'Specialization is required';
        if (!form.govt_id?.trim()) errors.govt_id = 'Government ID is required';
        if (!form.govt_id_image) errors.govt_id_image = 'Government ID image is required';
      }

      if (form.user_role === 'lab') {
        if (!form.gst_number?.trim()) errors.gst_number = 'GST number is required';
      }
    } else if (accountType === 'Prani Guardian') {
      if (!form.farmer_name?.trim()) errors.farmer_name = 'Farmer name is required';
      if (!form.farmer_password?.trim()) errors.farmer_password = 'Password is required';
      if (!/^\d{10}$/.test(form.farmer_phone)) errors.farmer_phone = 'Phone must be 10 digits';
      if (!form.farmer_city?.trim()) errors.farmer_city = 'City is required';
      if (!form.farmer_taluk?.trim()) errors.farmer_taluk = 'Taluk is required';
      if (!form.farmer_district?.trim()) errors.farmer_district = 'District is required';
      if (!form.farmer_state?.trim()) errors.farmer_state = 'State is required';
      if (!form.farmer_country?.trim()) errors.farmer_country = 'Country is required';
      if (!/^\d{6}$/.test(form.farmer_pin_code)) errors.farmer_pin_code = 'PIN Code must be 6 digits';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };


  const handleRegister = async () => {
    try {
      const isValid = validateForm();
      if (!isValid) return;

      if (accountType === 'Prani Experts') {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (
            value !== null &&
            (
              key.startsWith('user_') ||
              ['govt_id', 'specialization', 'gst_number', 'govt_id_image', 'city', 'taluk', 'district', 'state', 'country', 'pin_code'].includes(key)
            )
          ) {
            formData.append(key, value as string | Blob);
          }
        });

        await api.auth_api.post('/auth/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setToast({ type: 'success', message: 'Registered successfully!' });
      } else {
        await api.auth_api.post('/auth/registerFarmer', {
          farmer_name: form.farmer_name,
          farmer_password: form.farmer_password,
          farmer_phone: form.farmer_phone,
          farmer_city: form.farmer_city,
          farmer_taluk: form.farmer_taluk,
          farmer_district: form.farmer_district,
          farmer_state: form.farmer_state,
          farmer_country: form.farmer_country,
          farmer_pin_code: form.farmer_pin_code,
          farmer_role: 'farmer'
        });

        setToast({ type: 'success', message: 'Farmer Registered!' });
      }

      setForm(initialFormState);
      setShowPasswordRules(false);
      setPasswordChecks({
        length: false,
        numbers: false,
        special: false
      });
    } catch (error) {
      setToast({ type: 'error', message: 'Registration failed. Please try again.' });
    } finally {
      setTimeout(() => setToast(null), 5000); // auto-close after 5s
    }
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

        if (accountType === "Prani Experts") {
          setForm((prev) => ({
            ...prev,
            country: address.country || "",
            state: address.state || "",
            district: address.county || address.state_district || "",
            city: address.city || address.town || address.village || "",
            pin_code: address.postcode || "",
            taluk: address.taluk || address.suburb || address.neighbourhood || "",
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            farmer_country: address.country || "",
            farmer_state: address.state || "",
            farmer_district: address.county || address.state_district || "",
            farmer_city: address.city || address.town || address.village || "",
            farmer_pin_code: address.postcode || "",
            farmer_taluk: address.taluk || address.suburb || address.neighbourhood || "",
          }));
        }
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
    <>
      {/* <TopBar /> */}
      <Navbar />

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

      <div className="center-page-lr">
        <div className="form-container">
          <h2 className="form-title">Register</h2>

          {/* Account Type Selection */}
          <div className="form-group animated-toggle">
            {['Prani Experts', 'Prani Guardian'].map((type) => (
              <div
                key={type}
                className={`toggle-tile ${accountType === type ? 'active' : ''}`}
                onClick={() => setAccountType(type as 'Prani Experts' | 'Prani Guardian')}
              >
                {type === 'Prani Experts' ? 'Prani Experts' : 'Prani Guardian'}
              </div>
            ))}
          </div>





          {/* User Registration Form */}
          {accountType === 'Prani Experts' && (
            <>
              {/* Role Selection */}
              <div className="form-group creative-role-grid">
                {roles.map((role) => (
                  <div
                    key={role}
                    className={`creative-card ${form.user_role === role ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, user_role: role })}
                  >
                    <div className="creative-icon">
                      {role === "doctor" ? (
                        <PersonIcon />
                      ) : role === "hospital" ? (
                        <LocalHospitalIcon />
                      ) : role === "pharmacy" ? (
                        <VaccinesIcon />
                      ) : role === "lab" ? (
                        <BiotechIcon />
                      ) : role === "organisation" ? (
                        <CorporateFareIcon />
                      ) : role === "vendor" ? (
                        <StorefrontIcon />
                      ) : (
                        <PersonIcon />
                      )}
                    </div>
                    &nbsp;
                    &nbsp;
                    <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  </div>
                ))}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.user_name ? 'input-error' : ''}`}
                    value={form.user_name}
                    onChange={(e) => {
                      setForm({ ...form, user_name: e.target.value });

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
                    value={form.user_email}
                    onChange={(e) => {
                      setForm({ ...form, user_email: e.target.value });

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
                    value={form.user_password}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      setForm({ ...form, user_password: newPassword });
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
                    value={form.user_phone}
                    onChange={(e) => {
                      setForm({ ...form, user_phone: e.target.value });

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
                    value={form.city}
                    onChange={(e) => {
                      setForm({ ...form, city: e.target.value });

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
                    value={form.taluk}
                    onChange={(e) => {
                      setForm({ ...form, taluk: e.target.value });

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
                    value={form.district}
                    onChange={(e) => {
                      setForm({ ...form, district: e.target.value });

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
                    value={form.state}
                    onChange={(e) => {
                      setForm({ ...form, state: e.target.value });

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
                    value={form.country}
                    onChange={(e) => {
                      setForm({ ...form, country: e.target.value });

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
                    value={form.pin_code}
                    onChange={(e) => {
                      setForm({ ...form, pin_code: e.target.value });

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

                {form.user_role === 'doctor' && (
                  <>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.specialization ? 'input-error' : ''}`}
                        value={form.specialization}
                        onChange={(e) => {
                          setForm({ ...form, specialization: e.target.value });

                          if (formErrors.specialization) {
                            setFormErrors((prev) => ({ ...prev, specialization: '' }));
                          }
                        }}

                        placeholder="specialization"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.specialization}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        className={`form-input ${formErrors.govt_id ? 'input-error' : ''}`}
                        value={form.govt_id}
                        onChange={(e) => {
                          setForm({ ...form, govt_id: e.target.value });

                          if (formErrors.govt_id) {
                            setFormErrors((prev) => ({ ...prev, govt_id: '' }));
                          }
                        }}

                        placeholder="Government ID"
                      />
                      {formErrors.user_name && (
                        <span className="error-text">{formErrors.govt_id}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </>
                )}

                {form.user_role === 'lab' && (
                  <div className="form-group">
                    <input
                      className={`form-input ${formErrors.gst_number ? 'input-error' : ''}`}
                      value={form.gst_number}
                      onChange={(e) => {
                        setForm({ ...form, gst_number: e.target.value });

                        if (formErrors.gst_number) {
                          setFormErrors((prev) => ({ ...prev, gst_number: '' }));
                        }
                      }}

                      placeholder="GST Number"
                    />
                    {formErrors.user_name && (
                      <span className="error-text">{formErrors.gst_number}</span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Farmer Registration Form */}
          {accountType === 'Prani Guardian' && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_name ? 'input-error' : ''}`}
                    value={form.farmer_name}
                    onChange={(e) => {
                      setForm({ ...form, farmer_name: e.target.value });

                      if (formErrors.farmer_name) {
                        setFormErrors((prev) => ({ ...prev, farmer_name: '' }));
                      }
                    }}

                    placeholder="Name"
                  />
                  {formErrors.farmer_name && (
                    <span className="error-text">{formErrors.farmer_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_password ? 'input-error' : ''}`}
                    type="password"
                    value={form.farmer_password}
                    onChange={(e) => {
                      setForm({ ...form, farmer_password: e.target.value });

                      if (formErrors.farmer_password) {
                        setFormErrors((prev) => ({ ...prev, farmer_password: '' }));
                      }
                    }}

                    placeholder="Password"
                  />
                  {formErrors.farmer_password && (
                    <span className="error-text">{formErrors.farmer_password}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_phone ? 'input-error' : ''}`}
                    value={form.farmer_phone}
                    onChange={(e) => {
                      setForm({ ...form, farmer_phone: e.target.value });

                      if (formErrors.farmer_phone) {
                        setFormErrors((prev) => ({ ...prev, farmer_phone: '' }));
                      }
                    }}

                    placeholder="Phone"
                  />
                  {formErrors.farmer_phone && (
                    <span className="error-text">{formErrors.farmer_phone}</span>
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
                    className={`form-input ${formErrors.farmer_city ? 'input-error' : ''}`}
                    value={form.farmer_city}
                    onChange={(e) => {
                      setForm({ ...form, farmer_city: e.target.value });

                      if (formErrors.farmer_city) {
                        setFormErrors((prev) => ({ ...prev, farmer_city: '' }));
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
                  {formErrors.farmer_city && (
                    <span className="error-text">{formErrors.farmer_city}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_taluk ? 'input-error' : ''}`}
                    value={form.farmer_taluk}
                    onChange={(e) => {
                      setForm({ ...form, farmer_taluk: e.target.value });

                      if (formErrors.farmer_taluk) {
                        setFormErrors((prev) => ({ ...prev, farmer_taluk: '' }));
                      }
                    }}

                    placeholder="Taluk"
                  />
                  {formErrors.farmer_taluk && (
                    <span className="error-text">{formErrors.farmer_taluk}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_district ? 'input-error' : ''}`}
                    value={form.farmer_district}
                    onChange={(e) => {
                      setForm({ ...form, farmer_district: e.target.value });

                      if (formErrors.farmer_district) {
                        setFormErrors((prev) => ({ ...prev, farmer_district: '' }));
                      }
                    }}

                    placeholder="District"
                  />
                  {formErrors.farmer_district && (
                    <span className="error-text">{formErrors.farmer_district}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_state ? 'input-error' : ''}`}
                    value={form.farmer_state}
                    onChange={(e) => {
                      setForm({ ...form, farmer_state: e.target.value });

                      if (formErrors.farmer_state) {
                        setFormErrors((prev) => ({ ...prev, farmer_state: '' }));
                      }
                    }}

                    placeholder="State"
                  />
                  {formErrors.farmer_district && (
                    <span className="error-text">{formErrors.farmer_state}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_country ? 'input-error' : ''}`}
                    value={form.farmer_country}
                    onChange={(e) => {
                      setForm({ ...form, farmer_country: e.target.value });

                      if (formErrors.farmer_country) {
                        setFormErrors((prev) => ({ ...prev, farmer_country: '' }));
                      }
                    }}

                    placeholder="Country"
                  />
                  {formErrors.farmer_country && (
                    <span className="error-text">{formErrors.farmer_country}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className={`form-input ${formErrors.farmer_pin_code ? 'input-error' : ''}`}
                    value={form.farmer_pin_code}
                    onChange={(e) => {
                      setForm({ ...form, farmer_pin_code: e.target.value });

                      if (formErrors.farmer_pin_code) {
                        setFormErrors((prev) => ({ ...prev, farmer_pin_code: '' }));
                      }
                    }}

                    placeholder="Pin Code"
                  />
                  {formErrors.farmer_pin_code && (
                    <span className="error-text">{formErrors.farmer_pin_code}</span>
                  )}
                </div>
              </div>
            </>
          )}

          <button className="form-button" onClick={handleRegister}>
            Register
          </button>

          <div className="form-footer">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>


        </div>
      </div>
    </>
  );
};

export default Register;
