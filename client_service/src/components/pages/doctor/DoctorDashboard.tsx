



// import React, { useContext, useState } from 'react';
// import SlotCalendar from './SlotCalender';
// import BookingsTable from './BookingsTable';
// import '../../../styles/forms.css';
// import '../../../styles/css/DoctorDashboard.css';
// import { AuthContext } from '../../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { FaBars, FaTimes } from 'react-icons/fa';

// const DoctorDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'calendar' | 'bookings'>('calendar');
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showFeeModal, setShowFeeModal] = useState(false);
//   const [consultationFee, setConsultationFee] = useState<number>(0);


//   const context = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (context) {
//       context.logout();
//       navigate('/login');
//     }
//   };

//   const doctorId = context?.user?.id;

//   return (
//     <div className='center-page'>
//       <div className="doctor-container">
//         <div className="dashboard-header">
//           <h2>Doctor Dashboard</h2>
//           <button className="form-button" onClick={handleLogout}>Logout</button>
//         </div>

//         <div className="dashboard-content">

//           {/* Burger Menu */}
//           <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
//             {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </div>

//           {/* Navigation Buttons */}
//           <div className={`nav-buttons ${menuOpen ? 'show' : ''}`}>
//             <button
//               className={`form-button contact-button ${activeTab === 'calendar' ? 'active' : ''}`}
//               onClick={() => { setActiveTab('calendar'); setMenuOpen(false); }}
//             >
//               Manage Slots
//             </button>

//             <button
//               className={`form-button contact-button ${activeTab === 'bookings' ? 'active' : ''}`}
//               onClick={() => { setActiveTab('bookings'); setMenuOpen(false); }}
//             >
//               View Bookings
//             </button>
//             <button
//               className='form-button contact-button' 
//               onClick={() => setShowFeeModal(true)}
//             >
//               Consultation Fee
//             </button>
//           </div>

//           {showFeeModal && (
//   <div className="modal-overlay">
//     <div className="modal">
//       <h3>Set Consultation Fee</h3>
//       <input
//         type="number"
//         placeholder="Enter amount in ₹"
//         value={consultationFee}
//         onChange={(e) => setConsultationFee(Number(e.target.value))}
//         className="form-input"
//         style={{ width: '100%', margin: '10px 0' }}
//       />
//       <div className="form-buttons">
//         <button
//           className="form-button"
//           onClick={() => setShowFeeModal(false)}
//         >
//           Save
//         </button>
//         <button
//           className="form-button cancel-button"
//           onClick={() => setShowFeeModal(false)}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//           {activeTab === 'calendar' ? <SlotCalendar doctorId={doctorId} /> : <BookingsTable />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;




import React, { useContext, useEffect, useState } from 'react';
import SlotCalendar from './SlotCalender';
import BookingsTable from './BookingsTable';
import '../../../styles/forms.css';
import '../../../styles/css/DoctorDashboard.css';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import api from '../../../api/axiosConfig';
import AcceptedDonorsSection from './AcceptedDonarSection';
import logo from '../../../assets/Logo.png'
import BloodRequestsSection from './BloodRequest';
import MatchedBloodRequests from './MatchedBloodRequests';

interface SetConsultationFeeRequest {
  doctorId: string;
  fee: number;
}

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'bookings' | 'donors' |'bloodRequest' | 'matchedReq'>('calendar');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [consultationFee, setConsultationFee] = useState<number>(500);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const doctorId = context?.user?.id;

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate('/login');
    }
  };

  const fetchFee = async () => {
    if (!doctorId) return;
    try {
      const res = await api.doctor_api.get<SetConsultationFeeRequest>(`/consultation-fee/${doctorId}`);
      setConsultationFee(res.data.fee);
    } catch (err) {
      console.log('No fee set yet');
    }
  };

  const handleSaveFee = async () => {
    if (!doctorId) return;
    try {
      await api.doctor_api.post('/consultation-fee', {
        doctorId,
        fee: consultationFee
      });
      setToast({ type: 'success', message: 'Fee saved successfully!' });
      setShowFeeModal(false);
    } catch (error) {
      console.error('Failed to save fee', error);
      setToast({ type: 'error', message: 'Failed to save fee' });
    }
  };

  useEffect(() => {
    fetchFee();
  }, [doctorId]);

  return (
    <div className="center-page">
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}
      <div className="doctor-container">
        <div className="dashboard-header">
          <div className="dashboard-logo">
            <img src={logo}/>
          </div>
          <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>
          <h2>Doctor Dashboard</h2>
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
              className={`form-button contact-button ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => { setActiveTab('calendar'); setMenuOpen(false); }}
            >
              Manage Slots
            </button>

            <button
              className={`form-button contact-button ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('bookings'); setMenuOpen(false); }}
            >
              View Bookings
            </button>

            <button
              className={`form-button contact-button ${activeTab === 'donors' ? 'active' : ''}`}
              onClick={() => { setActiveTab('donors'); setMenuOpen(false); }}
            >
              Eligeble Donors
            </button>

            <button
              className={`form-button contact-button ${activeTab === 'bloodRequest' ? 'active' : ''}`}
              onClick={() => { setActiveTab('bloodRequest'); setMenuOpen(false); }}
            >
              Blood Request
            </button>

            <button
              className={`form-button contact-button ${activeTab === 'matchedReq' ? 'active' : ''}`}
              onClick={() => { setActiveTab('matchedReq'); setMenuOpen(false); }}
            >
              Matched Blood Requests
            </button>

            <button
              className="form-button contact-button"
              onClick={() => setShowFeeModal(true)}
            >
              Consultation Fee
            </button>
          </div>

          {activeTab === 'calendar' && <SlotCalendar doctorId={doctorId} />}
          {activeTab === 'bookings' && <BookingsTable />}
          {activeTab === 'donors' && <AcceptedDonorsSection />}
          {activeTab === 'bloodRequest' && <BloodRequestsSection />}
          {activeTab === 'matchedReq' && <MatchedBloodRequests />}
        </div>
      </div>

      {/* Modal */}
      {showFeeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Set Your Consultation Amount</h3>
            <input
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(Number(e.target.value))}
              placeholder="Enter fee in ₹"
              className="form-input"
              min={0}
              style={{ width: '90%' }}
            />
            <div className="form-buttons">
              <button className="form-button" onClick={handleSaveFee}>Save</button>
              <button className="form-button cancel-button" onClick={() => setShowFeeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
