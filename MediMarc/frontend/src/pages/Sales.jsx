import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import "../styles/Sales.css";
import { toast } from "sonner";
import { confirmDialog } from "primereact/confirmdialog";

const Sales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]); // ✅ Ensures sales is never undefined
  const [dailyPage, setDailyPage] = useState(1);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isEditSaleOpen, setIsEditSaleOpen] = useState(false);
  const [editSale, setEditSale] = useState(null);

  const loggedInUserId = localStorage.getItem("userId") || "";
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserType = loggedInUser.user_type_display;
  console.log(loggedInUserType);

  const [dailySales, setDailySales] = useState({
    results: [],
    current_page: 1,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const [monthlySales, setMonthlySales] = useState({
    results: [],
    current_page: 1,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: customer.name,
  }));

  // States for Add Sale Modal
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    invoiceNumber: "",
    itemCode: "",
    productName: "",
    productId: "",
    sellingPrice: "",
    quantity: "",
    total: "",
    date: "",
    lotNumber: "", // ✅ Add Lot Number
    expirationDate: "", // ✅ Add Expiration Date
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/"); // Redirect to login if no token found
    }
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/sales/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 Sales Data Fetched:", response.data);
        setSales(response.data); // ✅ Ensure state is updated correctly
      } catch (error) {
        console.error(
          "❌ Error fetching sales:",
          error.response?.data || error.message
        );
        setSales([]); // Prevent empty UI when API fails
      }
    };

    fetchSales();
  }, []);

  const filterDailySales = (sales) => sales; // Just return all sales without filtering
  const filterMonthlySales = (sales) => sales; // Just return all sales without filtering

  useEffect(() => {
    const fetchSummarySales = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const [dailyRes, monthlyRes] = await Promise.all([
          axios.get(
            `http://localhost:8000/api/sales/daily/?page=${dailyPage}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:8000/api/sales/monthly/?page=${monthlyPage}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        // Debugging logs to inspect fetched data before filtering
        console.log("📌 Daily Sales Data Fetched:", dailyRes.data.sales);
        console.log("📌 Monthly Sales Data Fetched:", monthlyRes.data.sales);

        const filteredDailySales = filterDailySales(dailyRes.data.sales);
        const filteredMonthlySales = filterMonthlySales(monthlyRes.data.sales);

        // Log filtered sales data to confirm the filtering logic
        console.log("📌 Filtered Daily Sales:", filteredDailySales);
        console.log("📌 Filtered Monthly Sales:", filteredMonthlySales);

        setDailySales({
          ...dailyRes.data,
          sales: filteredDailySales,
        });

        setMonthlySales({
          ...monthlyRes.data,
          sales: filteredMonthlySales,
        });
      } catch (error) {
        console.error("Error fetching sales summaries:", error);
      }
    };

    fetchSummarySales();
  }, [dailyPage, monthlyPage]);

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

  const handleDeleteSale = async (saleId) => {
    console.log(`📌 Attempting to delete sale: ${saleId}`);

    if (!saleId) {
      toast.error("Invalid sale ID.", { duration: 2000 });
      return;
    }

    confirmDialog({
      message: "Are you sure you want to delete this sale?",
      header: "Confirm Deletion",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "custom-delete-accept-btn",
      rejectClassName: "custom-delete-cancel-btn",
      className: "custom-delete-dialog",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      accept: async () => {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) {
            toast.error("Unauthorized. Please log in again.", {
              duration: 2000,
            });
            console.error("❌ No token found. Redirecting to login.");
            navigate("/");
            return;
          }

          console.log(`📌 Deleting Sale ID: ${saleId}`);
          console.log(
            `📌 DELETE URL: http://localhost:8000/api/sales/${saleId}/delete/`
          );
          console.log(saleId);

          const response = await axios.delete(
            `http://localhost:8000/api/sales/${saleId}/delete/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200) {
            setSales((prevSales) =>
              prevSales.filter((sale) => sale.id !== saleId)
            );
            toast.success("Sale deleted successfully!", { duration: 2000 });
          }
        } catch (error) {
          console.error(
            "❌ Error deleting sale:",
            error.response?.data || error.message
          );

          if (error.response?.status === 403) {
            toast.error("Access denied. Please check your authentication.");
          } else if (error.response?.status === 404) {
            toast.error("Sale not found. It may have been deleted already.");
          } else {
            toast.error("Failed to delete sale.", { duration: 2000 });
          }
        }
      },
      reject: () => {
        toast.info("Deletion cancelled.", { duration: 2000 });
      },
    });
  };

  useEffect(() => {
    // ✅ Move fetchDropdownData ABOVE useEffect
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Fetch customers
        const customerResponse = await axios.get(
          "http://localhost:8000/api/sales/customers/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCustomers(customerResponse.data);

        // Fetch products
        const productResponse = await axios.get(
          "http://localhost:8000/api/sales/products/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(productResponse.data);
      } catch (error) {
        console.error(
          "Error fetching dropdown data:",
          error.response?.data || error.message
        );
      }
    };

    // ✅ Now use fetchDropdownData in useEffect
    fetchDropdownData();
  }, [page]);

  const openAddSale = () => setIsAddSaleOpen(true);
  const closeAddSale = () => setIsAddSaleOpen(false);

  const openEditSale = (sale) => {
    setEditSale({ ...sale });
    setIsEditSaleOpen(true);
  };

  const closeEditSale = () => {
    setEditSale(null);
    setIsEditSaleOpen(false);
  };

  const handleAddSale = async () => {
    console.log("📌 Selected Customer:", selectedCustomer);

    if (!selectedCustomer) {
      toast.error("Please select a customer before adding a sale.", {
        duration: 2000,
      });
      return;
    }

    if (!newSale.productId || !newSale.quantity || !newSale.date) {
      toast.warning("All fields are required!", { duration: 2000 });
      return;
    }

    // Ensure correct product ID from Product Management
    const customerObj = customers.find(
      (customer) => customer.id === parseInt(selectedCustomer, 10)
    );
    const productObj = products.find(
      (product) =>
        parseInt(product.product_id, 10) === parseInt(newSale.productId, 10)
    );

    if (!customerObj || !productObj) {
      toast.error("Invalid customer or product selection!", { duration: 2000 });
      return;
    }

    // Aggregate quantities for the same item (same item_code, lot_number, expiration_date)
    const combinedQuantity = newSale.quantity; // You may need to modify this to aggregate based on the selected products

    const salePayload = {
      invoice_number: newSale.invoiceNumber,
      customer: parseInt(customerObj.id, 10),
      product: parseInt(productObj.product_id, 10),
      quantity: combinedQuantity, // Use aggregated quantity
      total: parseFloat(newSale.total),
      date: newSale.date,
      lotNumber: productObj.lot_number,
      expirationDate: productObj.expiration_date,
      status: "Pending", // Set default status to "Pending"
    };

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/sales/add/",
        salePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update sales list
      setSales([...sales, response.data]);

      // Update product stock (subtract the sold quantity)
      const updatedProducts = products.map((product) =>
        product.product_id === productObj.product_id
          ? {
              ...product,
              stock: product.stock - combinedQuantity, // Subtract the sold quantity from stock
            }
          : product
      );

      setProducts(updatedProducts); // Update product list with new stock

      toast.success("Sale added successfully!", { duration: 2000 });

      // Reset form
      setNewSale({
        itemCode: "",
        productName: "",
        sellingPrice: "",
        productId: "",
        quantity: "",
        total: "",
        date: "",
        lotNumber: "",
        expirationDate: "",
      });
    } catch (error) {
      console.error("❌ Error adding sale:", error);
      toast.error("Failed to add sale.", { duration: 2000 });
    }
  };

  const handleEditSale = async () => {
    if (!editSale || !editSale.id) {
      toast.warning("Sale ID is missing.", { duration: 2000 });
      return;
    }

    // ✅ Block edits if status is "Delivered"
    if (editSale.status === "Delivered") {
      toast.error("Cannot edit a delivered sale.", { duration: 2000 });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/sales/${editSale.id}/edit/`,
        {
          product: parseInt(editSale.product, 10),
          quantity: parseInt(editSale.quantity, 10),
          total: parseFloat(editSale.total),
          date: editSale.date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSales(
        sales.map((sale) => (sale.id === editSale.id ? response.data : sale))
      );

      toast.success("Sale updated successfully!", { duration: 2000 });
      setIsEditSaleOpen(false);
    } catch (error) {
      console.error(
        "❌ Error updating sale:",
        error.response?.data || error.message
      );
      toast.error("Failed to update sale.", { duration: 2000 });
    }
  };

  const handleStatusChange = async (saleId, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.put(
        `http://localhost:8000/api/sales/${saleId}/update-status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Sale status updated to ${newStatus}`);

      // If status is 'Delivered', subtract the sold quantity from stock
      if (newStatus === "Delivered") {
        const product = response.data.product; // Assuming this includes product data
        const quantitySold = response.data.quantity; // Assuming the quantity is available in response

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.product_id === product.product_id
              ? {
                  ...product,
                  stock: product.stock - quantitySold, // Subtract the sold quantity from stock
                }
              : product
          )
        );
      }

      // Update sales with the new status
      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale.id === saleId ? { ...sale, status: response.data.status } : sale
        )
      );
    } catch (error) {
      console.error("❌ Error updating sale status:", error);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };
  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") {
      return "₱0.00";
    }

    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return "₱0.00";
    }

    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="sales-page-management">
      <div className="sales-page">
        <main className="sales-content">
          <div className="sales-details-container">
            <div className="sales-details">
              <h2>Sales</h2>
              <div className="sales-header">
                <Select
                  options={customerOptions}
                  className="custom-react-select"
                  classNamePrefix="react-select"
                  onChange={(selectedOption) =>
                    setSelectedCustomer(selectedOption.value)
                  }
                  placeholder="Select Customer"
                />
                {loggedInUserType &&
                  (loggedInUserType === "SUPER ADMIN" ||
                    loggedInUserType === "Admin") && (
                    <button className="add-sale-btn" onClick={openAddSale}>
                      Add Sales
                    </button>
                  )}
              </div>
              <div className="scrollable-sales-table ">
                <table>
                  <thead>
                    <tr>
                      <th>SI No.</th>
                      <th>Date Invoice</th>
                      <th>Item Code</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Lot Number</th>
                      <th>Expiration Date</th>
                      {loggedInUserType === "SUPER ADMIN" && <th>Status</th>}
                      {loggedInUserType === "SUPER ADMIN" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {sales && sales.length > 0 ? (
                      sales
                        .filter(
                          (sale) =>
                            sale.customer === parseInt(selectedCustomer, 10)
                        )
                        .sort((a, b) => b.id - a.id)
                        .map((sale, index) => (
                          <tr key={`${sale.id}-${index}`}>
                            <td>
                              {sale.invoice_number ||
                                String(sale.id).padStart(4, "0")}
                            </td>
                            <td>{sale.date}</td>
                            <td>{sale.item_code}</td>
                            <td>{sale.product_name}</td>
                            <td>{formatNumber(sale.quantity)}</td>
                            <td>₱{formatCurrency(sale.total)}</td>
                            <td>{sale.lot_number}</td>
                            <td>{sale.expiration_date}</td>
                            {loggedInUserType === "SUPER ADMIN" && (
                              <td>
                                <select
                                  className="sales-status-dropdown"
                                  value={sale.status}
                                  onChange={(e) =>
                                    handleStatusChange(sale.id, e.target.value)
                                  }
                                  disabled={sale.status === "Delivered"}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Cancelled">Cancelled</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </td>
                            )}
                            {loggedInUserType === "SUPER ADMIN" && (
                              <td>
                                <button
                                  className="sales-action-btn"
                                  onClick={() => openEditSale(sale)}
                                  disabled={sale.status === "Delivered"}
                                  title={
                                    sale.status === "Delivered"
                                      ? "Cannot edit a delivered sale"
                                      : ""
                                  }
                                  style={{
                                    color: "green",
                                    cursor:
                                      sale.status === "Delivered"
                                        ? "not-allowed"
                                        : "pointer",
                                    opacity:
                                      sale.status === "Delivered" ? 0.5 : 1,
                                  }}
                                >
                                  ✏
                                </button>
                                <button
                                  className="sales-action-btn"
                                  onClick={() => handleDeleteSale(sale.id)}
                                >
                                  🗑
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="10">No sales data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {isEditSaleOpen && editSale && (
          <div className="edit-sale-modal-overlay" onClick={closeEditSale}>
            <div
              className="edit-sale-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Edit Sale</h2>
              <form>
                <input
                  type="date"
                  value={editSale.date}
                  onChange={(e) =>
                    setEditSale({ ...editSale, date: e.target.value })
                  }
                />
                <input
                  type="text"
                  disabled
                  placeholder="Product ID"
                  value={editSale.product_id}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Enter Selling Price"
                  value={editSale.sellingPrice}
                  onChange={(e) =>
                    setEditSale({ ...editSale, sellingPrice: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Enter Quantity"
                  value={editSale.quantity}
                  onChange={(e) => {
                    const quantity = e.target.value;
                    const total = editSale.sellingPrice
                      ? parseFloat(editSale.sellingPrice) *
                        parseInt(quantity || 0, 10)
                      : 0;
                    setEditSale({ ...editSale, quantity, total });
                  }}
                />
                <input
                  type="number"
                  placeholder="Total"
                  value={editSale.total}
                  readOnly
                />
                <div className="modal-actions">
                  <button
                    className="discard-btn"
                    type="button"
                    onClick={closeEditSale}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-btn"
                    type="button"
                    onClick={handleEditSale}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Sale Modal */}
        {isAddSaleOpen && (
          <div className="add-sale-modal-overlay" onClick={closeAddSale}>
            <div
              className="add-sale-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Add Sales</h2>
              <form>
                <input
                  type="text"
                  placeholder="Enter Sales Invoice No."
                  value={newSale.invoiceNumber}
                  onChange={(e) =>
                    setNewSale({ ...newSale, invoiceNumber: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={newSale.date}
                  onChange={(e) =>
                    setNewSale({ ...newSale, date: e.target.value })
                  }
                />
                <Select
                  options={products.map((product) => ({
                    value: product.product_id,
                    label: `${product.item_code} - ${product.lot_number} - ${product.stock}`,
                  }))}
                  className="custom-react-add-select"
                  classNamePrefix="react-select"
                  placeholder="Select Product"
                  isSearchable={true}
                  onChange={(selectedOption) => {
                    const selectedProduct = products.find(
                      (product) => product.product_id === selectedOption.value
                    );

                    console.log(
                      "📌 Selected Product from Product Management:",
                      selectedProduct
                    );

                    setNewSale({
                      ...newSale,
                      productId: selectedProduct?.product_id || "",
                      itemCode: selectedProduct?.item_code || "",
                      productName: selectedProduct?.product_name || "",
                      sellingPrice: selectedProduct?.selling_price || "",
                      lotNumber: selectedProduct?.lot_number || "N/A",
                      expirationDate: selectedProduct?.expiration_date || "N/A",
                    });
                  }}
                />

                <input
                  type="text"
                  placeholder="Enter Product Name"
                  value={newSale.productName}
                  readOnly
                  onChange={(e) =>
                    setNewSale({ ...newSale, productName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Enter Selling Price"
                  value={newSale.sellingPrice}
                  onChange={(e) =>
                    setNewSale({ ...newSale, sellingPrice: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Enter Quantity"
                  value={newSale.quantity}
                  onChange={(e) => {
                    const quantity = e.target.value;
                    const total = newSale.sellingPrice
                      ? parseFloat(newSale.sellingPrice) *
                        parseInt(quantity || 0, 10)
                      : 0;
                    setNewSale({ ...newSale, quantity, total });
                  }}
                />
                <input
                  type="text"
                  placeholder="Total"
                  value={newSale.total}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Lot Number"
                  value={newSale.lotNumber}
                  readOnly
                />
                <input
                  type="date"
                  placeholder="Expiration Date"
                  value={newSale.expirationDate}
                  readOnly
                />

                <div className="modal-actions">
                  <button
                    className="discard-btn"
                    type="button"
                    onClick={closeAddSale}
                  >
                    Discard
                  </button>
                  <button
                    className="add-sale-btn"
                    type="button"
                    onClick={handleAddSale}
                  >
                    Add Sales
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
