// src/StripeContext.tsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PmetxA1r4JzFYYK0XD849mE49mTyhW0lXtJSCAmd1o3MCREZmL7rZDNic0URFa4SnC86DXWgVigdFxRuZl40tbo00vYAkkny4"
);

const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
  