import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../styles/forms.css';
import '../../../styles/dashboard.css';

interface Doctor {
  _id: string;
  user_name: string;
  specialization: string;
  city: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  pin_code: string;
}

interface Appointment {
  _id: string;
  doctorId: Doctor;
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
}

const FarmerMyBooking: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);
  const [cancelResultMessage, setCancelResultMessage] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);



  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const FarmerId = context?.user?.id;

  const fetchAppointments = async () => {
    if (!FarmerId) return;
    setLoading(true);
    try {
      const res = await api.farmer_api.get(`/appointment/appointments/farmer/${FarmerId}`);
      //   setAppointments(res.data.appointments);
      setAppointments((res as any).data.appointments)
      setFilteredAppointments((res as any).data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [FarmerId]);

  useEffect(() => {
    filterAppointments();
  }, [statusFilter, dateFilter, appointments]);

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appt => appt.status.toLowerCase() === statusFilter);
    }

    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') {
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.start_date);
        return apptDate.toDateString() === today.toDateString();
      });
    } else if (dateFilter === 'last6days') {
      const sixDaysAgo = new Date(today);
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.start_date);
        return apptDate >= sixDaysAgo && apptDate <= today;
      });
    } else if (dateFilter === 'last30days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.start_date);
        return apptDate >= thirtyDaysAgo && apptDate <= today;
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
  };

  const isJoinEnabled = (appt: Appointment) => {
    if (appt.status !== "booked") return false
    const now = new Date();
    const appointmentDateTime = new Date(`${appt.start_date}T${appt.start_time}`);

    const diffInMs = appointmentDateTime.getTime() - now.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);

    return diffInMinutes <= 5 && diffInMinutes >= -30 && appt.status === 'booked'; // allow slight leeway
  };

  const isCancelAllowed = (appt: Appointment) => {
    if (appt.status !== 'booked') return false;

    const now = new Date();
    const startTime = new Date(`${appt.start_date}T${appt.start_time}`);

    const diffInMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes > 60; // cancel allowed only if more than 60 minutes left
  };


  const handleJoinCall = (appt: Appointment) => {
    console.log('Joining call for appointment:', appt);
    localStorage.setItem('callSessionMeta', JSON.stringify({
      appointmentId: appt._id,
      doctorId: appt.doctorId._id,
      doctorName: appt.doctorId.user_name,
      farmerName: appt.farmerName,
      farmerId: appt.farmer_id
    }));
    navigate('/video-call');
  };

  const handleCancelBooking = (appointmentId: string) => {
    setCancelAppointmentId(appointmentId);
    setShowCancelModal(true);
  };







  return (
    <div className="center-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link className="back-button" to="/farmer"><ArrowBackIcon /></Link>
          <h2>All Bookings</h2>
        </div>
        <div className="dashboard-content">
          <h2>My Bookings</h2>

          {/* Filter Controls */}
          <div className="filter-controls" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <div className="filter-group">
              <label htmlFor="status-filter">Filter by Status:</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                style={{ padding: '5px', borderRadius: '4px' }}
              >
                <option value="all">All Status</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                {/* Add other status options as needed */}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date-filter">Filter by Date:</label>
              <select
                id="date-filter"
                value={dateFilter}
                onChange={handleDateFilterChange}
                style={{ padding: '5px', borderRadius: '4px' }}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="last6days">Last 6 Days</option>
                <option value="last30days">Last 30 Days</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Doctor Address</th>
                  <th>Animal</th>
                  {/* <th>PraniAadhar</th> */}
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <tr key={appt._id}>
                      <td data-label="Doctor Name">{appt.doctorId.user_name}</td>
                      <td data-label="Specialization">{appt.doctorId.specialization}</td>
                      <td data-label="Location">{appt.doctorId.city}, {appt.doctorId.taluk}, {appt.doctorId.district}, <br /> {appt.doctorId.state}, {appt.doctorId.country} - {appt.doctorId.pin_code}</td>
                      <td data-label="Animal">{appt.species}</td>
                      {/* <td>{appt.praniAadharNumber}</td> */}
                      <td data-label="Start Date">{appt.start_date}</td>
                      <td data-label="Start Time">{appt.start_time} - {appt.end_time}</td>
                      {/* <td>{appt.status}</td> */}
                      <td data-label="Status" style={{ fontSize: '16px', color: appt.status === 'cancelled' ? 'red' : appt.status === 'completed' ? 'green' : 'inherit' }}> <strong>{appt.status}</strong> </td>
                      <td data-label="Action">
                        <button
                          className={`action-button ${!isJoinEnabled(appt) ? 'disabled-button' : 'edit'}`}
                          onClick={() => handleJoinCall(appt)}
                          disabled={!isJoinEnabled(appt)}
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

                        <button
                          className={`action-button ${appt.status !== 'booked' || !isCancelAllowed(appt) ? 'disabled-button' : 'delete'}`}
                          onClick={() => handleCancelBooking(appt._id)}
                          disabled={appt.status !== 'booked' || !isCancelAllowed(appt)}
                        >
                          {appt.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>No appointments found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {showCancelModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Cancel Booking</h3>
                  <p>Are you sure you want to cancel this booking?</p>
                  <div className="form-buttons">
                    <button
                      className="form-button"
                      onClick={async () => {
                        if (!cancelAppointmentId) return;

                        try {
                          const res = await api.farmer_api.put(`/appointment/${cancelAppointmentId}/cancel`);

                          setAppointments(prev =>
                            prev.map(appt =>
                              appt._id === cancelAppointmentId ? { ...appt, status: 'cancelled' } : appt
                            )
                          );
                          setFilteredAppointments(prev =>
                            prev.map(appt =>
                              appt._id === cancelAppointmentId ? { ...appt, status: 'cancelled' } : appt
                            )
                          );

                          setCancelResultMessage('Appointment cancelled. Refund will be processed shortly.');
                        } catch (error) {
                          console.error('Failed to cancel booking:', error);
                          setCancelResultMessage('Failed to cancel booking. Please try again.');
                        } finally {
                          setShowCancelModal(false);
                          setShowResultModal(true);
                          setCancelAppointmentId(null);
                        }
                      }}
                    >
                      Yes, Cancel
                    </button>
                    <button
                      className="form-button cancel-button"
                      onClick={() => {
                        setShowCancelModal(false);
                        setCancelAppointmentId(null);
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}


            {showResultModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Notice</h3>
                  <p>{cancelResultMessage}</p>
                  <button className="form-button" onClick={() => setShowResultModal(false)}>OK</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerMyBooking;