// import React,{useContext} from 'react';
// import '../../../styles/forms.css';
// import '../../../styles/dashboard.css';
// import { AuthContext } from '../../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const LabDashboard: React.FC = () => {


// const context = useContext(AuthContext);
// const navigate = useNavigate();
// const labId = context?.user?.id;

//   const handleLogout = () => {
//     if (context) {
//       context.logout();
//       navigate('/login');
//     }
//   };


//   return (
//     <div className="center-page">
//       <div className="dashboard-container">
//         <div className="dashboard-header">
//           <h2>Lab Dashboard</h2>
//           <button className="form-button" onClick={handleLogout}>Logout</button>
//         </div>

//         <div className="dashboard-content">
//           <h2>Welcome to the Animal Blood Testing Labs</h2>

//           <div className="table-container">
//             <h3 className='entry_type'>Blood Testing Requests</h3>
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Species</th>
//                   <th>age</th>
//                   <th>breed</th>
//                   <th>Phone</th>
//                   <th>Email</th>
//                   <th>Address</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>

//                 </tr>
//                 {/* Add more dummy rows if needed */}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LabDashboard;



import React, { useEffect, useState, useContext } from 'react';
import api from '../../../api/axiosConfig';
import '../../../styles/dashboard.css';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BloodTypingRequest {
    _id: string;
    species: string;
    breed: string;
    age: number;
    location: string;
    status: string;
    requestedAt: string;
}


const LabDashboard: React.FC = () => {
    const [requests, setRequests] = useState<BloodTypingRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const labId = context?.user?.id;

    const handleLogout = () => {
        if (context) {
            context.logout();
            navigate('/login');
        }
    };


    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.farmer_api.get<{ requests: BloodTypingRequest[] }>(`/bloodtyping/lab/${labId}`);
                setRequests(res.data.requests);
            } catch (err) {
                console.error('Failed to load blood typing requests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [labId]);

    return (
        <div className="center-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Lab Dashboard</h2>
                    <button className="form-button" onClick={handleLogout}>Logout</button>
                </div>
                <div className="dashboard-content">
                    <h3>Blood Typing Requests</h3>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Species</th>
                                        <th>Breed</th>
                                        <th>Age</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Requested At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req) => (
                                        <tr key={req._id}>
                                            <td>{req.species}</td>
                                            <td>{req.breed}</td>
                                            <td>{req.age}</td>
                                            <td>{req.location}</td>
                                            <td>{req.status}</td>
                                            <td>{new Date(req.requestedAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LabDashboard;


