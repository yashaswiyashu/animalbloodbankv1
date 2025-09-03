import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";

interface Payment {
  _id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

const PaymentsSection = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.admin_api.get("/payments/payments-admin");
        setPayments((res as any).data.payments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Payment Information</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pmt) => (
                <tr key={pmt._id}>
                  <td>{new Date(pmt.createdAt).toLocaleString()}</td>
                  <td>{pmt.razorpay_payment_id}</td>
                  <td>{pmt.razorpay_order_id}</td>
                  <td>₹{(pmt.amount / 100).toFixed(2)}</td>
                  <td>{pmt.currency}</td>
                  <td>{pmt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsSection;
