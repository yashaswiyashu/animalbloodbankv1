// import React, { useEffect, useState } from 'react';
// import { Calendar, momentLocalizer, type SlotInfo, type Event, type View } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import api from '../../../api/axiosConfig';
// import './slotCalendar.css'
// const localizer = momentLocalizer(moment);

// type SlotCalendarProps = {
//   doctorId: string;
// };

// const SlotCalendar: React.FC<SlotCalendarProps> = ({ doctorId }) => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [currentDate, setCurrentDate] = useState<Date>(new Date());
//   const [view, setView] = useState<View>('month'); // <---- Controlled view state


//   const fetchSlots = async (date: Date) => {    
//     if (!doctorId) return;
//     try {
//       setLoading(true);
//       const formattedDate = moment(date).format('YYYY-MM-DD');
//       const response = await api.doctor_api.get(`/doctor/slots/${doctorId}/${formattedDate}`);
//       const slots = (response as any).data.availableSlots.map((slot: any) => ({
//         title: 'Available Slot',
//         start: new Date(`${slot.start_date}T${slot.start_time}`),
//         end: new Date(`${slot.end_date}T${slot.end_time}`),
//         allDay: false,
//       }));
//       setEvents(slots);
//     } catch (error) {
//       console.error('Failed to fetch slots:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


// const handleSelectSlot = (slotInfo: SlotInfo) => {
//   console.log("slotInfo:", slotInfo);
//   if (!doctorId) return;
//   // If in month view, go to day view and set date
//   if (view === 'month') {
//     setCurrentDate(slotInfo.start);
//     setView('day');
//     return; // Don't open confirmation modal yet
//   }

//   const start = moment(slotInfo.start);
//   const end = moment(slotInfo.end);

//   const confirmed = window.confirm(
//     `Add availability from ${start.format('LLLL')} to ${end.format('LLLL')}?`
//   );
//   if (!confirmed) return;

//   setLoading(true);
//   api.doctor_api.post('/doctor/create-slot', {
//     doctorId,
//     start_date: start.format('YYYY-MM-DD'),
//     start_time: start.format('HH:mm'),
//     end_date: end.format('YYYY-MM-DD'),
//     end_time: end.format('HH:mm'),
//   })
//   .then(() => fetchSlots(currentDate))
//   .catch(err => console.error(err))
//   .then(() => setLoading(false));
// };




//   const handleNavigate = (newDate: Date) => {
//     setCurrentDate(newDate);
//     fetchSlots(newDate);
//   };

//   const handleViewChange = (newView: View) => {
//     setView(newView);
//   };

//   useEffect(() => {
//     if (doctorId) {
//       fetchSlots(currentDate);
//     }
//   }, [doctorId, currentDate]);

//   return (
//     <div className='cal-responsive'>
//       {loading && <p>Loading slots...</p>}
//       <Calendar
//         localizer={localizer}
//         events={events}
//         selectable={true}
//         longPressThreshold={1}
//         onSelectSlot={handleSelectSlot}
//         startAccessor="start"
//         endAccessor="end"
//         // style={{ height: 2000, marginTop: 20 }}
//         onNavigate={handleNavigate}
//         view={view}
//         onView={handleViewChange}
//         defaultView="month"
//         views={['month', 'week', 'day']}
//         date={currentDate}
//         timeslots={1}
//         step={30}
//         min={new Date(0, 0, 0, 9, 0)}
//         max={new Date(0, 0, 0, 21, 0)}
//         scrollToTime={new Date(0, 0, 0, 9, 0)}
//       />
//     </div>
//   );
// };

// export default SlotCalendar;







// import React, { useEffect, useState } from 'react';
// import { Calendar, momentLocalizer, type SlotInfo, type Event, type View } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import api from '../../../api/axiosConfig';
// import './slotCalendar.css';

// const localizer = momentLocalizer(moment);

// type SlotCalendarProps = {
//   doctorId: string;
// };

// const SlotCalendar: React.FC<SlotCalendarProps> = ({ doctorId }) => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [currentDate, setCurrentDate] = useState<Date>(new Date());
//   const [view, setView] = useState<View>('month');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
//   const [repeatMonth, setRepeatMonth] = useState(false);
//   const [excludeSaturday, setExcludeSaturday] = useState(false);
//   const [excludeSunday, setExcludeSunday] = useState(false);
//   const [existingEvent, setExistingEvent] = useState<Event | null>(null);

