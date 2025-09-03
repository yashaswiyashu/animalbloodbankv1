import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../api/axiosConfig';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Slot {
  start: Date;
  end: Date;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  doctorId: string;
  slot: Slot;
  onPaymentSuccess: (razorpay_payment_id: string) => void;
  onFailure: () => void;
}

interface RazorpayKeyResponse {
  key: string;
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

const PaymentConfirmModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  onPaymentSuccess,
  onFailure
}) => {
  const [payment_id, setpayment_id] = useState("")
  const auth = useContext(AuthContext);
  const FarmerId = auth?.user?.id;
  if (!auth) throw new Error('AuthContext must be used inside provider');

  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      const { data: razorpayKey } = await api.payment_api.get<RazorpayKeyResponse>("/v1/razorpay/getkey");
      const { data: orderData } = await api.payment_api.post<RazorpayOrderResponse>('/v1/razorpay/payment', {
        amount: amount,
        currency: 'INR',
      });

      const options = {
        key: razorpayKey.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Doctor Appointment',
        description: description,
        order_id: orderData.id,
        prefill: {
          name: auth.user?.name,
          email: auth.user?.email,
          contact: '9999999999',
        },
        theme: { color: '#007bff' },
        handler: async function (response: any) {
          
          try {
            const verifyRes = await api.payment_api.post('/v1/razorpay/paymentVerification', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderData.amount,
              farmer_id: FarmerId,
            });

            console.log(verifyRes);
            

            if ((verifyRes as any).data.status === 'success') {
              // console.log('Payment successful:', response.razorpay_payment_id);
              // console.log('Payment verification successful:', verifyRes.data);
              
              onPaymentSuccess((verifyRes as any).data.transactionId);
            }
          } catch (err) {
            console.error('Verification API error:', err);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user.");
            onFailure();
          }
        }
      };


      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment initiation failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm Appointment Booking</h3>
        <p>{description}</p>
        <h4>Amount: ₹{amount}</h4>

        <div className="form-buttons">
          <button onClick={handlePayment} className="form-button">Pay Now</button>
          <button onClick={onClose} className="form-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmModal;

