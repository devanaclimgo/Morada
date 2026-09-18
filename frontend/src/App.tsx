import { Routes, Route } from "react-router-dom";
import NotFoundComponent from "./components/shared/NotFound";
import CalendarPage from "./components/CalendarPage";
import SettingsPage from "./components/SettingsPage";
import DashboardPage from "./components/DashboardPage";

export function App() {
  return (
    <Routes>
      <Route path="/not_found" element={<NotFoundComponent />} />
      <Route path="/app" element={<DashboardPage />} />
      <Route path="/app/calendar" element={<CalendarPage />} />
      <Route path="/app/settings" element={<SettingsPage />} />
    </Routes>
  );
}