//   const fetchSlots = async (date: Date) => {
//     if (!doctorId) return;
//     try {
//       setLoading(true);
//       const formattedDate = moment(date).format('YYYY-MM-DD');
//       const response = await api.doctor_api.get(`/doctor/slots/${doctorId}/${formattedDate}`);
//       const slots = (response as any).data.availableSlots.map((slot: any) => ({
//         title: 'Available Slot',
//         start: new Date(`${slot.start_date}T${slot.start_time}`),
//         end: new Date(`${slot.end_date}T${slot.end_time}`),
//         allDay: false,
//       }));
//       setEvents(slots);
//     } catch (error) {
//       console.error('Failed to fetch slots:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectSlot = (slotInfo: SlotInfo) => {
//     if (!doctorId) return;
//     if (view === 'month') {
//       setCurrentDate(slotInfo.start);
//       setView('day');
//       return;
//     }
//     setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
//     setRepeatMonth(false);
//     setExcludeSaturday(false);
//     setExcludeSunday(false);
//     setExistingEvent(null);
//     setShowModal(true);
//   };

//   const handleSelectEvent = (event: Event) => {
//     if (!doctorId) return;
//     setExistingEvent(event);
//     setShowModal(true);
//   };

//   const handleConfirmSlot = async () => {
//     if (!doctorId) return;
//     setShowModal(false);
//     setLoading(true);

//     if (existingEvent) {
//       const start = moment(existingEvent.start);
//       const end = moment(existingEvent.end);
//       try {
//         await api.doctor_api.post('/doctor/remove-slot', {
//           doctorId,
//           start_date: start.format('YYYY-MM-DD'),
//           start_time: start.format('HH:mm'),
//           end_date: end.format('YYYY-MM-DD'),
//           end_time: end.format('HH:mm'),
//         });
//         await fetchSlots(currentDate);
//       } catch (error) {
//         console.error('Failed to mark slot unavailable:', error);
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     if (!selectedSlot) return;

//     const start = moment(selectedSlot.start);
//     const end = moment(selectedSlot.end);

//     if (repeatMonth) {
//       const startHour = start.format('HH:mm');
//       const endHour = end.format('HH:mm');

//       const monthStart = start.clone();
//       const monthEnd = start.clone().endOf('month');

//       const slots = [];
//       while (monthStart.isSameOrBefore(monthEnd, 'day')) {
//         const day = monthStart.day();
//         if ((excludeSunday && day === 0) || (excludeSaturday && day === 6)) {
//           monthStart.add(1, 'day');
//           continue;
//         }
//         slots.push({
//           start_date: monthStart.format('YYYY-MM-DD'),
//           start_time: startHour,
//           end_date: monthStart.format('YYYY-MM-DD'),
//           end_time: endHour,
//         });
//         monthStart.add(1, 'day');
//       }

//       await Promise.all(
//         slots.map((slot) =>
//           api.doctor_api.post('/doctor/create-slot', {
//             doctorId,
//             ...slot,
//           })
//         )
//       );
//     } else {
//       await api.doctor_api.post('/doctor/create-slot', {
//         doctorId,
//         start_date: start.format('YYYY-MM-DD'),
//         start_time: start.format('HH:mm'),
//         end_date: end.format('YYYY-MM-DD'),
//         end_time: end.format('HH:mm'),
//       });
//     }

//     await fetchSlots(currentDate);
//     setLoading(false);
//   };

//   const handleNavigate = (newDate: Date) => {
//     setCurrentDate(newDate);
//     fetchSlots(newDate);
//   };

//   const handleViewChange = (newView: View) => {
//     setView(newView);
//   };

//   useEffect(() => {
//     if (doctorId) {
//       fetchSlots(currentDate);
//     }
//   }, [doctorId, currentDate]);

