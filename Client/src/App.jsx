import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TeamMembers from "./pages/TeamMembers";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="text-center">Welcon</div>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team/:teamId/members" element={<TeamMembers />} />
        <Route path="/team/:teamId/member/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
