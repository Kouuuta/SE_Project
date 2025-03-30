import { useEffect, useState } from "react";
import { MenuIcon, X } from "lucide-react";
import { Link as RouterLink } from "react-router-dom"; // Regular Link for routing
import { Link } from "react-scroll"; // Import Link from react-scroll for scrolling
import "../styles/Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="navbar-container">
        <div className="logo">
          <a href="/" className="logo-text">
            MEDIMARC
          </a>
        </div>
        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <RouterLink to="/" className="nav-link">
            Home
            <div className="nav-link-underline"></div>
          </RouterLink>
          <RouterLink to="/products" className="nav-link">
            {" "}
            Products
            <div className="nav-link-underline"></div>
          </RouterLink>
          <Link to="about-us" smooth={true} duration={500} className="nav-link">
            {" "}
            About Us
            <div className="nav-link-underline"></div>
          </Link>
          <Link
            to="contact-us"
            smooth={true}
            duration={500}
            className="nav-link"
          >
            {" "}
            Contacts
            <div className="nav-link-underline"></div>
          </Link>
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-container">
            <nav className="mobile-nav-links">
              <RouterLink to="/" className="mobile-nav-link">
                Home
              </RouterLink>
              <RouterLink to="/products" className="mobile-nav-link">
                Products
              </RouterLink>
              <Link
                to="about-us"
                smooth={true}
                duration={500}
                className="mobile-nav-link"
              >
                About Us
              </Link>
              <Link
                to="contact-us"
                smooth={true}
                duration={500}
                className="mobile-nav-link"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
