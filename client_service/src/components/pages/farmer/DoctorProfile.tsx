// // DoctorProfile.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../../../api/axiosConfig';
// import { Calendar, momentLocalizer, Views, type View } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import FarmerBookSlotModal from './FarmerBookSlotModal';
// import "../../../styles/dashboard.css";
// import PaymentConfirmModal from './PaymentConfirmModal';
// import { useLocation, useNavigate } from 'react-router-dom';


// const localizer = momentLocalizer(moment);

// const DoctorProfile: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [doctor, setDoctor] = useState<any>(null);
//   const [events, setEvents] = useState<any[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<any>(null);
//   const [view, setView] = useState<View>('day');
//   const [date, setDate] = useState<Date>(new Date());
//   const [paymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [selectedPaymentSlot, setSelectedPaymentSlot] = useState<any>(null);
//   const [payment_id, setpayment_id] = useState<string>("")
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const paymentStatus = params.get("payment");

//     if (paymentStatus === "success") {
//       const slotStart = params.get("slotStart");
//       const slotEnd = params.get("slotEnd");

//       if (slotStart && slotEnd) {
//         // Convert ISO strings back to Date objects
//         const slot = {
//           start: new Date(slotStart),
//           end: new Date(slotEnd),
//         };

//         setSelectedSlot(slot);

//         // Remove query params from URL after processing
//         const cleanUrl = location.pathname;
//         navigate(cleanUrl, { replace: true });
//       }
//     }
//   }, [location, navigate]);

//   const fetchDoctor = async () => {
//     const res = await api.auth_api.get('/auth/get-doctors');
//     const doc = (res as any).data.users.find((d: any) => d._id === id);
//     setDoctor(doc);
//   };

//   const fetchAppointments = useCallback(async (doctorId: string, targetDate: Date) => {
//     const requests = [];
//     const startOfWeek = moment(targetDate).startOf('week');

//     for (let i = 0; i < 7; i++) {
//       const date = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD');
//       requests.push(api.farmer_api.get(`/appointment/${doctorId}/${date}`));
//     }

//     try {
//       const results = await Promise.all(requests);
//       const allAppointments = results.flatMap(res => (res as any).data.appointments || []);

//       const mappedAppointments = allAppointments.filter((appt: any) => appt.status === 'booked')
//       .map((appt: any) => {
//         const startDateTime = moment(`${appt.start_date}T${appt.start_time}`).toDate();
//         const endDateTime = moment(`${appt.end_date}T${appt.end_time}`).toDate();

//         return {
//           title: `Booked by ${appt.farmerName}`,
//           start: startDateTime,
//           end: endDateTime,
//           allDay: false,
//           booked: true, // custom flag
//         };
//       });

//       return mappedAppointments;
//     } catch (error) {
//       console.error('Failed to fetch appointments:', error);
//       return [];
//     }
//   }, []);

//   const fetchSlots = useCallback(async (doctorId: string, targetDate: Date) => {
//     const requests = [];
//     const startOfWeek = moment(targetDate).startOf('week');

//     for (let i = 0; i < 7; i++) {
//       const date = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD');
//       requests.push(api.doctor_api.get(`/doctor/slots/${doctorId}/${date}`));
//     }

//     try {
//       const results = await Promise.all(requests);
//       const allSlots = results.flatMap(res => (res as any).data.availableSlots || []);

//       // Fetch booked appointments too
//       const appointments = await fetchAppointments(doctorId, targetDate);

//       const appointmentTimes = appointments.map((appt: any) => {
//         const startDate = moment(appt.start).format('YYYY-MM-DD');
//         const startTime = moment(appt.start).format('HH:mm');
//         const endDate = moment(appt.end).format('YYYY-MM-DD');
//         const endTime = moment(appt.end).format('HH:mm');
//         return {
//           start: `${startDate}T${startTime}`,
//           end: `${endDate}T${endTime}`
//         };
//       });

