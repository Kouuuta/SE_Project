import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./components/Hompage";
import Product from "./components/Product";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* Homepage */}
        <Route path="/Homepage" element={<Homepage />} /> {/* Homepage */}
        <Route path="/Product" element={<Product />} /> {/* Homepage */}
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

export default App;
