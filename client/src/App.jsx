import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import GuestLogin from "./pages/auth/GuestLogin";
import Tasks from "./pages/Tasks";
import Profile from "./pages/profile/Profile";
import Projects from "./pages/Projects";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GuestLogin />} />
        <Route path="/guest-login" element={<GuestLogin />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Navigate to="/tasks" replace />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
