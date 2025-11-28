import { BrowserRouter, Routes, Route } from "react-router-dom";
import Careers from "./pages/Careers";
import Apply from "./pages/Apply";
import AdminApplications from "./pages/AdminApplications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Careers />} />
        <Route path="/apply/:vacancyId" element={<Apply />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
      </Routes>
    </BrowserRouter>
  );
}
