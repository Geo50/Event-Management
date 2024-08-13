// PaymentSuccess.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    console.log("Session ID from URL:", sessionId);

    if (sessionId) {
      handlePaymentSuccess(sessionId);
    } else {
      console.error("Session ID not found in the URL.");
      toast.error("Payment confirmation failed. Please contact support.");
      navigate('/homepage');
    }
  }, [location]);

  const handlePaymentSuccess = async (sessionId: string) => {
    try {
      const response = await axios.post(`https://localhost:7083/api/Stripe/payment-success?SessionId=${sessionId}`);
      console.log("Payment success response:", response.data);
      toast.success('Payment successful! Your ticket has been purchased.');
      // Navigate to a confirmation page or back to the homepage
      navigate('/homepage');
    } catch (error: any) {
      console.error('Error confirming payment:', error.response ? error.response.data : error.message);
      toast.error('Error confirming payment. Please contact support.');
      navigate('/homepage');
    }
  };

  return (
    <div>
      <h2>Processing your payment...</h2>
      {/* You can add a loading spinner here if you want */}
    </div>
  );
};

export default PaymentSuccess;