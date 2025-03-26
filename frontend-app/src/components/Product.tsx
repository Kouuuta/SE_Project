import React, { useState, useEffect } from "react";
import "./Product.css";
import logo from "../images/logo.png";
import tiktok from "../images/tiktok.png";
import shopee from "../images/shopee.png";
import facebook from "../images/facebook.png";
import lazada from "../images/lazada.png";
import syr1 from "../imagesmm/syr1.png";
import administrationset from "../imagesmm/administrationset.png";
import hyponeedle from "../imagesmm/hyponeedle.png";
import prefilled from "../imagesmm/prefilled.png";
import safetouch from "../imagesmm/safetouch.png";
import spinalneedle from "../imagesmm/spinalneedle.png";
import { FaBars } from "react-icons/fa";
import surefuser from "../imagesmm/surefuser.png";
import catheter from "../imagesmm/catheter.png";
import withneedle from "../imagesmm/withneedle.png";

interface Product {
  id: number; // Added unique ID for better key management

  category: string;
  description: string; // Added description field
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    category: "NIPRO SYRINGE WITH NEEDLE",
    description:
      "- 1mL Tuberculin Syringe w/ 25GX5/8 Needle E-Beam\n - 1mL Tuberculin Syringe w/ 26GX1/2 Needle E-beam\n - 0.5mL 30Gx5/16 (8mm) INSULIN 100U E-Beam, Blister\n - 1mL 27Gx1/2” INSULIN 100UE-Beam, Blister\n - 1mL 29Gx1/2” INSULIN 100U E-Beam, Blister\n - 1mL 30Gx5/16” INSULIN 100U E-Beam, Blister\n - 1mL 30Gx1/2” INSULIN 100U E-Beam, Blister \n - 3mL Syringe Luer Lock w/ 23GX1 Needle E-Beam\n - 5mL Syringe Luer Lock w/ 21GX1 Needle E-beam\n - 5mL Syringe Luer Lock w/ 23GX1 Needle E-beam\n - 10mL Syringe Luer Lock w/ 21GX1 Needle E-beam\n - 10mL Syringe Luer Lock w/ 23GX1 Needle E-beam\n ",
    image: withneedle,
  },
  {
    id: 2,
    category: "NIPRO SYRINGE WITHOUT NEEDLE",
    description:
      "- 3mL Syringe LUER LOCK W/O Needle E-beam\n - 3mL Syringe LUER SLIP W/O Needle (ECC. TIP) E-beam\n - 5mL Syringe LUER LOCK W/O Needle E-beam\n - 5mL Syringe LUER SLIP W/O Needle E E-beam\n - 10mL Syringe LUER LOCK W/O Needle E-beam\n - 10mL Syringe LUER SLIP W/O Needle E-beam\n - 20mL Syringe LUER LOCK W/O Needle E-beam\n - 20mL Syringe LUER SLIP W/O Needle E E-beam\n - 30mL Syringe LUER LOCK W/O Needle E-beam\n - 50mL Syringe LUER LOCK W/O Needle E-beam\n - 50mL  CATHETER TIP W/O Needle (ECC. TIP) E-beam\n - 50mL LUER SLIP W/O NEEDLE (ECC. TIP) E-beam  ",
    image: syr1,
  },
  {
    id: 3,
    category: "NIPRO HYPODERMIC NEEDLE",
    description:
      "- PACKED NEEDLE 18Gx1 ETO\n - PACKED NEEDLE 18Gx1-1/2 ETO\n - PACKED NEEDLE 19Gx1-1/2 ETO\n - PACKED NEEDLE 20Gx1 ETO\n - PACKED NEEDLE 21Gx1 ETO\n - PACKED NEEDLE 22Gx1 ETO\n - PACKED NEEDLE 23Gx1 ETO\n - PACKED NEEDLE 24Gx1 ETO\n - PACKED NEEDLE 25Gx5/8 ETO\n - PACKED NEEDLE 25Gx1 ETO\n - PACKED NEEDLE 26Gx1/2 ETO (CE)\n - PACKED NEEDLE 27Gx1/2 ETO (CE)  ",
    image: hyponeedle,
  },
  {
    id: 4,
    category: "NIPRO SAFETOUCH SAFETY IV CATHETER",
    description:
      "- SAFETOUCH WING CATH W/O Injection Port 18Gx1-1/4  ETO\n - SAFETOUCH WING CATH W/O Injection Port 20Gx1-1/4 ETO\n - SAFETOUCH WING CATH W/O Injection Port 22Gx1  ETO\n - SAFETOUCH WING CATH W/O Injection Port 24Gx3/4 ETO ",
    image: catheter,
  },
  {
    id: 5,
    category: "NIPRO AMSAFE PREFILLED SYRINGE",
    description:
      "- AMSAFE Pre-Filled Normal Saline Flush Syringe 3mL\n - AMSAFE Pre-Filled Normal Saline Flush Syringe 5mL\n - AMSAFE Pre-Filled Normal Saline Flush Syringe 10mL  ",
    image: prefilled,
  },
  {
    id: 6,
    category: "NIPRO SPINAL NEEDLE",
    description:
      "- Spinal Needle 18Gx3-1/2 (88mm) CONTAINER (ETO)\n - Spinal Needle 20Gx3-1/2 (88mm) CONTAINER (ETO)\n - Spinal Needle 21Gx3-1/2 (88mm) CONTAINER (ETO)\n - Spinal Needle 22Gx3-1/2 (88mm) CONTAINER (ETO)\n - Spinal Needle 26Gx3-1/2 (88mm) CONTAINER (ETO)\n - Spinal Needle 27Gx3-1/2 (88mm) CONTAINER (ETO)  ",
    image: spinalneedle,
  },
  {
    id: 7,
    category: "NIPRO SUREFUSER  ELASTOMERIC INFUSION PUMP, DISPOSABLE",
    description:
      "- Surefuser Variable Infusion Elastomeric Infusion System, 100mL\n - Surefuser Continous Infusion Elastomeric Infusion System, 300mL ",
    image: surefuser,
  },
  {
    id: 8,
    category: "OTHER HOSPITAL PRODUCTS",
    description:
      "- Nipro Safetouch Plug (Needless Connector)\n - Nipro 3 Way Stop Cock\n - Nipro IV Set Blood Administration Set",
    image: administrationset,
  },
];