//   return (
//     <div className='cal-responsive'>
//       {loading && <p>Loading slots...</p>}
//       <Calendar
//         localizer={localizer}
//         events={events}
//         selectable={true}
//         longPressThreshold={1}
//         onSelectSlot={handleSelectSlot}
//         onSelectEvent={handleSelectEvent}
//         startAccessor="start"
//         endAccessor="end"
//         onNavigate={handleNavigate}
//         view={view}
//         onView={handleViewChange}
//         defaultView="month"
//         views={['month', 'week', 'day']}
//         date={currentDate}
//         timeslots={1}
//         step={30}
//         min={new Date(0, 0, 0, 9, 0)}
//         max={new Date(0, 0, 0, 21, 0)}
//         scrollToTime={new Date(0, 0, 0, 9, 0)}
//       />

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             {existingEvent ? (
//               <>
//                 <h3>Mark Slot Unavailable</h3>
//                 <p>
//                   Do you want to remove availability from <br />
//                   <strong>{moment(existingEvent.start).format('LLLL')}</strong> <br />to{' '}
//                   <strong>{moment(existingEvent.end).format('LLLL')}</strong>?
//                 </p>
//               </>
//             ) : (
//               <>
//                 <h3>Confirm Slot</h3>
//                 <p>
//                   Add availability from <br />
//                   <strong>{moment(selectedSlot?.start).format('LLLL')}</strong> <br />to{' '}
//                   <strong>{moment(selectedSlot?.end).format('LLLL')}</strong>
//                 </p>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={repeatMonth}
//                     onChange={() => setRepeatMonth(!repeatMonth)}
//                   />{' '}
//                   Apply same time slot to all remaining days of this month
//                 </label>
//                 <br />
//                 {repeatMonth && (
//                   <>
//                     <label>
//                       <input
//                         type="checkbox"
//                         checked={excludeSaturday}
//                         onChange={() => setExcludeSaturday(!excludeSaturday)}
//                       />{' '}
//                       Exclude Saturdays
//                     </label>
//                     <br />
//                     <label>
//                       <input
//                         type="checkbox"
//                         checked={excludeSunday}
//                         onChange={() => setExcludeSunday(!excludeSunday)}
//                       />{' '}
//                       Exclude Sundays
//                     </label>
//                   </>
//                 )}
//               </>
//             )}
//             <br />
//             <button onClick={handleConfirmSlot} className="form-button">
//               {existingEvent ? 'Make Unavailable' : 'Confirm'}
//             </button>
//             <button onClick={() => setShowModal(false)} className="form-button cancel-button">Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SlotCalendar;



import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, type SlotInfo, type Event, type View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../../api/axiosConfig';
import './slotCalendar.css';

const localizer = momentLocalizer(moment);

const getViewRange = (date: Date, view: View): { start: Date; end: Date } => {
  const momentDate = moment(date);

  switch (view) {
    case 'week':
      return {
        start: momentDate.clone().startOf('week').toDate(),
        end: momentDate.clone().endOf('week').toDate(),
      };
    case 'day':
      return {
        start: momentDate.clone().startOf('day').toDate(),
        end: momentDate.clone().endOf('day').toDate(),
      };
    case 'month':
    default:
      return {
        start: momentDate.clone().startOf('month').toDate(),
        end: momentDate.clone().endOf('month').toDate(),
      };
  }
};

type SlotCalendarProps = {
  doctorId: string;
};

const SlotCalendar: React.FC<SlotCalendarProps> = ({ doctorId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [repeatMonth, setRepeatMonth] = useState(false);
  const [excludeSaturday, setExcludeSaturday] = useState(false);
  const [excludeSunday, setExcludeSunday] = useState(false);
  const [existingEvent, setExistingEvent] = useState<Event | null>(null);

  const fetchSlots = async (start: Date, end: Date) => {
    if (!doctorId) return;
    try {
      setLoading(true);
      const dateList: string[] = [];
      const mStart = moment(start);
      const mEnd = moment(end);
      while (mStart.isSameOrBefore(mEnd, 'day')) {
        dateList.push(mStart.format('YYYY-MM-DD'));
        mStart.add(1, 'day');
      }

      const requests = dateList.map((date) =>
        api.doctor_api.get(`/doctor/slots/${doctorId}/${date}`)
      );

      const results = await Promise.all(requests);
      const slots = results.flatMap((res) =>
        (res as any).data.availableSlots.map((slot: any) => ({
          title: 'Available Slot',
          start: new Date(`${slot.start_date}T${slot.start_time}`),
          end: new Date(`${slot.end_date}T${slot.end_time}`),
          allDay: false,
        }))
      );

      setEvents(slots);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!doctorId) return;
    if (view === 'month') {
      setCurrentDate(slotInfo.start);
      setView('day');
      return;
    }
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setRepeatMonth(false);
    setExcludeSaturday(false);
    setExcludeSunday(false);
    setExistingEvent(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event: Event) => {
    if (!doctorId) return;
    setExistingEvent(event);
    setShowModal(true);
  };

  const handleConfirmSlot = async () => {
    if (!doctorId) return;
    setShowModal(false);
    setLoading(true);

    if (existingEvent) {
      const start = moment(existingEvent.start);
      const end = moment(existingEvent.end);
      try {
        await api.doctor_api.post('/doctor/remove-slot', {
          doctorId,
          start_date: start.format('YYYY-MM-DD'),
          start_time: start.format('HH:mm'),
          end_date: end.format('YYYY-MM-DD'),
          end_time: end.format('HH:mm'),
        });
      } catch (error) {
        console.error('Failed to mark slot unavailable:', error);
      } finally {
        const { start, end } = getViewRange(currentDate, view);
        await fetchSlots(start, end);
        setLoading(false);
      }
      return;
    }

    if (!selectedSlot) return;
    const start = moment(selectedSlot.start);
    const end = moment(selectedSlot.end);

    if (repeatMonth) {
      const startHour = start.format('HH:mm');
      const endHour = end.format('HH:mm');

      const monthStart = start.clone();
      const monthEnd = start.clone().endOf('month');

      const slots = [];
      while (monthStart.isSameOrBefore(monthEnd, 'day')) {
        const day = monthStart.day();
        if ((excludeSunday && day === 0) || (excludeSaturday && day === 6)) {
          monthStart.add(1, 'day');
          continue;
        }
        slots.push({
          start_date: monthStart.format('YYYY-MM-DD'),
          start_time: startHour,
          end_date: monthStart.format('YYYY-MM-DD'),
          end_time: endHour,
        });
        monthStart.add(1, 'day');
      }

      await Promise.all(
        slots.map((slot) =>
          api.doctor_api.post('/doctor/create-slot', {
            doctorId,
            ...slot,
          })
        )
      );
    } else {
      await api.doctor_api.post('/doctor/create-slot', {
        doctorId,
        start_date: start.format('YYYY-MM-DD'),
        start_time: start.format('HH:mm'),
        end_date: end.format('YYYY-MM-DD'),
        end_time: end.format('HH:mm'),
      });
    }

    const { start: rangeStart, end: rangeEnd } = getViewRange(currentDate, view);
    await fetchSlots(rangeStart, rangeEnd);
    setLoading(false);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    const { start, end } = getViewRange(newDate, view);
    fetchSlots(start, end);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
    const { start, end } = getViewRange(currentDate, newView);
    fetchSlots(start, end);
  };

  useEffect(() => {
    if (doctorId) {
      const { start, end } = getViewRange(currentDate, view);
      fetchSlots(start, end);
    }
  }, [doctorId, currentDate, view]);

  return (
    <div className='cal-responsive'>
      {loading && <p>Loading slots...</p>}
      <Calendar
        localizer={localizer}
        events={events}
        selectable={true}
        longPressThreshold={1}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        defaultView="month"
        views={['month', 'week', 'day']}
        date={currentDate}
        timeslots={1}
        step={30}
        min={new Date(0, 0, 0, 9, 0)}
        max={new Date(0, 0, 0, 21, 0)}
        scrollToTime={new Date(0, 0, 0, 9, 0)}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {existingEvent ? (
              <>
                <h3>Mark Slot Unavailable</h3>
                <p>
                  Do you want to remove availability from <br />
                  <strong>{moment(existingEvent.start).format('LLLL')}</strong> <br />to{' '}
                  <strong>{moment(existingEvent.end).format('LLLL')}</strong>?
                </p>
              </>
            ) : (
              <>
                <h3>Confirm Slot</h3>
                <p>
                  Add availability from <br />
                  <strong>{moment(selectedSlot?.start).format('LLLL')}</strong> <br />to{' '}
                  <strong>{moment(selectedSlot?.end).format('LLLL')}</strong>
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={repeatMonth}
                    onChange={() => setRepeatMonth(!repeatMonth)}
                  />{' '}
                  Apply same time slot to all remaining days of this month
                </label>
                <br />
                {repeatMonth && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={excludeSaturday}
                        onChange={() => setExcludeSaturday(!excludeSaturday)}
                      />{' '}
                      Exclude Saturdays
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        checked={excludeSunday}
                        onChange={() => setExcludeSunday(!excludeSunday)}
                      />{' '}
                      Exclude Sundays
                    </label>
                  </>
                )}
              </>
            )}
            <br />
            <button onClick={handleConfirmSlot} className="form-button">
              {existingEvent ? 'Make Unavailable' : 'Confirm'}
            </button>
            <button onClick={() => setShowModal(false)} className="form-button cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotCalendar;
