import React, { useState } from "react";
import "./Navbar.css";
import logo from "./assets/pics/pic2.png";
import { FaSearch, FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left menu */}
      <div className="navbar-left">
        <a href="/shop">Shop</a>

        {/* Categories dropdown */}
        <div
          className="dropdown"
          onMouseEnter={() => setCategoriesOpen(true)}
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          <a
            href="/categories"
            className="dropbtn"
            aria-expanded={categoriesOpen}
            aria-haspopup="true"
          >
            Categories
          </a>

          {/* render เสมอ แต่สลับ class 'show' เมื่อเปิด */}
          <div className={`dropdown-content ${categoriesOpen ? "show" : ""}`}>
            <a href="/categories/face">Face</a>
            <a href="/categories/eyes">Eyes</a>
            <a href="/categories/lips">Lips</a>
            <a href="/categories/skincare">Cheeks</a>
            <a href="/categories/tools">Body</a>
          </div>
        </div>
        <a href="/about">About Us</a>
      </div>
      {/* Center logo */}
      <div className="navbar-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      {/* Right icons */}
      <div className="navbar-right">
        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
          <FaSearch className="search-icon" />
        </div>
        <FaShoppingCart className="navbar-icon" />
        <FaHeart className="navbar-icon" />
        <Link to="/login">
          <FaUser className="navbar-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
