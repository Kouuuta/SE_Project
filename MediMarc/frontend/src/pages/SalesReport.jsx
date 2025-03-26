import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SalesReport.css";

const SalesReport = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState([]); // Stores customer list
  const [products, setProducts] = useState([]); // Stores product list
  const [itemCode, setItemCode] = useState("");
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/"); // Redirect to login if no token found
    }
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/customers/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/products/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/sales/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSales(response.data); // ✅ Ensures data is properly set
      } catch (error) {
        console.error(
          "Error fetching sales:",
          error.response?.data || error.message
        );
        setSales([]); // ✅ Prevents undefined state
      }
    };

    fetchCustomers();
    fetchProducts();
    fetchSales();
  }, []);

  console.log(sales);

  const handleGenerateReport = async (format) => {
    try {
      const token = localStorage.getItem("access_token");

      const params = new URLSearchParams({
        start_date: dateRange.start || "",
        end_date: dateRange.end || "",
        customer_name: customer || "",
        item_code: itemCode || "",
        format_type: format, // 'csv' or 'pdf'
      });

      const url = `http://127.0.0.1:8000/api/sales-report/?${params.toString()}`;

      console.log("📌 Fetching URL:", url);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      console.log("✅ Response:", response);

      if (response.status !== 200) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const blob = new Blob([response.data], {
        type: format === "pdf" ? "application/pdf" : "text/csv",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.setAttribute("download", `sales_report.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Error generating report:", error);
    }
  };

  const handleLogout = () => {
    // ✅ Clear authentication data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    // ✅ Redirect to login page
    window.location.href = "/";

    // ✅ Prevent back navigation after logout
    setTimeout(() => {
      window.history.replaceState(null, null, "/");
    }, 0);
  };

  return (
    <div className="sales-report-page">
      <div className="sales-report-content">
        <div className="sales-report-form">
          <h2>Sales Report</h2>

          {/* Date Range Inputs */}
          <label>Date Range</label>
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
            <span>TO</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>

          {/* Customer Dropdown */}
          <label>Customer</label>
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.name}>
                {cust.name}
              </option>
            ))}
          </select>

          <label>Item Code</label>
          <select
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
          >
            <option value="">Select Item Code</option>
            {products.map((product) => (
              <option key={product.product_id} value={product.item_code}>
                {product.item_code} - {product.lot_number}
              </option>
            ))}
          </select>

          <div className="report-buttons">
            <button
              className="pdf-btn"
              onClick={() => handleGenerateReport("pdf")}
            >
              Generate PDF REPORT
            </button>
            <button
              className="csv-btn"
              onClick={() => handleGenerateReport("csv")}
            >
              Generate CSV REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
