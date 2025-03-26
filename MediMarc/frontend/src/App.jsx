import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserManagement from "./pages/UserManagement";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Categories from "./pages/Categories";
import CustomerManagement from "./pages/CustomerManagement";
import ProductManagement from "./pages/ProductManagement";
import Sales from "./pages/Sales";
import SalesReport from "./pages/SalesReport";
import ActivityLog from "./pages/ActivityLog";
import { Toaster } from "sonner";
import { ConfirmDialog } from "primereact/confirmdialog";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <ConfirmDialog richColors />
      <Router>
        <Routes>
          {/* Route without Layout */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:uidb64/:token"
            element={<ResetPassword />}
          />

          {/* Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reports" element={<SalesReport />} />
            <Route path="/activity-logs" element={<ActivityLog />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
