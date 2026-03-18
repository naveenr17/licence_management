import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import LicensesPage from "./pages/LicensesPage";
import VendorsPage from "./pages/VendorsPage";
import ContractsPage from "./pages/ContractsPage";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="licenses" element={<LicensesPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
