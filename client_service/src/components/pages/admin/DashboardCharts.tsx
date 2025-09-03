import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface DashboardChartsProps {
  completedAppointments: number;
  pendingAppointments: number;
  revenue: number;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  completedAppointments,
  pendingAppointments,
  revenue,
}) => {
  const appointmentData = [
    {
      name: "Completed",
      count: completedAppointments,
    },
    {
      name: "Pending",
      count: pendingAppointments,
    },
  ];

  const revenueData = [
    {
      name: "Total Revenue",
      amount: revenue,
    },
  ];

  return (
    <div className="dashboard-charts">
      <div style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
        <h3>Appointment Status</h3>
        <ResponsiveContainer>
          <BarChart data={appointmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#D32D50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <h3>Revenue Overview</h3>
        <ResponsiveContainer>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#00A8A8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