//       // Map slots → only add if not already booked
//       const mappedSlots = allSlots
//             .filter((slot) => {
//               const slotStart = `${slot.start_date}T${slot.start_time}`;
//               return !appointmentTimes.some((appt) => appt.start === slotStart);
//             })
//             .map((slot: any) => ({
//               title: 'Available Slot',
//               start: moment(`${slot.start_date}T${slot.start_time}`).toDate(),
//               end: moment(`${slot.end_date}T${slot.end_time}`).toDate(),
//               allDay: false,
//               booked: false
//             }));


//       // Merge booked appointments and available slots
//       setEvents([...mappedSlots, ...appointments]);
//     } catch (error) {
//       console.error('Failed to fetch slots or appointments:', error);
//     }
//   }, [fetchAppointments]);


//   useEffect(() => {
//     if (id) {
//       fetchDoctor();
//       fetchSlots(id, date);
//     }
//   }, [id, date, fetchSlots]);

//   const handleBookingSuccess = () => {
//   if (id) {
//     fetchSlots(id, date);
//   }
// };


//   return (
//     <div className='center-page'>
//       <div className='dashboard-container'>
//         <div className='dashboard-content'>

//     <div className="profile-page">
//       <Link to="/doctors">← Back</Link>
//       {doctor && (
//         <>
//           <h2>{doctor.user_name}</h2>
//           <p>Email: {doctor.user_email}</p>
//           <p>Phone: {doctor.user_phone}</p>
//           <p>Specialization: {doctor.specialization}</p>

//           <div className='cal-responsive'>
//           <Calendar
//             localizer={localizer}
//             events={events}
//             selectable
//             date={date}
//             onNavigate={(newDate) => setDate(newDate)}
//             view={view}
//             views={['month', 'week', 'day']}
//             onView={(newView) => setView(newView)}
//             defaultView={Views.WEEK}
//             // style={{ height: 2000, marginTop: 20, width:1300 }}
//             timeslots={1}
//             step={30}
//             min={new Date(0, 0, 0, 9, 0)}
//             max={new Date(0, 0, 0, 21, 0)}
//             scrollToTime={new Date(0, 0, 0, 9, 0)}
//             onSelectEvent={(slot) => {
//               if (slot.booked) return;
//               if (view === 'month') {
//                 setDate(slot.start);
//                 setView('day');
//                 return;
//               }
//               setSelectedPaymentSlot(slot);
//               setPaymentModalOpen(true);
//             }}
//             eventPropGetter={(event) => {
//               if (event.booked) {
//                 return {
//                   style: {
//                     backgroundColor: '#28a745',
//                     color: 'white',
//                     borderRadius: '0px',
//                     padding: '0px',
//                     margin: '0px',
//                     border: 'none',
//                     height: '100%',
//                   }
//                 };
//               } else {
//                 return {
//                   style: {
//                     backgroundColor: '#007bff',
//                     color: 'white',
//                     borderRadius: '0px',
//                     padding: '0px',
//                     margin: '0px',
//                     border: 'none',
//                     height: '100%',
//                   }
//                 };
//               }
//             }}
//             />
//             </div>
//         </>
//       )}

//       {selectedSlot && (
//         <FarmerBookSlotModal
//           doctorId={doctor._id}
//           paymentId={payment_id}
//           slot={selectedSlot}
//           onClose={() => setSelectedSlot(null)}
//           onSuccess={handleBookingSuccess}
//       />
//       )}

//       {selectedPaymentSlot && (
//         <PaymentConfirmModal
//           isOpen={paymentModalOpen}
//           onClose={() => {
//             setPaymentModalOpen(false);
//             setSelectedPaymentSlot(null);
//           }}
//           amount={500}
//           description={`Consultation with Dr. ${doctor?.user_name}`}
//           doctorId={doctor._id}
//           slot={selectedPaymentSlot}
//           onPaymentSuccess={(razorpay_payment_id: string) => {
//             console.log("Payment successful with ID:", razorpay_payment_id);
//             setpayment_id(razorpay_payment_id);
//             setSelectedSlot(selectedPaymentSlot);
//             setPaymentModalOpen(false);
//             setSelectedPaymentSlot(null);
//           }}
//           onFailure={() => {
//             setSelectedPaymentSlot(null);
//             setPaymentModalOpen(false);
//             alert("Payment failed. Please try again.");
//           }}

