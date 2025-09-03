
import React, { useContext, useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import '../../../styles/css/DoctorDashboard.css';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  _id: string;
  doctorId: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  farmerName: string;
  farmerContact: string;
  farmer_id: string;
  status: string;
  type: string;
  species: string;
  praniAadharNumber: string;
  healthRecord: string;
}

interface FeedbackResponse {
  description: string;
  fileUrl: string;
  originalFileName: string;
}


  const BookingsTable: React.FC=() => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filterRange, setFilterRange] = useState<'all' | 'today' | 'last2days' | 'pastweek' | 'lastmonth'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

const [showAnimalRecordModal, setShowAnimalRecordModal] = useState(false);
const [animalFeedback, setAnimalFeedback] = useState<FeedbackResponse[] | null>(null);
const [selectedAnimalPraniAadhar, setSelectedAnimalPraniAadhar] = useState<string | null>(null);
const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);


  const context = useContext(AuthContext);
  const doctorId = context?.user?.id;
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    if (!doctorId) return;
    try {
      const res = await api.doctor_api.get(`/appointment/${doctorId}`);
      setAppointments((res as any).data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);
 const isJoinEnabled = (appt: Appointment) => {
    if (appt.status !== "booked") return false
    const now = new Date();
    const appointmentDateTime = new Date(`${appt.start_date}T${appt.start_time}`);
    const diffInMinutes = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 5 && diffInMinutes >= -30 && appt.status === 'booked';
  };

  const isPreviousEnabled = (appt: Appointment) => {
    if (appt.status !== "booked") return false
    const now = new Date();
    const appointmentDateTime = new Date(`${appt.start_date}T${appt.start_time}`);
    const diffInMinutes = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 30 && diffInMinutes >= -30 && appt.status === 'booked';
  };

  // const isFeedbackEnabled = (appt: Appointment) => {
  //   if (appt.status !== "booked") return false
  //   const now = new Date();
  //   const appointmentDateTime = new Date(`${appt.start_date}T${appt.start_time}`);
  //   const diffInMinutes = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);
  //   return diffInMinutes <= 5 && diffInMinutes >= 35 && appt.status === 'booked';
  // };

  const isFeedbackEnabled = (appt: Appointment) => {
  if (appt.status !== "booked") return false;

  const now = new Date();
  const start = new Date(`${appt.start_date}T${appt.start_time}`);
  const end = new Date(`${appt.end_date}T${appt.end_time}`);

  const fiveMinutesBeforeStart = new Date(start.getTime() - 5 * 60 * 1000);
  const thirtyMinutesAfterEnd = new Date(end.getTime() + 60 * 60 * 1000);

  return now >= fiveMinutesBeforeStart && now <= thirtyMinutesAfterEnd;
};


  const handleJoinCall = (appt: Appointment) => {
    console.log('Joining call for appointment:', appt);
    localStorage.setItem('callSessionMeta', JSON.stringify({
      appointmentId: appt._id,
      doctorId: appt.doctorId,
      doctorName: context?.user?.user_name,
      farmerName: appt.farmerName,
      farmerId: appt.farmer_id
    }));
    navigate('/video-call');
  };



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const selectedAppointment = appointments.find(appt => appt._id === selectedAppointmentId);
  if (!selectedAppointment) {
    console.error('Selected appointment not found');
    return;
  }

  const formData = new FormData();
  formData.append('farmerName', selectedAppointment.farmerName);
  formData.append("praniAadharNumber", selectedAppointment.praniAadharNumber );
  // formData.append('praniAadharNumber', selectedAppointment.praniAadharNumber);
  formData.append('description', description);
  

  if (file) formData.append('file', file);

  try {
    await api.doctor_api.post('/feedback', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Feedback submitted');
    setToast({ type: "success", message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    alert('Failed to submit feedback.');
  }

  // Reset form
  setSelectedAppointmentId(null);
  setDescription('');
  setFile(null);
};



  const closeModal = () => {
    setSelectedAppointmentId(null);
    setDescription('');
    setFile(null);
  };

  if (!doctorId) {
    return <p>Please login to see your bookings.</p>;
  }

  const fetchAnimalFeedback = async (praniAadharNumber: string) => {
  try {
    const response = await api.doctor_api.get<FeedbackResponse[]>(`/feedback/${praniAadharNumber}`);
    setAnimalFeedback(response.data);
    setSelectedAnimalPraniAadhar(praniAadharNumber);
    setShowAnimalRecordModal(true);
  } catch (error) {
    console.error('Error fetching animal feedback:', error);
    setAnimalFeedback(null);
  }
};


const AnimalRecordModal = () => {
  if (!showAnimalRecordModal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '500px',
          maxWidth: '90%',
          // maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ marginBottom: '10px' }}>Animal Health Records</h3>
        <p><strong>Prani Aadhar Number:</strong> {selectedAnimalPraniAadhar}</p>
        
        <hr style={{ margin: '20px 0' }} />

        <h4>Feedback History:</h4>
        {Array.isArray(animalFeedback) && animalFeedback.length > 0 ? (
          animalFeedback.map((item, index) => (
            <div key={index} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '15px',
              marginTop: '15px',
              backgroundColor: '#f5f5f5',
            }}>
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
          <p>No feedback records available.</p>
        )}
        <button className='form-button close'
          onClick={() => {
            setShowAnimalRecordModal(false);
            setAnimalFeedback(null);
            setSelectedAnimalPraniAadhar(null);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};


// const handleCancelBooking = async (appointmentId: string) => {
//       if (!window.confirm('Are you sure you want to cancel this booking?')) {
//       return;
//     }
//     try {
//       // Call API to update status
//       await api.doctor_api.put(`/appointment/${appointmentId}/cancel`);
      
//       // Update local state
//       setAppointments(prevAppointments => 
//         prevAppointments.map(appt => 
//           appt._id === appointmentId 
//             ? { ...appt, status: 'cancelled' } 
//             : appt
//         )
//       );
      
//       setFilteredAppointments(prevAppointments => 
//         prevAppointments.map(appt => 
//           appt._id === appointmentId 
//             ? { ...appt, status: 'cancelled' } 
//             : appt
//         )
//       );
      
//     } catch (error) {
//       console.error('Failed to cancel booking:', error);
//       alert('Failed to cancel booking. Please try again.');
//     }
//   };






  return (
    <div className="table-wrapper">
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}
      <h3>Booked Appointments</h3>

      {appointments.length === 0 ? (
        <p>No appointments found for this date.</p>
      ) : (
        <>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '6px' }}>Filter by Time:</label>
            <select
              value={filterRange}
              onChange={(e) => setFilterRange(e.target.value as any)}
              style={{ padding: '6px' }}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="last2days">Last 2 Days</option>
              <option value="pastweek">Past Week</option>
              <option value="lastmonth">Last Month</option>
            </select>
          </div>

          <div>
            <label style={{ marginRight: '6px' }}>Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '6px' }}
            >
              <option value="all">All</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className='table-container'>
          <table className="data-table">
            <thead>
              <tr>
                <th style={thStyle}>Farmer Name</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Animal</th>
                <th style={thStyle}>Prani Aadhar Number</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Start Time</th>
                <th style={thStyle}>End Time</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.filter((appt) => {
                const apptDate = new Date(appt.start_date);
                const now = new Date();
                let matchesRange = true;

                switch (filterRange) {
                  case 'today':
                    matchesRange = apptDate.toDateString() === now.toDateString();
                    break;
                  case 'last2days':
                    const twoDaysAgo = new Date(now);
                    twoDaysAgo.setDate(now.getDate() - 2);
                    matchesRange = apptDate >= twoDaysAgo;
                    break;
                  case 'pastweek':
                    const weekAgo = new Date(now);
                    weekAgo.setDate(now.getDate() - 7);
                    matchesRange = apptDate >= weekAgo;
                    break;
                  case 'lastmonth':
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(now.getMonth() - 1);
                    matchesRange = apptDate >= monthAgo;
                    break;
                  default:
                    matchesRange = true;
                }

                const matchesStatus = filterStatus === 'all' || appt.status === filterStatus;
                return matchesRange && matchesStatus;
              }).map((appt) => (
                <tr key={appt._id}>
                  <td data-label="Farmer Name" style={tdStyle}>{appt.farmerName}</td>
                  <td data-label="Phone" style={tdStyle}>{appt.farmerContact}</td>
                  <td data-label="Type" style={tdStyle}>{appt.type}</td>
                  <td data-label="Animal" style={tdStyle}>{appt.species}</td>
                  <td data-label="Prani Aadhar" style={tdStyle}>{appt.praniAadharNumber}</td>
                  <td data-label="Start Date" style={tdStyle}>{appt.start_date}</td>
                  <td data-label="Start Time" style={tdStyle}>{appt.start_time}</td>
                  <td data-label="End Time" style={tdStyle}>{appt.end_time}</td>
                  <td data-label="Status" style={{ color: appt.status === 'cancelled' ? 'red' : appt.status === 'completed' ? 'green' : 'inherit' }}> <strong>{appt.status} </strong></td>
                  <td style={tdStyle}>
                    {/* <button className={`action-button ${!isFeedbackEnabled(appt) || appt.status === 'cancelled' || appt.status === 'booked' ?  'disabled-button' : 'edit'}`}
                      onClick={() => setSelectedAppointmentId(appt._id)}
                      disabled={appt.status === 'cancelled' || !isFeedbackEnabled(appt)}
                    >
                      Feedback
                    </button> */}

                    <button
  className={`action-button ${
    isFeedbackEnabled(appt) ? 'edit' : 'disabled-button'
  }`}
  onClick={() => setSelectedAppointmentId(appt._id)}
  disabled={!isFeedbackEnabled(appt) || appt.status === 'cancelled'}
>
  Feedback
</button>

                    <button 
                    className={`action-button ${!isPreviousEnabled(appt) ? 'disabled-button' : 'edit'} ${appt.healthRecord === 'no' ? 'disabled-button' : ''}`}
                    onClick={() => fetchAnimalFeedback(appt.praniAadharNumber)}
                    disabled={appt.healthRecord === 'no' || !isPreviousEnabled(appt)} // ✅ Disable if healthRecord is 'no'
                  >
                    Previous Records
                  </button>

                    <button 
                      className={`action-button ${!isJoinEnabled(appt) ? 'disabled-button' : 'edit'}`}
                      disabled={!isJoinEnabled(appt)}
                      onClick={() => handleJoinCall(appt)}
                    >
                      📞 Join Call
                    </button>
                    {/* <button 
                    className={`action-button ${appt.status === 'cancelled' || appt.status === 'completed' ? 'disabled-button' : 'delete'}`}
                    onClick={() => handleCancelBooking(appt._id)}
                    disabled={appt.status === 'cancelled' || appt.status === 'completed'}
                > 
                    {appt.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
      <AnimalRecordModal />

      {selectedAppointmentId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90%',
            }}
          >
            <h4 style={{ marginBottom: '16px' }}>Add Feedback</h4>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  placeholder="Type your message..."
                  className="text-message-textarea"
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Choose File:</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  required
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#ccc',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


// Shared styles
const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left' as const,
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};
export default BookingsTable;
