import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./styles/Layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