//         />
//       )}
//       </div>
//     </div>
//   </div>
//     </div>
//   );
// };

// export default DoctorProfile;




import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { Calendar, momentLocalizer, Views, type View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import FarmerBookSlotModal from './FarmerBookSlotModal';
import PaymentConfirmModal from './PaymentConfirmModal';
import "../../../styles/dashboard.css";
import { AuthContext } from '../../../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface GetConsultationFeeResponse {
  fee: number;
}

const localizer = momentLocalizer(moment);

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [view, setView] = useState<View>('day');
  const [date, setDate] = useState<Date>(new Date());
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState<'yes' | 'no'>('no');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [consultationFee, setConsultationFee] = useState<number>(500);


  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const farmer = auth?.user;

  const fetchDoctor = async () => {
    const res = await api.auth_api.get('/auth/get-doctors');
    const doc = (res as any).data.users.find((d: any) => d._id === id);
    setDoctor(doc);
  };

  const locationAnimal = useLocation();
  const selectedAnimalFromRoute = locationAnimal.state?.selectedAnimal;

  useEffect(() => {
    if (selectedAnimalFromRoute) {
      setSelectedAnimal(selectedAnimalFromRoute);
    }
  }, [selectedAnimalFromRoute]);

  useEffect(() => {
  const fetchConsultationFee = async () => {
    if (!id) return;
    try {
      const response = await api.doctor_api.get<GetConsultationFeeResponse>(`/consultation-fee/${id}`);
      setConsultationFee(response.data.fee);
    } catch (error) {
      console.error("Failed to fetch consultation fee:", error);
    }
  };

  fetchConsultationFee();
}, [id]);




  const fetchAppointments = useCallback(async (doctorId: string, targetDate: Date) => {
    const startOfWeek = moment(targetDate).startOf('week');
    const requests = Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD');
      return api.farmer_api.get(`/appointment/${doctorId}/${date}`);
    });

    try {
      const results = await Promise.all(requests);
      const allAppointments = results.flatMap(res => (res as any).data.appointments || []);

      return allAppointments
        .filter((appt: any) => appt.status === 'booked')
        .map((appt: any) => ({
          title: `Booked by ${appt.farmerName}`,
          start: moment(`${appt.start_date}T${appt.start_time}`).toDate(),
          end: moment(`${appt.end_date}T${appt.end_time}`).toDate(),
          allDay: false,
          booked: true,
        }));
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return [];
    }
  }, []);

  const fetchSlots = useCallback(async (doctorId: string, targetDate: Date) => {
    const startOfWeek = moment(targetDate).startOf('week');
    const requests = Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD');
      return api.doctor_api.get(`/doctor/slots/${doctorId}/${date}`);
    });

    try {
      const results = await Promise.all(requests);
      const allSlots = results.flatMap(res => (res as any).data.availableSlots || []);
      const appointments = await fetchAppointments(doctorId, targetDate);

      const appointmentTimes = appointments.map(appt => ({
        start: moment(appt.start).format('YYYY-MM-DDTHH:mm'),
        end: moment(appt.end).format('YYYY-MM-DDTHH:mm')
      }));

      const mappedSlots = allSlots
        .filter(slot => {
          const slotStart = `${slot.start_date}T${slot.start_time}`;
          return !appointmentTimes.some(appt => appt.start === slotStart);
        })
        .map(slot => ({
          title: 'Available Slot',
          start: moment(`${slot.start_date}T${slot.start_time}`).toDate(),
          end: moment(`${slot.end_date}T${slot.end_time}`).toDate(),
          allDay: false,
          booked: false
        }));

      setEvents([...mappedSlots, ...appointments]);
    } catch (error) {
      console.error('Failed to fetch slots or appointments:', error);
    }
  }, [fetchAppointments]);

  useEffect(() => {
    if (id) {
      fetchDoctor();
      fetchSlots(id, date);
    }
  }, [id, date, fetchSlots]);

  const handleBookingSuccess = () => {
    setSelectedAnimal(null);
    setSelectedSlot(null);
    fetchSlots(id!, date);
  };

  return (
    <div className='center-page'>
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}
      <div className='dashboard-container'>
        <div className="dashboard-header">
          <Link to="/doctors" className="back-button">
            <ArrowBackIcon />
          </Link>
          {doctor && <h2>{doctor.user_name}'s Profile</h2>}
        </div>
        <div className='dashboard-content'>
          <div className="profile-page">
            {doctor && (
              <>
                <p>Email: {doctor.user_email}</p>
                <p>Phone: {doctor.user_phone}</p>
                <p>Specialization: {doctor.specialization}</p>

                <div className='cal-responsive'>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    selectable
                    date={date}
                    onNavigate={setDate}
                    view={view}
                    views={['month', 'week', 'day']}
                    onView={setView}
                    defaultView={Views.WEEK}
                    timeslots={1}
                    step={30}
                    min={new Date(0, 0, 0, 9, 0)}
                    max={new Date(0, 0, 0, 21, 0)}
                    scrollToTime={new Date(0, 0, 0, 9, 0)}
                    onSelectEvent={(slot) => {
                      if (slot.booked) return;
                      if (view === 'month') {
                        setDate(slot.start);
                        setView('day');
                        return;
                      }
                      setSelectedSlot(slot);
                    }}
                    eventPropGetter={(event) => ({
                      style: {
                        backgroundColor: event.booked ? '#28a745' : '#007bff',
                        color: 'white',
                        border: 'none',
                        height: '100%',
                      }
                    })}
                  />
                </div>
              </>
            )}

            {selectedSlot && selectedAnimal && !paymentModalOpen && (
              <FarmerBookSlotModal
                doctorId={doctor._id}
                slot={selectedSlot}
                selectedAnimal={selectedAnimal}
                onClose={() => setSelectedSlot(null)}
                onConfirm={(animal, aadhar, healthRecordValue) => {
                  setSelectedAnimal({ ...animal, praniAadharNumber: aadhar });
                  setSelectedHealthRecord(healthRecordValue); // ⬅ store it in state
                  setPaymentModalOpen(true);
                }}

              />

            )}

            {paymentModalOpen && selectedSlot && selectedAnimal && (
              <PaymentConfirmModal
                isOpen={paymentModalOpen}
                onClose={() => {
                  setPaymentModalOpen(false);
                  setSelectedSlot(null);
                  // setSelectedAnimal(null);
                }}
                amount={consultationFee}
                description={`Consultation with Dr. ${doctor?.user_name}`}
                doctorId={doctor._id}
                slot={selectedSlot}
                onPaymentSuccess={async (razorpay_payment_id: string) => {
                  try {
                    if (!farmer?.farmer_name || !farmer?.farmer_phone || !farmer?.id) {
                      alert("Farmer details missing. Please login again.");
                      return;
                    }

                    await api.farmer_api.post('/appointment/book', {
                      doctorId: doctor._id,
                      start_date: moment(selectedSlot.start).format('YYYY-MM-DD'),
                      start_time: moment(selectedSlot.start).format('HH:mm'),
                      end_date: moment(selectedSlot.end).format('YYYY-MM-DD'),
                      end_time: moment(selectedSlot.end).format('HH:mm'),
                      farmerName: farmer.farmer_name,
                      farmerContact: farmer.farmer_phone,
                      type: selectedAnimal.type,
                      species: selectedAnimal.species,
                      praniAadharNumber: selectedAnimal.praniAadharNumber,
                      farmer_id: farmer.id,
                      razorpay_payment_id,
                      healthRecord: selectedHealthRecord,

                    });

                    setToast({ type: 'success', message: 'Appointment Booked successfully!' });
                    handleBookingSuccess();
                  } catch (err) {
                    console.error("Booking failed:", err);
                    setToast({ type: 'error', message: 'Booking Failued after payment' });
                  } finally {
                    setPaymentModalOpen(false);
                  }
                }}
                onFailure={() => {
                  setToast({ type: 'error', message: 'Payment Failed' });
                  setPaymentModalOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
