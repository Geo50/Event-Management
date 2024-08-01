import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Homepage from './Components/Homepage/Homepage';
import ForgotPassword from './Components/Login/ForgotPassword';
import Login from './Components/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import Registration from './Components/Registration/Registration';

export const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";


function App() {
  return (
    <BrowserRouter>
    <Navbar></Navbar>
      <Routes>
        <Route path='/registration' element={<Registration />}></Route>
        <Route path='/' element={<Login />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
        <Route path="/homepage" element={<Homepage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
