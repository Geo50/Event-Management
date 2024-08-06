import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Homepage from './Components/Homepage/Homepage';
import ForgotPassword from './Components/Login/ForgotPassword';
import Login from './Components/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import Registration from './Components/Registration/Registration';
import CreateEvent from './Components/Create Event/CreateEvent';

export const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";


function App() {
  return (
    <BrowserRouter>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Navigate to ="/homepage" />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/login' element={<Login />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
} 

export default App;
