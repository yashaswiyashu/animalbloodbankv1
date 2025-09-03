import GroupsIcon from "@mui/icons-material/Groups";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AccountBalanceSharpIcon from '@mui/icons-material/AccountBalanceSharp';
import { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import DashboardCharts from "./DashboardCharts";

interface PaymentSummary {
  totalRevenue: number;
  totalPayments: number;
}

const AdminInfo = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bookedApp, setBookedApp] = useState([]);
  const [revenue, setRevenue] = useState<PaymentSummary>({
    totalPayments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.admin_api.get(`/auth/get-users/doctor`);
        setDoctors((res as any).data.users || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    const fetchCompletedAppointments = async () => {
      try {
        const res = await api.admin_api.get(`/appointments/appointments-completed`);
        setAppointments((res as any).data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch completed appointments:", error);
      }
    };

    const fetchPendingAppointments = async () => {
      try {
        const res = await api.admin_api.get(`/appointments/appointments-booked`);
        setBookedApp((res as any).data.appointments || []);
      } catch (error) {
        console.error("Failed to fetch pending appointments:", error);
      }
    };

    const fetchRevenue = async () => {
      try {
        const res = await api.admin_api.get<PaymentSummary>(`/payments/total-revenue`);
        const { totalRevenue, totalPayments } = res.data;
        setRevenue({ totalRevenue, totalPayments });
      } catch (error) {
        console.error("Failed to fetch revenue:", error);
      }
    };

    fetchUsers();
    fetchCompletedAppointments();
    fetchPendingAppointments();
    fetchRevenue();
  }, []);

  return (
    <div className="admin-info">
      <div className="dashboard-layout">
        <div className="dashboard-cards">
          {[
            {
              icon: <GroupsIcon sx={{ fontSize: 42 }} />,
              label: "Total Veterinarians",
              value: doctors.length,
            },
            {
              icon: <VolunteerActivismIcon sx={{ fontSize: 42 }} />,
              label: "Appointments Completed",
              value: appointments.length,
            },
            {
              icon: <HealthAndSafetyIcon sx={{ fontSize: 42 }} />,
              label: "Pending Appointments",
              value: bookedApp.length,
            },
            {
              icon: <AccountBalanceSharpIcon sx={{ fontSize: 42 }} />,
              label: "Total Revenue",
              value: `₹ ${revenue.totalRevenue / 100}`,
            },
          ].map((card, idx) => (
            <div className="card" key={idx}>
              <div style={{ marginBottom: '8px', color: '#b3001b' }}>{card.icon}</div>
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          ))}
        </div>

        {/* Optional chart placeholders - replace with Chart.js or Recharts */}
        <div className="dashboard-charts">
          <h3>Insights</h3>
          <DashboardCharts
            completedAppointments={appointments.length}
            pendingAppointments={bookedApp.length}
            revenue={revenue.totalRevenue}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
