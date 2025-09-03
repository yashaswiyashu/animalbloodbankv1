import React, { useEffect, useState, useContext } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../../styles/forms.css';
import '../../../styles/dashboard.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import safron from '../../assets/safron_Strip.jpeg'
import green from '../../assets/green_Strip.jpeg'
import qr from '../../assets/qr-aadhar.jpeg'
import logo from '../../../assets/Logo.png'
import { CheckBox } from '@mui/icons-material';
import gps from '../../assets/gps.png'

interface Animal {
  _id: string;
  type: string;
  species: string;
  breed: string;
  name: string;
  age: number;
  bloodGroup: string;
  // location: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  praniAadharNumber: string;
  farmerId: string;
  animalImage: File | null;

}

interface AnimalFormData {
  type: string;
  species: string;
  breed: string;
  name: string;
  age: string;
  bloodGroup: string;
  // location: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
  animalImage: File | null;
}

interface GetAnimalsResponse {
  message: string;
  animals: Animal[];
}

interface FeedbackResponse {
  description: string;
  fileUrl: string;
  originalFileName: string;
}

const FarmerDashboard: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isAddingAnimal, setIsAddingAnimal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse[] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showAadharModal, setShowAadharModal] = useState(false)
  const [farmer, setFarmer] = useState("");
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [animalWeight, setAnimalWeight] = useState('');
  const [addHealthRecord, setAddHealthRecord] = useState(false);
  const [confirmDonor, setConfirmDonor] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showBloodRequestModal, setShowBloodRequestModal] = useState(false);
  const [bloodQuantity, setBloodQuantity] = useState('');
  const [bloodReason, setBloodReason] = useState('');
  const [bloodImage, setBloodImage] = useState<File | null>(null);


  const [fetchedHealthRecord, setFetchedHealthRecord] = useState<{ description: string; fileUrl?: string } | null>(null);
  const [showHealthPopup, setShowHealthPopup] = useState(false);







  const [formData, setFormData] = useState<AnimalFormData>({
    type: '',
    species: '',
    breed: '',
    name: '',
    age: '',
    bloodGroup: '',
    city: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
    pin_code: '',
    animalImage: null,
  });

  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchAnimals = async () => {
    try {
      const res = await api.farmer_api.get<GetAnimalsResponse>('/animal/get-animals');
      setAnimals(res.data.animals);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate('/login');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const feedbackCardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px',
    marginTop:'15px',
    backgroundColor: '#f5f5f5',
  };

  const resetForm = () => {
    setFormData({
      type: '',
      species: '',
      breed: '',
      name: '',
      age: '',
      bloodGroup: '',
      city: '',
      taluk: '',
      district: '',
      state: '',
      country: '',
      pin_code: '',
      animalImage: null,
    });
    setIsAddingAnimal(false);
    setEditingAnimal(null);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     if (editingAnimal) {
  //       await api.farmer_api.put(`/animal/update/${editingAnimal.praniAadharNumber}`, formData);
  //     } else {
  //       await api.farmer_api.post('/animal/add', formData);
  //     }
  //     await fetchAnimals();
  //     resetForm();
  //   } catch (error) {
  //     console.error('Error saving animal:', error);
  //     alert('Failed to save animal');
  //   }
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare FormData for multipart/form-data upload
      const data = new FormData();
      data.append("type", formData.type);
      data.append("species", formData.species);
      data.append("breed", formData.breed);
      data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("bloodGroup", formData.bloodGroup);
      data.append("city", formData.city);
      data.append("taluk", formData.taluk);
      data.append("district", formData.district);
      data.append("state", formData.state);
      data.append("country", formData.country);
      data.append("pin_code", formData.pin_code);

      // ✅ Add image file
      if (formData.animalImage) {
        data.append("animalImage", formData.animalImage);
      } else {
        alert("Please upload an animal image.");
        return;
      }

      if (editingAnimal) {
        await api.farmer_api.put(`/animal/update/${editingAnimal.praniAadharNumber}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setToast({ type: 'success', message: 'Animal updated successfully!' });
      } else {
        await api.farmer_api.post('/animal/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setToast({ type: 'success', message: 'Animal registered successfully!' });
      }

      await fetchAnimals();
      resetForm();
    } catch (error) {
      console.error('Error saving animal:', error);
      setToast({ type: 'error', message: 'failed to Add Animal. Please try again.' });
    } finally {
      setTimeout(() => setToast(null), 5000)
    }
  };


  // const handleDelete = async (praniAadharNumber: string) => {
  //   if (window.confirm('Are you sure you want to delete this animal?')) {
  //     try {
  //       await api.farmer_api.delete(`/animal/${praniAadharNumber}`);
  //       await fetchAnimals();
  //     } catch (error) {
  //       console.error('Error deleting animal:', error);
  //       alert('Failed to delete animal');
  //     }
  //   }
  // };

  const handleDelete = (praniAadharNumber: string) => {
    setAnimalToDelete(praniAadharNumber); // open confirmation modal
  };


  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setFormData({
      type: animal.type,
      species: animal.species,
      breed: animal.breed,
      name: animal.name,
      age: animal.age.toString(),
      bloodGroup: animal.bloodGroup,
      city: animal.city,
      taluk: animal.taluk,
      district: animal.district,
      state: animal.state,
      country: animal.country,
      pin_code: animal.pin_code,
      animalImage: animal.animalImage,
    });
  };

  const fetchFeedback = async (praniAadharNumber: string) => {
    try {
      const response = await api.farmer_api.get<FeedbackResponse[]>(`/feedback/${praniAadharNumber}`);
      setFeedback(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedback(null); // Clear feedback if not found
    }
  };

  const handleDonorSubmit = async () => {
    if (!selectedAnimal || !animalWeight || !confirmDonor) {
      alert("Please complete the form properly.");
      return;
    }

    try {
      const donorData = new FormData();
      donorData.append("praniAadharNumber", selectedAnimal.praniAadharNumber);
      donorData.append("weight", animalWeight);
      donorData.append("species", selectedAnimal.species);
      donorData.append("breed", selectedAnimal.breed);
      donorData.append("age", selectedAnimal.age.toString());
      donorData.append("bloodGroup", selectedAnimal.bloodGroup);
      donorData.append("location", `${selectedAnimal.city}, ${selectedAnimal.taluk}, ${selectedAnimal.district}, ${selectedAnimal.state}, ${selectedAnimal.country}, ${selectedAnimal.pin_code}`);

      if (selectedAnimal.animalImage instanceof File) {
        donorData.append("image", selectedAnimal.animalImage);
      } else if (typeof selectedAnimal.animalImage === 'string') {
        donorData.append("imageUrl", selectedAnimal.animalImage);
      }

      if (addHealthRecord && fetchedHealthRecord) {
        donorData.append("addHealthRecord", "true");
        donorData.append("healthDescription", fetchedHealthRecord.description);
        if (fetchedHealthRecord.fileUrl) {
          donorData.append("healthFileUrl", fetchedHealthRecord.fileUrl);
        }
      }

      await api.admin_api.post("/donor/add", donorData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setToast({ type: "success", message: "Donor request submitted successfully!" });
    } catch (error) {
      console.error("Error submitting donor info:", error);
      setToast({ type: "error", message: "Failed to submit donor request." });
    } finally {
      resetDonorForm();
      setShowDonorModal(false);
      setAnimalWeight('');
      setAddHealthRecord(false);
      setConfirmDonor(false);
      setTimeout(() => setToast(null), 5000);
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

  const resetDonorForm = () => {
    setAnimalWeight('');
    setAddHealthRecord(false);
    setConfirmDonor(false);
    setFetchedHealthRecord(null);
    setShowHealthPopup(false);
  };


  const handleBloodTypingRequest = (animal: Animal) => {
    navigate('/labs', { state: { animal } }); // ✅ Send animal to LabList
  };

  const formatPraniAadhar = (aadhar: string) => {
    if (!aadhar) return null;

    const numericPart = aadhar.slice(0, -1);
    const lastChar = aadhar.slice(-1);

    // Group every 4 digits with a space (like: 1234 5678 9012 345)
    const spaced = numericPart.match(/.{1,4}/g)?.join(' ') || numericPart;

    return (
      <>
        {spaced}
        <span className="highlight-letter">{lastChar}</span>
      </>
    );
  };


  const handleSubmitBloodRequest = async () => {
    if (!bloodQuantity || !bloodReason) {
      alert('Please enter quantity and reason');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('praniAadharNumber', selectedAnimal?.praniAadharNumber || '');
      formData.append('quantity', bloodQuantity);
      formData.append('reason', bloodReason);
      formData.append('species', selectedAnimal?.species || '');
      formData.append('breed', selectedAnimal?.breed || '');
      formData.append('age', String(selectedAnimal?.age || ''));
      formData.append('bloodGroup', selectedAnimal?.bloodGroup || '');
      // formData.append('location', selectedAnimal?.location || '');
      formData.append("location", `${selectedAnimal?.city}, ${selectedAnimal?.taluk}, ${selectedAnimal?.district}, ${selectedAnimal?.state}, ${selectedAnimal?.country}, ${selectedAnimal?.pin_code}`);

      if (bloodImage) {
        formData.append('image', bloodImage);
      }

      if (addHealthRecord && fetchedHealthRecord) {
        formData.append('healthDescription', fetchedHealthRecord.description);
        if (fetchedHealthRecord.fileUrl) {
          formData.append('healthFileUrl', fetchedHealthRecord.fileUrl);
        }
      }

      await api.doctor_api.post('/bloodrequest/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ type: "success", message: "Blood request submitted successfully!" });
      resetBloodRequestForm();
      setShowBloodRequestModal(false);
    } catch (err) {
      console.error('Error submitting request:', err);
      setToast({ type: "error", message: "Submission Failed!" });
    }
  };

  const resetBloodRequestForm = () => {
    setBloodQuantity('');
    setBloodReason('');
    setBloodImage(null);
    setAddHealthRecord(false);
    setFetchedHealthRecord(null);
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
          {/* Burger Menu */}
          <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>
          <div className="dashboard-logo">
            <img src={logo} />
          </div>
          <h2>Pet Owner Dashboard</h2>
          <button className="form-button1" onClick={handleLogout}>Logout</button>
        </div>
        <div className="dashboard-content">

          {/* Navigation Buttons */}
          <div className={`nav-buttons ${menuOpen ? 'show' : ''}`}>
            <button className="form-button contact-button" onClick={() => { setIsAddingAnimal(true); setMenuOpen(false); }}>
              Add New Animal
            </button>

            <button className="form-button contact-button" onClick={() => { navigate('/formar-hospital-list'); setMenuOpen(false); }}>
              Hospital List
            </button>
            <button className="form-button contact-button" onClick={() => { navigate('/my-bookings'); setMenuOpen(false); }}>
              My Bookings
            </button>
          </div>

          {(isAddingAnimal || editingAnimal) && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="form-container">
                  <h3>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</h3>
                  <form onSubmit={handleSubmit}>
                    <div className='form-grid'>
                      <div className="form-group">
                        <select
                          name="type"
                          className="form-select"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: '120%',
                            height: '4rem',
                            padding: '1rem',
                            borderRadius: '12px',
                            fontSize: '16px',
                            backgroundColor: '#f9f9f9',
                            color: '#222',
                          }}
                        >
                          <option value='' disabled>Select type</option>
                          <option value="Vet">Vet</option>
                          <option value="Pet">Pet</option>
                        </select>
                      </div>


                      <div className="form-group">
                        <input
                          className="form-input"
                          name="species"
                          value={formData.species}
                          onChange={handleInputChange}
                          placeholder="Species"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="breed"
                          value={formData.breed}
                          onChange={handleInputChange}
                          placeholder="Breed"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Animal Name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="Age"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          placeholder="Blood Group"
                          required
                        />
                      </div>

                      <div
                        className="form-group"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px', // spacing between input and icon
                        }}
                      >
                        <input
                          className="form-input"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                          style={{ flex: 1 }} // 👈 input takes full space
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
                      </div>

                      <div className="form-group">
                        <input
                          className="form-input"
                          name="taluk"
                          value={formData.taluk}
                          onChange={handleInputChange}
                          placeholder="Taluk"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          placeholder="District"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Country"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          className="form-input"
                          name="pin_code"
                          value={formData.pin_code}
                          onChange={handleInputChange}
                          placeholder="Pin code"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ marginBottom: '6px', display: 'block', fontWeight: 500 }}>
                          Add Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment" // allows camera usage on mobile
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData((prev) => ({
                                ...prev,
                                animalImage: file,
                              }));
                            }
                          }}
                          style={{
                            padding: '10px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                          }}
                        />
                      </div>

                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="form-button">
                        {editingAnimal ? 'Update' : 'Add'} Animal
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
                  {/* <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <select className="form-select1" name="type" value={formData.type} onChange={handleInputChange} required>
                          <option value="" disabled>Select type</option>
                          <option value="Vet">Vet</option>
                          <option value="Pet">Pet</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="species" value={formData.species} onChange={handleInputChange} placeholder="Species" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="breed" value={formData.breed} onChange={handleInputChange} placeholder="Breed" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="Animal Name" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Age" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} placeholder="Blood Group" />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="city" value={formData.city} onChange={handleInputChange} placeholder="City or Village" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="taluk" value={formData.taluk} onChange={handleInputChange} placeholder="Taluk" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" required />
                      </div>

                      <div className="form-group">
                        <input className="form-input" name="pin_code" value={formData.pin_code} onChange={handleInputChange} placeholder="Pin Code" required />
                      </div>

                      <div className="form-group full-width">
                        <label>Add Image</label>
                        <input
                          type="file"
                          accept="image/*"

                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData((prev) => ({ ...prev, animalImage: file }));
                            }
                          }}
                          style={{
                            padding: '10px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-buttons">
                      <button type="submit" className="form-button">{editingAnimal ? 'Update' : 'Add'} Animal</button>
                      <button type="button" className="form-button cancel-button" onClick={resetForm}>Cancel</button>
                    </div>
                  </form> */}

                </div>
              </div>
            </div>
          )}

          {showHealthModal && selectedAnimal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 style={{ marginBottom: '10px' }}>
                  Health Record for {selectedAnimal.species}
                </h3>
                <p><strong>Animal ID:</strong> {selectedAnimal.praniAadharNumber}</p>
                <p><strong>Animal:</strong> {selectedAnimal.species}</p>
                <p><strong>Location:</strong> {selectedAnimal.city}</p>

                <hr style={{ margin: '20px 0' }} />

                <h4>Feedback:</h4>
                {Array.isArray(feedback) && feedback.length > 0 ? (
                  feedback.map((item, index) => (
                    <div key={index} style={feedbackCardStyle}>
                      <p><strong>Description:</strong> {item.description}</p>
                      {item.fileUrl && (
                        <div style={{ marginTop: '10px' }}>
                          <strong>Attached Image:</strong>
                          <br />
                          <img
                            src={`${process.env.REACT_APP_MEDIA_URL}${item.fileUrl}`}
                            alt={item.originalFileName || 'Feedback Image'}
                            style={{
                              width: "100%",
                              // height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                              marginTop: "8px"
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No feedback available.</p>
                )}
                <button className="form-button" onClick={() => setShowHealthModal(false)}>
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {/* <th>Prani Aadhar</th> */}

                  <th>Type</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Blood Group</th>
                  <th>Image</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal) => (
                  <tr key={animal._id}>
                    <td data-label="Type">{animal.type}</td>
                    <td data-label="Species">{animal.species}</td>
                    <td data-label="Breed">{animal.breed}</td>
                    <td data-label="Name">{animal.name}</td>
                    <td data-label="Age">{animal.age}</td>
                    <td data-label="Blood Group">{animal.bloodGroup}</td>
                    <td data-label="Image">
                      {animal.animalImage ? (
                        <img
                          src={`${process.env.REACT_APP_MEDIA_URL}${animal.animalImage}`}
                          alt={animal.name}
                          style={{
                            width: '90px',
                            height: '90px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td data-label="Location">
                      {animal.city}, {animal.taluk},<br /> {animal.district}, {animal.state},<br /> {animal.country} - {animal.pin_code}
                    </td>
                    {/* <td data-label="Actions">
                      <button className="action-button edit" onClick={() => handleEdit(animal)}>Edit</button>
                      <button className="action-button edit" onClick={async () => {
                        setSelectedAnimal(animal);
                        await fetchFeedback(animal.praniAadharNumber);
                        setShowHealthModal(true);
                      }}>
                        Health Record
                      </button>
                      <button
                        className="action-button edit"
                        onClick={() => navigate('/doctors', { state: { selectedAnimal: animal } })}
                      >
                        Contact Doctors
                      </button>

                      <button
                        className="action-button edit"
                        onClick={() => handleBloodTypingRequest(animal)}
                      >
                        Blood Typing Request
                      </button>

                      <button
                        className="action-button edit"
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setShowDonorModal(true);
                        }}
                        disabled={!animal.bloodGroup || animal.bloodGroup.trim() === ''}
                        title={!animal.bloodGroup || animal.bloodGroup.trim() === '' ? 'Blood group is required' : ''}
                        style={{
                          opacity: !animal.bloodGroup ? 0.5 : 1,
                          cursor: !animal.bloodGroup ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Became a Donor
                      </button>

                      <button
                        className="action-button edit"
                        // onClick={...}
                        disabled={!animal.bloodGroup || animal.bloodGroup.trim() === ''}
                        title={!animal.bloodGroup || animal.bloodGroup.trim() === '' ? 'Blood group is required' : ''}
                        style={{
                          opacity: !animal.bloodGroup ? 0.5 : 1,
                          cursor: !animal.bloodGroup ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Request Blood
                      </button>

                      <button
                        className="action-button edit"
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setShowAadharModal(true);
                        }}
                      >
                        View Aadhar
                      </button>

                      <button className="action-button delete" onClick={() => handleDelete(animal.praniAadharNumber)}>
                        Delete
                      </button>
                    </td> */}

                    <td data-label="Actions" style={{ position: 'relative' }}>
                      <div className="dropdown-wrapper">
                        <button
                          className="form-button"
                          onClick={() => setOpenDropdown((prev) => (prev === animal._id ? null : animal._id))}
                        >
                          Actions ▾
                        </button>

                        {openDropdown === animal._id && (
                          <div>
                            <div className="dropdown-menu">
                              <button className='action-button edit' onClick={() => handleEdit(animal)}>Edit</button>

                              <button className='action-button edit' onClick={async () => {
                                setSelectedAnimal(animal);
                                await fetchFeedback(animal.praniAadharNumber);
                                setShowHealthModal(true);
                                setOpenDropdown(null);
                              }}>
                                Health Record
                              </button>

                              <button className='action-button edit' onClick={() => {
                                navigate('/doctors', { state: { selectedAnimal: animal } });
                                setOpenDropdown(null);
                              }}>
                                Contact Doctors
                              </button>

                              <button className='action-button edit' onClick={() => {
                                handleBloodTypingRequest(animal);
                                setOpenDropdown(null);
                              }}>
                                Blood Typing Request
                              </button>

                              <button className='action-button edit'
                                disabled={!animal.bloodGroup || animal.bloodGroup.trim() === ''}
                                title={!animal.bloodGroup ? 'Blood group is required' : ''}
                                style={{
                          opacity: !animal.bloodGroup ? 0.5 : 1,
                          cursor: !animal.bloodGroup ? 'not-allowed' : 'pointer'
                        }}
                                onClick={() => {
                                  setSelectedAnimal(animal);
                                  setShowDonorModal(true);
                                  setOpenDropdown(null);
                                }}
                              >
                                Become a Donor
                              </button>

                              {/* <button className='action-button edit'
                                disabled={!animal.bloodGroup || animal.bloodGroup.trim() === ''}
                                title={!animal.bloodGroup ? 'Blood group is required' : ''}
                              >
                                Request Blood
                              </button> */}

                              <button className='action-button edit'
                                disabled={!animal.bloodGroup}
                                style={{
                          opacity: !animal.bloodGroup ? 0.5 : 1,
                          cursor: !animal.bloodGroup ? 'not-allowed' : 'pointer'
                        }}
                                onClick={() => {
                                  setSelectedAnimal(animal);
                                  setShowBloodRequestModal(true);
                                }}
                              >
                                Request Blood
                              </button>


                              <button className='action-button edit' onClick={() => {
                                setSelectedAnimal(animal);
                                setShowAadharModal(true);
                                setOpenDropdown(null);
                              }}>
                                View Aadhar
                              </button>

                              <button className="action-button delete" onClick={() => handleDelete(animal.praniAadharNumber)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showBloodRequestModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Request Blood</h3>

                <div className="form-group">
                  <label>Quantity (in ml):</label>
                  <input
                    type="text"
                    value={bloodQuantity}
                    onChange={(e) => setBloodQuantity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Reason:</label>
                  <textarea
                    value={bloodReason}
                    onChange={(e) => setBloodReason(e.target.value)}
                    style={{width:'100%', height:'150px'}}
                  />
                </div>

                <div className="form-group">
                  <label>Upload Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBloodImage(e.target.files?.[0] || null)}
                  />
                </div>

                {/* <div className="form-field checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={addHealthRecord}
                      onChange={async () => {
                        const newChecked = !addHealthRecord;
                        setAddHealthRecord(newChecked);
                        if (newChecked && selectedAnimal) {
                          try {
                            const res = await api.farmer_api.get<FeedbackResponse[]>(`/feedback/${selectedAnimal.praniAadharNumber}`);
                            const record = res.data?.[0];
                            setFetchedHealthRecord(record || null);
                          } catch (err) {
                            console.error("Failed to fetch health record");
                            setFetchedHealthRecord(null);
                          }
                        } else {
                          setFetchedHealthRecord(null);
                        }
                      }}
                    />
                    Add Previous Health Record
                  </label>
                </div> */}

                <div className="form-field checkbox-field" style={{ marginTop: '10px' }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={addHealthRecord}
                      onChange={async () => {
                        const newChecked = !addHealthRecord;
                        setAddHealthRecord(newChecked);

                        if (newChecked && selectedAnimal) {
                          try {
                            const res = await api.farmer_api.get<FeedbackResponse[]>(`/feedback/${selectedAnimal.praniAadharNumber}`);
                            const record = res.data?.[0]; // assuming one record
                            if (record) {
                              setFetchedHealthRecord(record);
                              setShowHealthPopup(true);
                            } else {
                              setFetchedHealthRecord(null); // allow check even if none
                            }
                          } catch (err) {
                            console.error("Error fetching health record:", err);
                            setFetchedHealthRecord(null); // allow check even if error
                          }
                        } else {
                          setFetchedHealthRecord(null); // uncheck
                        }
                      }}
                    />{" "}
                    Add Previous Health Record
                  </label>
                </div>

                <div className="form-buttons">
                  <button
                    className="form-button"
                    onClick={handleSubmitBloodRequest}
                  >
                    Submit
                  </button>
                  <button
                    className="form-button cancel-button"
                    onClick={() => {
                      setShowBloodRequestModal(false);
                      resetBloodRequestForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}


          {showAadharModal && selectedAnimal && (
            <div className="modal-overlay">
              <div className="modal-content aadhar-modal" style={{ maxWidth: '600px' }}>
                <div className='aadhar-front'>
                  <div className="aadhar-header">
                    <img src={safron} alt="Brush Stroke" className="aadhar-brush" />
                    <h1 className="styled-aadhar-number">{formatPraniAadhar(selectedAnimal.praniAadharNumber)}</h1>
                    <img src={green} alt="Brush Stroke" className="aadhar-brush flipped" />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="aadhar-image">
                      <img
                        src={`${process.env.REACT_APP_MEDIA_URL}${selectedAnimal.animalImage}`}
                        alt={selectedAnimal.name}
                      />
                    </div>
                    <div className="aadhar-details">
                      <div className="aadhar-column">
                        <span>Prani Name</span>
                        <span>Type</span>
                        <span>Species</span>
                        <span>Breed</span>
                        <span>Age</span>
                        <span>Blood Group</span>
                        <span>Prani Guardian</span>
                      </div>
                      <div className="aadhar-column">
                        <strong>{selectedAnimal.name}</strong>
                        <strong>{selectedAnimal.type}</strong>
                        <strong>{selectedAnimal.species}</strong>
                        <strong>{selectedAnimal.breed}</strong>
                        <strong>{selectedAnimal.age}</strong>
                        <strong>{selectedAnimal.bloodGroup}</strong>
                        <strong>{farmer}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="qr-image">
                    <img
                      src={qr}
                      alt="qr-code"
                    />
                  </div>
                </div>
                &nbsp;
                <div className="aadhar-back">
                  <div className="aadhar-header-back">
                    <img src={logo} alt="Brush Stroke" className="aadhar-logo-back" />
                    <h1>PRANI MITHRA</h1>
                  </div>

                  <div className="club-title">
                    <p>A Unique ID Card For Cattle Welfare Initiative</p>
                  </div>

                  <div className="address-box">
                    <h3>Prani Address</h3>
                    <p>{selectedAnimal.city}, {selectedAnimal.taluk}</p>
                    <p>{selectedAnimal.district}, {selectedAnimal.state}</p>
                    <p>{selectedAnimal.country} - {selectedAnimal.pin_code}</p>
                  </div>

                  <div className="social-contact">
                    <div className="contact-info">
                      <p><strong>www.pranimithra.com</strong></p>
                      <p>+91 98XXXXXXXX | support@pranimithra.com</p>
                    </div>
                  </div>

                  <div className="issue-info">
                    {/* <p>Issued on: {selectedAnimal.issueDate}</p> */}
                    <p>Issued on: 25/10/2025</p>
                  </div>
                </div>
                <button className="form-button" onClick={() => setShowAadharModal(false)} style={{ marginTop: '20px' }}>
                  Close
                </button>
              </div>
            </div>
          )}

          {showDonorModal && selectedAnimal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Become a Donor - {selectedAnimal.name}</h3>
                <div className="form-group">
                  <label>Animal Weight (in kg):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={animalWeight}
                    onChange={(e) => setAnimalWeight(e.target.value)}
                    placeholder="Enter weight"
                    required
                  />
                </div>

                <div className="form-field checkbox-field" style={{ marginTop: '10px' }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={addHealthRecord}
                      onChange={async () => {
                        const newChecked = !addHealthRecord;
                        setAddHealthRecord(newChecked);

                        if (newChecked && selectedAnimal) {
                          try {
                            const res = await api.farmer_api.get<FeedbackResponse[]>(`/feedback/${selectedAnimal.praniAadharNumber}`);
                            const record = res.data?.[0]; // assuming one record
                            if (record) {
                              setFetchedHealthRecord(record);
                              setShowHealthPopup(true);
                            } else {
                              setFetchedHealthRecord(null); // allow check even if none
                            }
                          } catch (err) {
                            console.error("Error fetching health record:", err);
                            setFetchedHealthRecord(null); // allow check even if error
                          }
                        } else {
                          setFetchedHealthRecord(null); // uncheck
                        }
                      }}
                    />{" "}
                    Add Previous Health Record
                  </label>
                </div>



                <div className="form-field checkbox-field" style={{ marginTop: '10px' }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={confirmDonor}
                      onChange={() => setConfirmDonor(!confirmDonor)}
                    /> Are you sure you want to become a donor?
                  </label>
                </div>

                <div className="form-buttons" style={{ marginTop: '20px' }}>
                  <button
                    className="form-button"
                    disabled={!confirmDonor}
                    title={!confirmDonor ? "You must confirm to proceed" : ""}
                    onClick={handleDonorSubmit}
                    style={{
                      opacity: !confirmDonor ? 0.5 : 1,
                      cursor: !confirmDonor ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Submit
                  </button>

                  <button
                    className="form-button cancel-button"
                    onClick={() => {
                      resetDonorForm();
                      setShowDonorModal(false);
                    }}

                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* {showHealthPopup && fetchedHealthRecord && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Previous Health Record</h3>
                <p><strong>Description:</strong> {fetchedHealthRecord.description}</p>
                {fetchedHealthRecord.fileUrl && (
                  <img
                    src={`${process.env.REACT_APP_MEDIA_URL}${fetchedHealthRecord.fileUrl}`}
                    alt="Health Record"
                    style={{ width: '100%', marginTop: '10px', borderRadius: '6px' }}
                  />
                )}

                <div className="form-buttons" style={{ marginTop: '20px' }}>
                  <button className="form-button" onClick={() => setShowHealthPopup(false)}>Close</button>
                </div>
              </div>
            </div>
          )} */}




          {animalToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this animal?</p>
                <div className="form-buttons">
                  <button
                    className="form-button"
                    onClick={async () => {
                      try {
                        await api.farmer_api.delete(`/animal/${animalToDelete}`);
                        await fetchAnimals();
                        setToast({ type: 'success', message: 'Animal deleted successfully' });
                      } catch (error) {
                        console.error('Error deleting animal:', error);
                        setToast({ type: 'error', message: 'Failed to delete animal' });
                      } finally {
                        setAnimalToDelete(null);
                        setTimeout(() => setToast(null), 5000);
                      }
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="form-button cancel-button"
                    onClick={() => setAnimalToDelete(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

