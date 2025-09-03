import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";

interface Appointment {
  _id: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  status: string;
  farmerName: string;
  farmerContact: string;
  type: string;
  species: string;
  praniAadharNumber: string;
  farmer_id: string;
  razorpay_payment_id?: string;
}

const AppointmentSection = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [guardianFilter, setGuardianFilter] = useState<string>("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.admin_api.get("/appointments/appointments-admin");
        setAppointments((res as any).data.appointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const statusMatch = statusFilter === "all" || appt.status === statusFilter;
    const guardianMatch =
      guardianFilter.trim() === "" ||
      appt.farmerName.toLowerCase().includes(guardianFilter.toLowerCase());
    return statusMatch && guardianMatch;
  });

  return (
    <div>
      <h2>Appointments</h2>

      {/* Filter Section */}
      <div style={styles.filterContainer}>
        <label style={styles.label}>Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <label style={styles.label}>Guardian:</label>
        <input
          type="text"
          placeholder="Search by name"
          value={guardianFilter}
          onChange={(e) => setGuardianFilter(e.target.value)}
          style={styles.input}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Prani Guardian</th>
                <th>Species</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6}>No appointments found.</td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.start_date}</td>
                    <td>
                      {appt.start_time} - {appt.end_time}
                    </td>
                    <td>{appt.status}</td>
                    <td>{appt.farmerName}</td>
                    <td>{appt.species}</td>
                    <td>{appt.type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Clean, consistent styles
const styles = {
  filterContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    border: "1px solid #ddd",
    flexWrap: "wrap" as const,
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "150px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "200px",
  },
  label: {
    fontWeight: 500,
  },
};

export default AppointmentSection;
