import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Prediction from "./pages/Prediction";
import Rescue from "./pages/Rescue";
import Medical from "./pages/Medical";
import Resources from "./pages/Resources";
import Agents from "./pages/Agents";
import Assistant from "./pages/Assistant";
import Orchestration from "./pages/Orchestration";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="/app/incidents" element={<Incidents />} />
      <Route path="/app/prediction" element={<Prediction />} />
      <Route path="/app/rescue" element={<Rescue />} />
      <Route path="/app/medical" element={<Medical />} />
      <Route path="/app/resources" element={<Resources />} />
      <Route path="/app/agents" element={<Agents />} />
      <Route path="/app/assistant" element={<Assistant />} />
      <Route path="/app/orchestration" element={<Orchestration />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
