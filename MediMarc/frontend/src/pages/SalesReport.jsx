import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../styles/SalesReport.css";
import "../styles/Sales.css";

const SalesReport = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [itemCode, setItemCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
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

    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/sales/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchCustomers();
    fetchSales();
  }, []);

  useEffect(() => {
    if (customer) {
      const filtered =
        customer.value === "all"
          ? sales
          : sales.filter((sale) => sale.customer_name === customer.label);
      setFilteredSales(filtered);
    } else {
      setFilteredSales([]);
    }
  }, [customer, sales]);

  const handleGenerateReport = async (format) => {
    try {
      const token = localStorage.getItem("access_token");
      const params = new URLSearchParams({
        start_date: dateRange.start || "",
        end_date: dateRange.end || "",
        customer_name:
          customer?.label === "All Customers" || !customer?.label
            ? ""
            : customer.label,
        item_code: itemCode?.value === "all" ? "" : itemCode?.value || "",
        format_type: format,
      });

      const url = `http://127.0.0.1:8000/api/sales-report/?${params.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

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
      console.error("Error generating report:", error);
    }
  };

  const customerOptions = [
    { label: "All Customers", value: "all" },
    ...customers.map((c) => ({ label: c.name, value: c.id })),
  ];

  const itemOptions = customer
    ? customer.value === "all"
      ? [
          { label: "All Item Codes", value: "all" },
          ...Array.from(
            new Map(
              sales.map((s) => [
                s.item_code,
                { label: `${s.item_code}`, value: s.item_code },
              ])
            ).values()
          ),
        ]
      : [
          { label: "All Item Codes", value: "all" },
          ...Array.from(
            new Map(
              filteredSales.map((s) => [
                s.item_code,
                { label: `${s.item_code}`, value: s.item_code },
              ])
            ).values()
          ),
        ]
    : [];

  return (
    <div className="sales-report-page">
      <div className="sales-report-content">
        <div className="sales-report-form">
          <h2>Sales Report</h2>

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
              disabled={!dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>

          <label>Customer</label>
          <div className="custom-react-select">
            <Select
              options={customerOptions}
              value={customer}
              onChange={setCustomer}
              placeholder="Select Customer"
              classNamePrefix="react-select"
            />
          </div>

          <label>Item Code</label>
          <div className="custom-react-select">
            <Select
              options={itemOptions}
              value={itemCode}
              disabled={!customer}
              onChange={setItemCode}
              placeholder="Select Item Code"
              classNamePrefix="react-select"
            />
          </div>

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
