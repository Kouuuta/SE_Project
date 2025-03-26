import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductManagement.css";
import axios from "axios";
import "../pages/Categories";
import Select from "react-select";
import { toast } from "sonner";
import { confirmDialog } from "primereact/confirmdialog";
import Sidebar from "../components/Sidebar";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalStock, setTotalStock] = useState(0);

  const [newProduct, setNewProduct] = useState({
    itemCode: "",
    productId: "",
    productName: "",
    categories: "",
    inStock: "",
    buyingPrice: "",
    sellingPrice: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/"); // Redirect to login if no token found
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/products/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📌 Updated Products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error.message
        );
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.item_code.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Calculate total stock for the searched item_code
      const total = filtered.reduce((acc, product) => acc + product.stock, 0);

      setFilteredProducts(filtered);
      setTotalStock(total);
    } else {
      setFilteredProducts([]);
      setTotalStock(0);
    }
  }, [searchTerm, products]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/categories/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data || error.message
        );
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/products/total2/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Total Products Fetched:", response.data); // Debugging Log
        setTotalProducts(response.data.total2_products); // Correctly setting the state
      } catch (error) {
        console.error(
          "Error fetching total products:",
          error.response?.data || error.message
        );
      }
    };

    fetchTotalProducts();
  }, []);

  const [stockDetails, setStockDetails] = useState({ category: "", stock: "" });

  const openAddProduct = () => setIsAddProductOpen(true);
  const closeAddProduct = () => setIsAddProductOpen(false);

  const openAddStock = () => setIsAddStockOpen(true);
  const closeAddStock = () => setIsAddStockOpen(false);

  const openEditProduct = (product) => {
    setEditProduct(product);
    setIsEditProductOpen(true);
  };
  const closeEditProduct = () => {
    setEditProduct(null);
    setIsEditProductOpen(false);
  };

  const handleEditProduct = async () => {
    if (!editProduct || !editProduct.product_id) {
      toast.error("Product ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.put(
        `http://localhost:8000/api/products/${editProduct.product_id}/edit/`,
        {
          item_code: editProduct.item_code,
          product_name: editProduct.product_name,
          category: editProduct.category,
          buying_price: parseFloat(editProduct.buying_price),
          lot_number: editProduct.lot_number,
          expiration_date: editProduct.expiration_date,
          selling_price: parseFloat(editProduct.selling_price),
          stock: parseInt(editProduct.stock, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(
        products.map((product) =>
          product.product_id === editProduct.product_id
            ? { ...product, ...response.data }
            : product
        )
      );

      toast.success("Product updated successfully!", {
        duration: 2000,
      });

      setIsEditProductOpen(false);
    } catch (error) {
      console.error(
        "Error editing product:",
        error.response?.data || error.message
      );

      toast.error("Failed to update product. Please try again.", {
        duration: 2000,
      });
    }
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.itemCode ||
      !newProduct.productName ||
      !newProduct.sellingPrice
    ) {
      toast.warning("All required fields must be filled.", { duration: 2000 });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/products/add/",
        {
          product_id: newProduct.productId || `P${Date.now()}`,
          item_code: newProduct.itemCode,
          product_name: newProduct.productName,
          category: newProduct.category,
          buying_price: newProduct.buyingPrice || 0,
          selling_price: newProduct.sellingPrice || 0,
          stock: newProduct.inStock || 0,
          lot_number: newProduct.lotNumber,
          expiration_date: newProduct.expirationDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product added successfully!", { duration: 2000 });
      setProducts([...products, response.data]);

      setNewProduct({
        itemCode: "",
        productId: "",
        productName: "",
        category: "",
        buyingPrice: "",
        sellingPrice: "",
        inStock: "",
        lotNumber: "",
        expirationDate: "",
      });

      closeAddProduct();
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      toast.error("Failed to add product.", { duration: 2000 });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId || productId === "N/A") {
      toast.error("❌ Invalid product ID.");
      return;
    }

    confirmDialog({
      message: "Are you sure you want to delete this product?",
      header: "Confirm Deletion",
      icon: "pi pi-exclamation-triangle",
      className: "custom-delete-dialog",
      acceptClassName: "custom-delete-accept-btn",
      rejectClassName: "custom-delete-cancel-btn",
      closable: false,
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      accept: async () => {
        try {
          const token = localStorage.getItem("access_token");

          await axios.delete(
            `http://localhost:8000/api/products/${encodeURIComponent(
              productId
            )}/delete/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.product_id !== productId)
          );

          toast.success("Product deleted successfully!", {
            duration: 2000,
          });
        } catch (error) {
          console.error(
            "Error deleting product:",
            error.response?.data || error.message
          );

          toast.error("Failed to delete product. Please try again.", {
            duration: 2000,
          });
        }
      },
      reject: () => {
        toast.info("Deletion cancelled.");
      },
    });
  };

  const handleAddStock = async () => {
    if (!stockDetails.productId || !stockDetails.stock) {
      toast.error("Please select a product and enter stock quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.put(
        `http://localhost:8000/api/products/${encodeURIComponent(
          stockDetails.productId
        )}/update-stock/`,
        { stock: parseInt(stockDetails.stock, 10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`${response.data.message}`, { duration: 2000 });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.product_id === stockDetails.productId
            ? { ...product, stock: response.data.new_stock }
            : product
        )
      );

      setStockDetails({ productId: "", stock: "" });
      closeAddStock();
    } catch (error) {
      console.error(
        "Error updating stock:",
        error.response?.data || error.message
      );
      toast.error("Failed to update stock. Please try again.");
    }
  };

  const handleItemCodeClick = async (product_id) => {
    if (!product_id) {
      toast.error("Invalid Product ID.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://localhost:8000/api/products/${encodeURIComponent(product_id)}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setSelectedProduct(response.data);
        setIsProductDetailsOpen(true);
      } else {
        toast.error("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details.");
    }
  };

  return (
    <div className="product-management-page">
      <main className="dashboard-content">
        <div className="quantity-display">
          <div className="total-products">
            <h2>Total Quantity of Products:</h2>
            <p></p>
            <h2>{totalProducts} Products</h2>
          </div>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search Item Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <h3
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Total Stock for{" "}
              <span style={{ color: "#6a5acd" }}>
                {searchTerm.toUpperCase()}
              </span>
              <p
                style={{
                  margin: "5px 0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                {totalStock} Stocks
              </p>
            </h3>
          </div>
        </div>
        <div className="product-container">
          <div className="product-actions">
            <button className="action-btn add-stock-btn" onClick={openAddStock}>
              Add Stock
            </button>

            <button
              className="action-btn add-product-btn"
              onClick={openAddProduct}
            >
              Add Product
            </button>
          </div>
          <table className="product-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Item Code</th>
                <th>Product Name</th>
                <th>Categories</th>
                <th>Stock</th>
                <th>Selling Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id || product.item_code || Math.random()}>
                  <td>{product.product_id}</td>
                  <td
                    style={{
                      color: "red",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                    }}
                    onClick={() => handleItemCodeClick(product.product_id)}
                  >
                    {product.item_code}
                  </td>
                  <td>{product.product_name || "N/A"}</td>
                  <td>
                    {product.category ? product.category : "Uncategorized"}
                  </td>
                  <td>{product.stock !== null ? product.stock : 0}</td>
                  <td>
                    {product.selling_price
                      ? `₱${product.selling_price.toLocaleString()}`
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="product-management-page edit-btn"
                      onClick={() => openEditProduct(product)}
                    >
                      ✏
                    </button>
                    <button
                      className="product-management-page delete-btn"
                      onClick={() => handleDeleteProduct(product.product_id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {isProductDetailsOpen && selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setIsProductDetailsOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Product Details</h2>
            <p>
              <strong>Item Code:</strong> {selectedProduct.item_code}
            </p>
            <p>
              <strong>Lot Number:</strong>{" "}
              {selectedProduct.lot_number
                ? selectedProduct.lot_number
                : "Not Available"}
            </p>
            <p>
              <strong>Expiration Date:</strong>{" "}
              {selectedProduct.expiration_date
                ? new Date(selectedProduct.expiration_date).toLocaleDateString()
                : "Not Available"}
            </p>

            <button
              className="close-btn"
              onClick={() => setIsProductDetailsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isAddProductOpen && (
        <div className="product-popup-overlay" onClick={closeAddProduct}>
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Add Product</h2>
            <form>
              <input
                type="text"
                placeholder="Enter Item Code"
                value={newProduct.itemCode}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, itemCode: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Enter Product ID"
                value={newProduct.productId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Enter Product Name"
                value={newProduct.productName}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productName: e.target.value })
                }
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                } // ✅ Use `category`
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter Stock"
                value={newProduct.inStock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, inStock: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Enter Lot Number"
                value={newProduct.lotNumber}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, lotNumber: e.target.value })
                }
              />

              <input
                type="date"
                placeholder="Expiration Date"
                value={newProduct.expirationDate}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    expirationDate: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Selling Price 0.00"
                value={newProduct.sellingPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sellingPrice: e.target.value })
                }
              />
              <div className="popup-buttons">
                <button
                  type="button"
                  className="discard-btn"
                  onClick={closeAddProduct}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="add-btn"
                  onClick={handleAddProduct}
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddStockOpen && (
        <div className="product-popup-overlay" onClick={closeAddStock}>
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Add Stock</h2>
            <form>
              <Select
                options={products.map((product) => ({
                  value: product.product_id,
                  label: `${product.item_code} - ID ${product.product_id}`,
                }))}
                className="custom-react-stock-select"
                classNamePrefix="react-select"
                placeholder="Select Item Code"
                isSearchable={true}
                onChange={(selectedOption) => {
                  const selectedProduct = products.find(
                    (product) => product.product_id === selectedOption.value
                  );
                  setStockDetails({
                    ...stockDetails,
                    productId: selectedProduct?.product_id || "",
                    itemCode: selectedProduct?.item_code || "",
                  });
                }}
              />

              <input
                type="number"
                placeholder="Enter Stock Quantity"
                value={stockDetails.stock}
                onChange={(e) =>
                  setStockDetails({ ...stockDetails, stock: e.target.value })
                }
              />
              <div className="popup-buttons">
                <button
                  type="button"
                  className="discard-btn"
                  onClick={closeAddStock}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="add-btn"
                  onClick={handleAddStock}
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditProductOpen && editProduct && (
        <div className="product-popup-overlay" onClick={closeEditProduct}>
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Product</h2>
            <form>
              <input type="text" value={editProduct.product_id} disabled />
              <input
                type="text"
                value={editProduct.item_code}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, item_code: e.target.value })
                }
              />
              <input
                type="text"
                value={editProduct.product_name}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    product_name: e.target.value,
                  })
                }
              />
              <select
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Lot Number"
                value={editProduct.lot_number || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, lot_number: e.target.value })
                }
              />
              <input
                type="date"
                value={editProduct.expiration_date || ""}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    expiration_date: e.target.value,
                  })
                }
              />

              <input
                type="number"
                value={editProduct.stock}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, stock: e.target.value })
                }
              />
              <input
                type="text"
                value={editProduct.selling_price}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    selling_price: e.target.value,
                  })
                }
              />
              <div className="popup-buttons">
                <button
                  type="button"
                  className="discard-btn"
                  onClick={closeEditProduct}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="add-btn"
                  onClick={handleEditProduct}
                >
                  Edit Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default ProductManagement;
