import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import CreateEvent from "./Components/Create Event/CreateEvent";
import CreateTicket from "./Components/Create Tickets/CreateTicket";
import HomepageRouting from "./Components/Homepage/HomepageRouting";
import ForgotPassword from "./Components/Login/ForgotPassword";
import Login from "./Components/Login/Login";
import Navbar from "./Components/Navbar/Navbar";
import Profile from "./Components/Profile/Profile";
import Registration from "./Components/Registration/Registration";
import ViewTickets from "./Components/View Tickets/ViewTickets";
import StripeProvider from "./Components/Stripe Payment/StripeProvider";
import PaymentSuccess from "./Components/Payment Success/PaymentSuccess";
import { ToastContainer } from "react-toastify";

export const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";

function App() {
  return (
    <BrowserRouter>
      <StripeProvider>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/homepage" />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/homepage/*" element={<HomepageRouting />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/view-tickets" element={<ViewTickets />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </StripeProvider>
    </BrowserRouter>
  );
}

export default App;
