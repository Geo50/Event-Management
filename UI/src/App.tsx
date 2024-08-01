import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registration from './Components/Registration/Registration';
import Login from './Components/Login/Login';
import ForgotPassword from './Components/Login/ForgotPassword';

export const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/registration' element={<Registration />}></Route>
        <Route path='/' element={<Login />}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
