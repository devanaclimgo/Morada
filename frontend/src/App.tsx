import { Routes, Route } from "react-router-dom";
import NotFoundComponent from "./components/shared/NotFound";
import CalendarPage from "./components/CalendarPage";
import SettingsPage from "./components/SettingsPage";
import DashboardPage from "./components/DashboardPage";
import AccountsPage from "./components/AccountsPage";
import ProfilePage from "./components/ProfilePage";
import TasksPage from "./components/TasksPage";

export function App() {
  return (
    <Routes>
      <Route path="/not_found" element={<NotFoundComponent />} />
      <Route path="/app" element={<DashboardPage />} />
      <Route path="/app/calendar" element={<CalendarPage />} />
      <Route path="/app/settings" element={<SettingsPage />} />
      <Route path="/app/accounts" element={<AccountsPage />} />
      <Route path="/app/profile" element={<ProfilePage />} />
      <Route path="/app/tasks" element={<TasksPage />} />
    </Routes>
  );
}
