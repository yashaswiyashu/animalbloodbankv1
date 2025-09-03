// import React, { useEffect, useState } from 'react';
// import api from '../../../api/axiosConfig';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import '../../../styles/dashboard.css';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { log } from 'console';

// interface Lab {
//   _id: string;
//   user_name?: string;
//   user_email?: string;
//   user_phone?: string;
//   city?: string;
//   taluk?: string;
//   district?: string;
//   state?: string;
//   country?: string;
//   pin_code?: string;
//   user_role?: string;
//   lab_type?: string; // optional
// }

// interface GetUsersResponse {
//   message: string;
//   users: Lab[];
// }

// const LabList: React.FC = () => {
//   const [labs, setLabs] = useState<Lab[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   const filteredLabs = labs.filter((lab) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       lab.user_name?.toLowerCase().includes(term) ||
//       lab.user_email?.toLowerCase().includes(term) ||
//       lab.city?.toLowerCase().includes(term) ||
//       lab.taluk?.toLowerCase().includes(term) ||
//       lab.district?.toLowerCase().includes(term) ||
//       lab.state?.toLowerCase().includes(term) ||
//       lab.country?.toLowerCase().includes(term) ||
//       lab.pin_code?.toLowerCase().includes(term)
//     );
//   });

//   const location = useLocation()

//   const fetchLabs = async () => {
//     try {
//       const res = await api.auth_api.get<GetUsersResponse>('/auth/get-labs');
//       setLabs(res.data.users);
//     } catch (error) {
//       console.error('Error fetching labs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchLabs();
//   }, []);

//   const handleBookTest = async (labId: string) => {
//     const animal = location.state?.selectedAnimal;


//     if (!animal) {
//       alert('Animal or owner info missing.');
//       console.log('animal', animal);

//       return;
//     }

//     const locationString = `${animal.city}, ${animal.taluk}, ${animal.district}, ${animal.state}, ${animal.country} - ${animal.pin_code}`;

//     try {
//       await api.farmer_api.post('/bloodtyping/request', {
//         labId,
//         species: animal.species,
//         breed: animal.breed,
//         age: animal.age,
//         location: locationString,
//         ownerName: animal.user_name,
//         ownerPhone: animal.user_phone,
//       });

//       alert('Test request sent successfully');
//     } catch (err) {
//       console.error('Error booking test:', err);
//       alert('Failed to book test');
//     }
//   };


//   return (
//     <div className="center-page">
//       <div className="dashboard-container">
//         <div className="table-container">
//           <div className='doctorList-container'>
//             <Link to="/farmer"><ArrowBackIcon /></Link>
//             <div className="dashboard-header">
//               <h2>Available Labs</h2>
//             </div>

//             <div className="dashboard-content">
//               <input
//                 type="text"
//                 placeholder="Search labs..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-box"
//               />
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Location</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredLabs.map((lab) => (
//                     <tr key={lab._id}>
//                       <td data-label="User Name">{lab.user_name}</td>
//                       <td data-label="Email">{lab.user_email}</td>
//                       <td data-label="Phone">{lab.user_phone}</td>
//                       <td data-label="Location">
//                         {lab.city}, {lab.taluk},<br />
//                         {lab.district}, {lab.state},<br />
//                         {lab.country}, {lab.pin_code}
//                       </td>
//                       <td>
//                         <button
//                           className="form-button"
//                           onClick={() => handleBookTest(lab._id)}
//                         >
//                           Book Test
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {filteredLabs.length === 0 && <p>No labs found.</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LabList;



import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../../../styles/dashboard.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { AuthContext } from '../../../context/AuthContext';

interface Lab {
  _id: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  city?: string;
  taluk?: string;
  district?: string;
  state?: string;
  country?: string;
  pin_code?: string;
  user_role?: string;
}

interface GetUsersResponse {
  message: string;
  users: Lab[];
}

const LabList: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await api.auth_api.get<GetUsersResponse>('/auth/get-labs');
        setLabs(res.data.users);
      } catch (error) {
        console.error('Error fetching labs:', error);
      }
    };

    fetchLabs();
  }, []);

  const filteredLabs = labs.filter((lab) => {
    const term = searchTerm.toLowerCase();
    return (
      lab.user_name?.toLowerCase().includes(term) ||
      lab.user_email?.toLowerCase().includes(term) ||
      lab.city?.toLowerCase().includes(term) ||
      lab.district?.toLowerCase().includes(term) ||
      lab.state?.toLowerCase().includes(term)
    );
  });

  const animal = location.state?.animal;

  useEffect(() => {
  if (!animal) {
    setToast({ type: "error", message: "No animal selected for the blood typing request" });
    navigate('/farmer'); // or wherever fallback should go
  }
}, []);

  const handleBookTest = async (labId: string) => {
  if (!animal) {
    setToast({ type: "error", message: "Animal Info not available" });
    return;
  }

  const locationString = `${animal.city}, ${animal.taluk}, ${animal.district}, ${animal.state}, ${animal.country} - ${animal.pin_code}`;

  try {
    await api.farmer_api.post('/bloodtyping/request', {
      labId,
      species: animal.species,
      breed: animal.breed,
      age: animal.age,
      location: locationString,
    });

    setToast({ type: 'success', message: 'Test Request sent successfully!' });
  } catch (err) {
    console.error('Error booking test:', err);
    setToast({ type: "error", message: "Failed to Book Test" });
  }
};

  return (
    <div className="center-page">
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}
      <div className="dashboard-header"> 
        <Link className="back-button" to="/farmer"><ArrowBackIcon/></Link> 
        <h2>Available Labs</h2>  
      </div>
      <div className="dashboard-container">
        <div className="table-container">
          <div className="doctorList-container">
            {/* <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </button>
            <div className="dashboard-header">
              <h2>Available Labs</h2>
            </div> */}
            <div className="dashboard-content">
              <input
                type="text"
                placeholder="Search labs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-box"
              />
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabs.map((lab) => (
                    <tr key={lab._id}>
                      <td>{lab.user_name}</td>
                      <td>{lab.user_email}</td>
                      <td>{lab.user_phone}</td>
                      <td>
                        {lab.city}, {lab.taluk}, {lab.district}, {lab.state}, {lab.country} - {lab.pin_code}
                      </td>
                      <td>
                        <button
                          className="form-button"
                          onClick={() => handleBookTest(lab._id)}
                        >
                          Book Test
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLabs.length === 0 && <p>No labs found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabList;

