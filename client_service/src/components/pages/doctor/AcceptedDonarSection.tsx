import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";

interface Donor {
  _id: string;
  praniAadharNumber: string;
  species: string;
  breed: string;
  age: number;
  weight: string;
  bloodGroup: string;
  location: string;
  image: string;
  healthRecord?: {
    description: string;
    fileUrl?: string;
  };
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

const AcceptedDonorsSection = () => {
  const [acceptedDonors, setAcceptedDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState<Donor['healthRecord'] | null>(null);

  useEffect(() => {
    const fetchAcceptedDonors = async () => {
      try {
        const res = await api.admin_api.get<Donor[]>("/donor/all");
        const onlyAccepted = res.data.filter((donor) => donor.status === "Accepted");
        setAcceptedDonors(onlyAccepted);
      } catch (error) {
        console.error("Failed to fetch accepted donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedDonors();
  }, []);

  return (
    <div>
      <h2>Eligeble Donors</h2>
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
                <th>Weight</th>
                <th>Blood Group</th>
                <th>Location</th>
                <th>Image</th>
                <th>Health Record</th>
              </tr>
            </thead>
            <tbody>
              {acceptedDonors.map((donor) => (
                <tr key={donor._id}>
                  <td>{donor.praniAadharNumber}</td>
                  <td>{donor.species}</td>
                  <td>{donor.breed}</td>
                  <td>{donor.age}</td>
                  <td>{donor.weight}</td>
                  <td>{donor.bloodGroup}</td>
                  <td>{donor.location}</td>
                  <td>
                    {donor.image ? (
                      <img
                        src={`${process.env.REACT_APP_MEDIA_URL}${donor.image}`}
                        alt={donor.species}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {donor.healthRecord?.description ? (
                      <button
                        className="action-button edit"
                        onClick={() => setSelectedHealthRecord(donor.healthRecord)}
                      >
                        View Record
                      </button>
                    ) : (
                      "No Record"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedHealthRecord && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Health Record</h3>
                <p><strong>Description:</strong> {selectedHealthRecord.description}</p>
                {selectedHealthRecord.fileUrl && (
                  <img
                    src={`${process.env.REACT_APP_MEDIA_URL}${selectedHealthRecord.fileUrl}`}
                    alt="Health Record"
                    style={{ width: '100%', marginTop: '10px', borderRadius: '6px' }}
                  />
                )}
                <div className="form-buttons" style={{ marginTop: '20px' }}>
                  <button
                    className="form-button cancel-button"
                    onClick={() => setSelectedHealthRecord(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptedDonorsSection;
