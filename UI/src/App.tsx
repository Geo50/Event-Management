import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registration from './Components/Registration/Registration';
import Login from './Components/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/registration' element={<Registration />}></Route>
        <Route path='/' element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
