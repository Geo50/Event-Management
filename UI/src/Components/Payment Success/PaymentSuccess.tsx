// PaymentSuccess.tsx
import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      handlePaymentSuccess(sessionId);
    } else {
      toast.error("Payment confirmation failed. Please contact support.");
      navigate('/homepage');
    }
  }, [location]);

  const handlePaymentSuccess = async (sessionId: string) => {
    
    try {   
      const response = await axios.post(`https://localhost:7083/api/Stripe/payment-success?SessionId=${sessionId}`);
      const { ticketId, eventId } = response.data;

      toast.success('Payment successful! Your ticket has been purchased.', {
        autoClose: 2000
      });
      await axios.put(`https://localhost:7083/api/Event/UpdateTicketStatus`, {
        ticketId: ticketId,
        eventId: eventId
      })
      setTimeout(() => {
        navigate('/profile');

      }, 1000)
    } catch (error: any) {
      console.error('Error confirming payment:', error.response ? error.response.data : error.message);
      toast.error('Error confirming payment. Please contact support.');
      navigate('/homepage');
    }
  };

  return (
    <div className='d-flex justify-content-center'>
      <h2>Processing your payment...</h2>
    </div>
  );
};

export default PaymentSuccess;