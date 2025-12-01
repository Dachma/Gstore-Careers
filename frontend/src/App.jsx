import { BrowserRouter, Routes, Route } from "react-router-dom";
import Careers from "./pages/Careers";
import Apply from "./pages/Apply";
import AdminApplications from "./pages/AdminApplications";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <Careers />
            </div>
          }
        />
        <Route
          path="/apply/:vacancyId"
          element={
            <div className="app-container">
              <Apply />
            </div>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute>
              <AdminApplications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
