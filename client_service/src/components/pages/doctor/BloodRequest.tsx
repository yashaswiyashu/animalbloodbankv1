// import React, { useEffect, useState } from 'react';
// import api from '../../../api/axiosConfig';

// interface BloodRequest {
//     _id: string;
//     praniAadharNumber: string;
//     species: string;
//     breed: string;
//     age: number;
//     location: string;
//     quantity: string;
//     reason: string;
//     image?: File | null;
//     healthRecord?: {
//         description: string;
//         fileUrl?: string;
//     };
//     status: string;
//     requestedAt: string;
// }

// const BloodRequestsSection: React.FC = () => {
//     const [requests, setRequests] = useState<BloodRequest[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedHealth, setSelectedHealth] = useState<BloodRequest['healthRecord'] | null>(null);
//     const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);


//     useEffect(() => {
//         const fetchRequests = async () => {
//             try {
//                 const res = await api.doctor_api.get<{ requests: BloodRequest[] }>('/bloodrequest/all');
//                 setRequests(res.data.requests);
//             } catch (err) {
//                 console.error('Error fetching requests:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRequests();
//     }, []);

//     return (
//         <div>
//             <h2>Blood Requests</h2>

//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <div className='table-container'>
//                     <table className="data-table">
//                         <thead>
//                             <tr>
//                                 <th>Prani Aadhar</th>
//                                 <th>Species</th>
//                                 <th>Breed</th>
//                                 <th>Age</th>
//                                 <th>Quantity</th>
//                                 <th>Reason</th>
//                                 <th>Location</th>
//                                 <th>Status</th>
//                                 <th>Image</th>
//                                 <th>Health Record</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {requests.map((req) => (
//                                 <tr key={req._id}>
//                                     <td>{req.praniAadharNumber}</td>
//                                     <td>{req.species}</td>
//                                     <td>{req.breed}</td>
//                                     <td>{req.age}</td>
//                                     <td>{req.quantity}</td>
//                                     <td>{req.reason}</td>
//                                     <td>{req.location}</td>
//                                     <td>{req.status}</td>

//                                     <td>
//                                         {req.image ? (
//                                             <button
//                                                 className="action-button edit"
//                                                 onClick={() =>
//                                                     setSelectedImageUrl(`${process.env.REACT_APP_MEDIA_URL}${req.image}`)
//                                                 }
//                                             >
//                                                 View Image
//                                             </button>
//                                         ) : (
//                                             'No Image'
//                                         )}
//                                     </td>