const Product: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [fadeClass, setFadeClass] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeClass(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  // Filtered products based on selected category
  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === "all" || product.category === selectedCategory
  );

  useEffect(() => {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarMenu = document.querySelector(".navbar");

    // Create the function to toggle the 'open' class
    const toggleNavbar = () => {
      navbarMenu?.classList.toggle("open");
    };

    if (navbarToggler && navbarMenu) {
      navbarToggler.addEventListener("click", toggleNavbar);
    }

    return () => {
      if (navbarToggler) {
        navbarToggler.removeEventListener("click", toggleNavbar);
      }
    };
  }, []); // Empty dependency array to run this effect only once on mount

  return (
    <div className="homepage">
      <header className="custom-header">
        <div className="navbar-container">
          <img src={logo} alt="Logo" className="nav-logo" />
          <button
            className="burger-icon"
            onClick={() =>
              document
                .querySelector(".nav-links")
                ?.classList.toggle("nav-active")
            }
          >
            ☰
          </button>
          <ul className="nav-links">
            <li>
              <a href="/homepage">Home</a>
            </li>
            <li>
              <a href="/product">Products</a>
            </li>
            <li>
              <a href="homepage#about-us">About Us</a>
            </li>
            <li>
              <a href="homepage#contact-us">Contact</a>
            </li>
          </ul>
        </div>
      </header>
      <div className="main-content">
        {/* Product Grid */}
        <div className="product-container">
          <div className="filter-container">
            <label htmlFor="category-filter" className="filter-label">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              className="filter-dropdown"
              value={selectedCategory}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              {Array.from(new Set(products.map((p) => p.category))).map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div
                className={`product-item fade-in ${
                  fadeClass ? "fade-in-visible" : ""
                }`}
                data-category={product.category}
                key={product.id}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.category} />
                </div>
                <h4 className="product-name">{product.category}</h4>
                {/* Conditionally display the description */}
                {selectedCategory !== "all" && (
                  <p className="product-description">
                    {product.description.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="bottom-navbar">
        <div className="navbar-content">
          <div className="address-section">
            <h3>
              <span className="line1">
                Unit 303 M-Place Bldg., No. 96 Maginhawa,
              </span>
              <br />
              <span className="line2">St., Teachers Village, Quezon City</span>
            </h3>
            <div className="footer-copyright">
              <p>
                All information, pictures, and images on this site are
                copyrighted material and owned by their respective creators or
                owners. <br />
                Copyright © 2025 | MediMarc Trading
              </p>
            </div>
          </div>
          <div className="social-media-icons">
            <a
              href="https://shopee.ph"
              target="_blank"
              className="icon shopee"
              aria-label="Shopee"
            >
              <img src={shopee} alt="Shopee" />
            </a>
            <a
              href="https://www.facebook.com/medimarctrading"
              target="_blank"
              className="icon facebook"
              aria-label="Facebook"
            >
              <img src={facebook} alt="Facebook" />
            </a>
            <a
              href="https://www.tiktok.com/@medimarc.trading"
              target="_blank"
              className="icon tiktok"
              aria-label="TikTok"
            >
              <img src={tiktok} alt="TikTok" />
            </a>
            <a
              href="https://www.lazada.com.ph/shop/medimarc-trading"
              target="_blank"
              className="icon lazada"
              aria-label="Lazada"
            >
              <img src={lazada} alt="Lazada" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
