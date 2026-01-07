import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TeamMembers from "./pages/team";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="text-center">Welcon</div>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team/:teamId/members" element={<TeamMembers />} />
      </Routes>
    </Router>
  );
}

export default App;
