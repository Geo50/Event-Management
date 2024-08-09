import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";

const HomepageRouting: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
};

export default HomepageRouting;