//                                     <td>
//                                         {req.healthRecord?.description ? (
//                                             <button className="action-button edit" onClick={() => setSelectedHealth(req.healthRecord)}>View</button>
//                                         ) : (
//                                             'No Record'
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {selectedHealth && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <h3>Health Record</h3>
//                         <p><strong>Description:</strong> {selectedHealth.description}</p>
//                         {selectedHealth.fileUrl && (
//                             <img
//                                 src={`${process.env.REACT_APP_MEDIA_URL}${selectedHealth.fileUrl}`}
//                                 alt="Health File"
//                                 style={{ width: '100%', borderRadius: '6px' }}
//                             />
//                         )}
//                         <button className="form-button cancel-button" onClick={() => setSelectedHealth(null)}>Close</button>
//                     </div>
//                 </div>
//             )}

//             {selectedImageUrl && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <h3>Uploaded Image</h3>
//                         <img
//                             src={selectedImageUrl}
//                             alt="Blood Request"
//                             style={{
//                                 width: '100%',
//                                 borderRadius: '6px',
//                                 marginTop: '10px'
//                             }}
//                         />
//                         <div className="form-buttons" style={{ marginTop: '20px' }}>
//                             <button
//                                 className="form-button cancel-button"
//                                 onClick={() => setSelectedImageUrl(null)}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default BloodRequestsSection;









import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import '../../../styles/forms.css';
import '../../../styles/dashboard.css';

interface DonorAnimal {
  _id: string;
  praniAadharNumber: string;
  species: string;
  breed: string;
  age: number;
  bloodGroup: string;
  location: string;
}

interface BloodRequest {
  _id: string;
  praniAadharNumber: string;
  species: string;
  breed: string;
  age: number;
  bloodGroup: string;
  location: string;
  quantity: string;
  reason: string;
  image?: string;
  healthRecord?: {
    description: string;
    fileUrl?: string;
  };
  status: string;
  requestedAt: string;
  matchedDonors?: string[];
}

const BloodRequestsSection: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHealth, setSelectedHealth] = useState<BloodRequest['healthRecord'] | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [speciesDonorMap, setSpeciesDonorMap] = useState<Record<string, DonorAnimal[]>>({});
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string[]>>({});
  const [searchInput, setSearchInput] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.doctor_api.get<{ requests: BloodRequest[] }>('/bloodrequest/all');
        setRequests(res.data.requests);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchDonorsPerSpecies = async () => {
      const uniqueSpecies = [...new Set(requests.map(r => r.species))];
      const resultMap: Record<string, DonorAnimal[]> = {};

      for (const species of uniqueSpecies) {
        try {
          //   const res = await api.admin_api.get<DonorAnimal[]>('/donor/all');
          const res = await api.admin_api.get<DonorAnimal[]>(`/donor/accepted?species=${species}`);
          resultMap[species] = res.data;
        } catch (err) {
          console.error(`Failed to load donors for ${species}`, err);
          resultMap[species] = [];
        }
      }

      setSpeciesDonorMap(resultMap);
    };

    if (requests.length > 0) {
      fetchDonorsPerSpecies();
    }
  }, [requests]);

  const handleApprove = (id: string) => {
    const updated = requests.map(r => r._id === id ? { ...r, status: 'Approved' } : r);
    setRequests(updated);
  };

  const handleReject = (id: string) => {
    const updated = requests.map(r => r._id === id ? { ...r, status: 'Rejected' } : r);
    setRequests(updated);
  };

  const handleSubmitMatch = async (requestId: string) => {
    const selected = matchingSelections[requestId];
    if (!selected || selected.length === 0) return;

    try {
      await api.doctor_api.post(`/bloodrequest/assign-match/${requestId}`, {
        matchedDonors: selected,
      });

      // Update the request status to 'Matched' in local state
      setRequests(prev =>
        prev.map(r =>
          r._id === requestId
            ? { ...r, status: 'Matched' }
            : r
        )
      );

      // Clear matching selection to hide dropdown
      setMatchingSelections(prev => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });

      // Optional: also clear search input
      setSearchInput(prev => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });

      setToast({ type: 'success', message: 'Match Assigned successfully!' });
    } catch (err) {
      console.error('Failed to assign match:', err);
    }
  };


  return (
    <div>
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}
      <h2>Blood Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Prani Aadhar</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Location</th>
                <th>Status</th>
                <th>Image</th>
                <th>Health Record</th>
                <th>Action</th>
                <th>Matching</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const speciesDonors = speciesDonorMap[req.species] || [];
                return (
                  <tr key={req._id}>
                    <td>{req.praniAadharNumber}</td>
                    <td>{req.species}</td>
                    <td>{req.breed}</td>
                    <td>{req.age}</td>
                    <td>{req.bloodGroup}</td>
                    <td>{req.quantity}</td>
                    <td>{req.reason}</td>
                    <td>{req.location}</td>
                    <td>{req.status}</td>
                    <td>
                      {req.image ? (
                        <button className='action-button edit' onClick={() => setSelectedImageUrl(`${process.env.REACT_APP_MEDIA_URL}${req.image}`)}>View Image</button>
                      ) : 'No Image'}
                    </td>
                    <td>
                      {req.healthRecord?.description ? (
                        <button className='action-button edit' onClick={() => setSelectedHealth(req.healthRecord)}>View</button>
                      ) : 'No Record'}
                    </td>
                    <td>
                      {req.status === 'Matched' ? (
                        <span style={{color: 'green', fontSize: '17px', fontWeight: 'bold' }}> ✔Completed</span>

                      ) : (
                        <>
                          <div className='right-wrong-btn-div'>
                            <button
                              className="action-button edit"
                              onClick={() => handleApprove(req._id)}
                              disabled={req.status !== 'Pending'}
                            >
                              ✔
                            </button>
                            <button
                              className="action-button delete"
                              onClick={() => handleReject(req._id)}
                              disabled={req.status !== 'Pending'}
                            >
                              ✘
                            </button>
                          </div>
                        </>
                      )}
                    </td>

                    <td>
                      {req.status === 'Approved' ? (
                        <div className="matching-field">
                          <input
                            type="text"
                            className="matching-search"
                            placeholder="Search donors..."
                            value={searchInput[req._id] || ''}
                            onChange={(e) =>
                              setSearchInput((prev) => ({ ...prev, [req._id]: e.target.value }))
                            }
                          />
                          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '8px', borderRadius: '6px' }}>
                            {speciesDonors
                              .filter(donor => donor.praniAadharNumber.toLowerCase().includes((searchInput[req._id] || '').toLowerCase()))
                              .map((donor) => (
                                <div key={donor._id} style={{ marginBottom: '6px' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                      type="checkbox"
                                      checked={(matchingSelections[req._id] || []).includes(donor._id)}
                                      onChange={(e) => {
                                        const prevSelections = matchingSelections[req._id] || [];
                                        let updatedSelections: string[];
                                        if (e.target.checked) {
                                          updatedSelections = [...prevSelections, donor._id];
                                        } else {
                                          updatedSelections = prevSelections.filter(id => id !== donor._id);
                                        }
                                        setMatchingSelections(prev => ({ ...prev, [req._id]: updatedSelections }));
                                      }}
                                    />
                                    {donor.species} ({donor.breed})
                                  </label>
                                </div>
                              ))}
                          </div>

                          <button
                            className="form-button match-submit"
                            onClick={() => handleSubmitMatch(req._id)}
                          >
                            Submit Match
                          </button>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedHealth && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Health Record</h3>
            <p><strong>Description:</strong> {selectedHealth.description}</p>
            {selectedHealth.fileUrl && (
              <img
                src={`${process.env.REACT_APP_MEDIA_URL}${selectedHealth.fileUrl}`}
                alt="Health File"
                style={{ width: '100%', borderRadius: '6px' }}
              />
            )}
            <button className="form-button cancel-button" onClick={() => setSelectedHealth(null)}>Close</button>
          </div>
        </div>
      )}



      {selectedImageUrl && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Uploaded Image</h3>
            <img
              src={selectedImageUrl}
              alt="Blood Request"
              style={{ width: '100%', borderRadius: '6px', marginTop: '10px' }}
            />
            <button className="form-button cancel-button" onClick={() => setSelectedImageUrl(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequestsSection;

