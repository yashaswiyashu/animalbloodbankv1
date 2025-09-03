
// import React, { useEffect, useState } from 'react';
// import api from '../../../api/axiosConfig';

// interface DonorAnimal {
//   _id: string;
//   praniAadharNumber: string;
//   species: string;
//   breed: string;
//   age: number;
//   bloodGroup: string;
//   location: string;
// }

// interface BloodRequest {
//   _id: string;
//   praniAadharNumber: string;
//   species: string;
//   breed: string;
//   age: number;
//   location: string;
//   quantity: string;
//   reason: string;
//   status: string;
//   matchedDonors: DonorAnimal[]; // populated with donor details
// }

// const MatchedBloodRequests: React.FC = () => {
//   const [matchedRequests, setMatchedRequests] = useState<BloodRequest[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMatchedRequests = async () => {
//       try {
//         const res = await api.doctor_api.get<BloodRequest[]>('/bloodrequest/matched');
//         setMatchedRequests(res.data);
//         // console.log('response',res.data);
        
//       } catch (err) {
//         console.error('Failed to fetch matched requests:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchedRequests();
//   }, []);

//   return (
//     <div>
//       <h2>Approved Blood Requests with Matched Donors</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         matchedRequests.map((req) => (
//           <div key={req._id} style={{ display: 'flex', gap: '40px', marginBottom: '40px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
//             {/* Requested Animal Info */}
//             <div style={{ flex: 1 }}>
//               <h3>Requested Animal</h3>
//               <p><strong>Prani Aadhar:</strong> {req.praniAadharNumber}</p>
//               <p><strong>Species:</strong> {req.species}</p>
//               <p><strong>Breed:</strong> {req.breed}</p>
//               <p><strong>Age:</strong> {req.age}</p>
//               <p><strong>Location:</strong> {req.location}</p>
//               <p><strong>Quantity:</strong> {req.quantity}</p>
//               <p><strong>Reason:</strong> {req.reason}</p>
//             </div>

//             {/* Matched Donor Animals */}
//             <div style={{ flex: 2 }}>
//               <h3>Matched Donor Animals</h3>
//               {req.matchedDonors && req.matchedDonors.length > 0 ? (
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Prani Aadhar</th>
//                       <th>Species</th>
//                       <th>Breed</th>
//                       <th>Age</th>
//                       <th>Blood Group</th>
//                       <th>Location</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {req.matchedDonors.map(donor => (
//                       <tr key={donor._id}>
//                         <td>{donor.praniAadharNumber}</td>
//                         <td>{donor.species}</td>
//                         <td>{donor.breed}</td>
//                         <td>{donor.age}</td>
//                         <td>{donor.bloodGroup}</td>
//                         <td>{donor.location}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No donors matched.</p>
//               )}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MatchedBloodRequests;



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
  location: string;
  quantity: string;
  reason: string;
  status: string;
  matchedDonors: DonorAnimal[];
}

const MatchedBloodRequests: React.FC = () => {
  const [matchedRequests, setMatchedRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedRequests = async () => {
      try {
        const res = await api.doctor_api.get<BloodRequest[]>('/bloodrequest/matched');
        setMatchedRequests(res.data);
      } catch (err) {
        console.error('Failed to fetch matched requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedRequests();
  }, []);

  return (
    <div>
      <h2>Matched Blood Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{color:'black'}} colSpan={6}>Requested Animal</th>
              <th style={{color:'black'}} colSpan={6}>Matched Donor Animal</th>
            </tr>
            <tr>
              {/* Requested Animal Headers */}
              <th>Prani Aadhar</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Location</th>
              <th>Reason</th>

              {/* Donor Headers */}
              <th>Prani Aadhar</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Blood Group</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {matchedRequests.map((req) =>
              req.matchedDonors && req.matchedDonors.length > 0 ? (
                req.matchedDonors.map((donor, index) => (
                  <tr className="matched-row-group" key={`${req._id}-${donor._id}`}>
                    {index === 0 ? (
                      <>
                        <td rowSpan={req.matchedDonors.length}>{req.praniAadharNumber}</td>
                        <td rowSpan={req.matchedDonors.length}>{req.species}</td>
                        <td rowSpan={req.matchedDonors.length}>{req.breed}</td>
                        <td rowSpan={req.matchedDonors.length}>{req.age}</td>
                        <td rowSpan={req.matchedDonors.length}>{req.location}</td>
                        <td rowSpan={req.matchedDonors.length}>{req.reason}</td>
                      </>
                    ) : null}

                    {/* Donor Data */}
                    <td>{donor.praniAadharNumber}</td>
                    <td>{donor.species}</td>
                    <td>{donor.breed}</td>
                    <td>{donor.age}</td>
                    <td>{donor.bloodGroup}</td>
                    <td>{donor.location}</td>
                  </tr>
                ))
              ) : (
                <tr key={req._id}>
                  {/* Requested Animal */}
                  <td>{req.praniAadharNumber}</td>
                  <td>{req.species}</td>
                  <td>{req.breed}</td>
                  <td>{req.age}</td>
                  <td>{req.location}</td>
                  <td>{req.reason}</td>

                  {/* No donors */}
                  <td colSpan={6} style={{ textAlign: 'center' }}>No matched donors</td>
                </tr>
              )
            )}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default MatchedBloodRequests;
