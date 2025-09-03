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

const DonorRequestsSection = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDonorHealthRecord, setSelectedDonorHealthRecord] = useState<Donor['healthRecord'] | null>(null);


    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await api.admin_api.get<Donor[]>("/donor/all");
                setDonors(res.data); // assuming the response is an array
            } catch (error) {
                console.error("Failed to fetch donor requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: 'Accepted' | 'Rejected') => {
        try {
            await api.admin_api.put(`/donor/status/${id}`, { status: newStatus });
            // update local state
            setDonors((prev) =>
                prev.map((donor) =>
                    donor._id === id ? { ...donor, status: newStatus } : donor
                )
            );
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };



    return (
        <div>
            <h2>Donor Requests</h2>
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
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donors.map((donor) => (
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
                                    <td style={{fontSize:'14px', color: donor.status === 'Rejected' ? 'red' : donor.status === 'Accepted' ? 'green' : 'inherit' }}> <strong>{donor.status}</strong></td>
                                    {/* <td>{new Date(donor.createdAt).toLocaleString()}</td> */}
                                    <td>
                                        {donor.healthRecord?.description ? (
                                            <button
                                                className="action-button edit"
                                                onClick={() => setSelectedDonorHealthRecord(donor.healthRecord)}
                                            >
                                                View Record
                                            </button>
                                        ) : (
                                            'No Record'
                                        )}

                                        <button
                                            className="action-button edit"
                                            onClick={() => handleStatusUpdate(donor._id, 'Accepted')}
                                            disabled={donor.status !== 'Pending'}
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="action-button delete"
                                            onClick={() => handleStatusUpdate(donor._id, 'Rejected')}
                                            disabled={donor.status !== 'Pending'}
                                        >
                                            Reject
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedDonorHealthRecord && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Health Record</h3>
                                <p><strong>Description:</strong> {selectedDonorHealthRecord.description}</p>
                                {selectedDonorHealthRecord.fileUrl && (
                                    <img
                                        src={`${process.env.REACT_APP_MEDIA_URL}${selectedDonorHealthRecord.fileUrl}`}
                                        alt="Health Record"
                                        style={{ width: '100%', marginTop: '10px', borderRadius: '6px' }}
                                    />
                                )}
                                <div className="form-buttons" style={{ marginTop: '20px' }}>
                                    <button
                                        className="form-button cancel-button"
                                        onClick={() => setSelectedDonorHealthRecord(null)}
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

export default DonorRequestsSection;
