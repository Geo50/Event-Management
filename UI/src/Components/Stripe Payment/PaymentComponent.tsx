// src/CheckoutForm.tsx
import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm: React.FC = () => {return(<div></div>)}
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!stripe || !elements) return;

//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card: elements.getElement(CardElement)!,
//     });

//     if (error) {
//       console.log('[error]', error);
//     } else {
//       // Send paymentMethod.id to your server
//       try {
//         const response = await axios.post('/api/charge', {
//           paymentMethodId: paymentMethod.id,
//         });

//         // Handle server response
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement />
//       <button type="submit" disabled={!stripe}>
//         Pay
//       </button>
//     </form>
//   );
// };

export default CheckoutForm;
