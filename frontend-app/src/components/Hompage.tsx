import React, { useState, useEffect } from "react";
import { SearchIcon, InfoIcon, MapIcon } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import "./Homepage.css";
import logo from "../images/logo.png";
import facebook from "../images/facebook.png";
import shopee from "../images/shopee.png";
import tiktok from "../images/tiktok.png";
import gmail from "../images/gmail.png";
import phone from "../images/phone.png";
import lazada from "../images/lazada.png";
import hypodermic from "../imagesmm/hypodermic.jpg";
import hypodermic2 from "../imagesmm/hypodermic2.jpg";
import syr from "../imagesmm/syr.jpg";
import stockphoto1 from "../imagesmm/stockphoto1.jpg";
import pic1carousel from "../imagesmm/pic1carousel.png";
import medimarc from "../imagesmm/medimarc-pic.png";
import stockphoto from "../imagesmm/stockphoto.jpg";


const Homepage = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [pic1carousel, medimarc, stockphoto1, stockphoto]; // Add all carousel images here.

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Set up automatic slide change every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 3000); // Change every 3 seconds (3000ms)

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures it runs only once on mount

  useEffect(() => {
    const fadeInElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    fadeInElements.forEach((el) => observer.observe(el));

    return () => {
      fadeInElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="homepage">
      <section id="home" className="slider fade-in">
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
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="/product">Products</a>
              </li>
              <li>
                <a href="#about-us">About Us</a>
              </li>
              <li>
                <a href="#contact-us">Contact</a>
              </li>
            </ul>
          </div>
        </header>

        <section className="carousel-section">
        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`, // Move track based on activeIndex
              transition: "transform 0.5s ease-in-out", // Apply transition to transform
            }}
          >
            {images.map((image, index) => (
              <div className="carousel-slide" key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>

        {/* Next and Previous Buttons */}
            <button
              className="carousel-prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeftIcon size={24} /> {/* Chevron Left Icon */}
            </button>
            <button
              className="carousel-next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRightIcon size={24} /> {/* Chevron Right Icon */}
            </button>
            
          </div>
        </section>


        <p>We believe in treating our customers with respect and faith.</p>
        <p>We integrate honesty, integrity, and business ethics.</p>
      </section>

      <div className="container-feature">
        <div className="content-feature">
          <div className="button-group">
            {/* First Button */}
            <button className="feature-button">
              <div className="icon-wrapper blue">
                <MapIcon size={24} />
              </div>
              <h2>Office Location </h2>
              <p>Find our office locations and get directions easily.</p>
            </button>
            {/* Second Button */}
            <button className="feature-button">
              <div className="icon-wrapper purple">
                <SearchIcon size={24} />
              </div>
              <h2>NIPRO Products</h2>
              <p>
                Check here for more information and details about the NIPRO
                products.
              </p>
            </button>
            {/* Third Button */}
            <button className="feature-button">
              <div className="icon-wrapper green">
                <InfoIcon size={24} />
              </div>
              <h2>About Us</h2>
              <p>Learn more about our mission, vision, and values.</p>
            </button>
          </div>
        </div>
      </div>

      <div className="title-container">
        <h2>Overview of Products</h2>
      </div>
      <section id="products" className="products-section fade-in">
        <div className="products-container">
          <div className="carousel-container">
            <div className="carousel2">
              <img
                src={hypodermic}
                alt="Product 1"
                className="carousel-image"
              />
              <img
                src={hypodermic2}
                alt="Product 2"
                className="carousel-image"
              />
              <img src={syr} alt="Product 3" className="carousel-image" />
              <img
                src={hypodermic}
                alt="Product 4"
                className="carousel-image"
              />
              <img
                src={hypodermic2}
                alt="Product 5"
                className="carousel-image"
              />
              <img src={syr} alt="Product 6" className="carousel-image" />
            </div>
          </div>

          <div className="products-description">
            <h2 className="title">MEDIMARC TRADING</h2>
            <p className="description">
              provides high-quality, cost-effective hospital supplies, serving
              healthcare facilities since 2013. As an authorized distributor of
              trusted brands like Nipro, Cardinal Health, and Terumo, the
              company offers innovative medical devices, surgical consumables,
              and infection control products. With decades of expertise,
              Medimarc delivers reliable solutions to hospitals across Metro
              Manila and Southern Luzon, continually expanding its partnerships
              to meet the industry's evolving needs.
            </p>
          </div>
        </div>
      </section>

      <div className="title-container">
        <h2>About Us</h2>
      </div>
      <section id="about-us" className="about-us-section fade-in">
        <div className="about-us-container">
          <div className="tabs">
            <button
              className={`tab-button ${
                activeTab === "history" ? "active" : ""
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <button
              className={`tab-button ${
                activeTab === "first-sale" ? "active" : ""
              }`}
              onClick={() => setActiveTab("first-sale")}
            >
              First Sale
            </button>
            <button
              className={`tab-button ${
                activeTab === "clients" ? "active" : ""
              }`}
              onClick={() => setActiveTab("clients")}
            >
              Clients
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "history" && (
              <p>
                Established by Arnold M. Castillo, the single proprietor company
                initially retailed medical consumable products from his former
                employers where trust were gained in the course of his
                employment as Sales Manager at Lifelink, Inc. The joining of his
                spouse, Mirriam R. Castillo, in the year 2020 and in the summit
                of Covid-19 pandemic, still opens new opportunities for
                marketing new products and sales development.
              </p>
            )}
            {activeTab === "first-sale" && (
              <p>
                October 2022, in the establishment of the first Nipro Medical
                Corporation’s sales subsidiary in the Philippines, Medimarc
                Trading was appointed by Nipro Medical Corporation as one of the
                authorized distributors for Hospital Care Products in Metro
                Manila and with exclusive distributorship agreement for Southern
                Luzon and Bambang Area.
              </p>
            )}
            {activeTab === "clients" && (
              <p>
                 St Luke’s Medical Center- Quezon City and Global City
                <br />
                 Makati Medical Center
                <br />
                 FEU-NRMF Medical Center
                <br />
                 The Medical City
                <br />
                 Cardinal Santos Medical Center
                <br />
                 UERM Memorial Medical Center
                <br />
                 Chinese General Hospital
                <br />
              </p>
            )}
          </div>
        </div>
        <div className="additional-container">
          <p>
            <strong>MEDIMARC TRADING</strong>, with business office situated in
            Quezon City, provides a wide range of quality and cost-effective
            hospital supplies since its establishment in 2013 as wholesaler of
            medical devices.
          </p>
        </div>
      </section>

      <div className="title-container">
        <h2>Contact Us</h2>
      </div>
      <section id="contact-us" className="contact fade-in">
        <div className="content">
          <div className="container">
            <div className="contact-box">
              <div className="contact-info">
                <a
                  href="https://www.facebook.com/medimarctrading"
                  className="icon facebook"
                  target="_blank"
                >
                  <img src={facebook} alt="Facebook" className="icon" />
                  MediMarc Trading
                </a>
                <a href="tel:+639178637544" className="icon Phone">
                  <img src={phone} alt="Phone" className="icon" /> 63+ 917 863
                  7544 <br /> Arnold M. Castillo
                </a>
                <a href="mailto:medimarc.mrc@gmail.com" className="icon gmail">
                  <img src={gmail} alt="Gmail" className="icon" />{" "}
                  medimarc.mrc@gmail.com
                </a>
              </div>
              <div className="contact-text">
                <h2>Get in Touch with MediMarc Trading</h2>
                <p>
                  For inquiries, product details, or partnership opportunities,
                  feel free to contact us. Reach out via phone, email, or
                  Facebook for prompt assistance from our team. We’re here to
                  support your healthcare supply needs and answer any questions
                  about our products and services. Connect with us today to
                  explore how MediMarc Trading can help you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                owners.
                <br />
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

export default Homepage;
