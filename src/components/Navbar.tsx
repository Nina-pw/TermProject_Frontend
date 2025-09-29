import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // URL สำหรับปุ่ม "Shop" เท่านั้น
  const shopPath = useMemo(() => {
    if (!currentUser) return "/home";
    return isAdmin ? "/admin" : "/shop";
  }, [currentUser, isAdmin]);

  // โลโก้กลาง/ลิงก์ซ้ายอื่น ๆ ให้ไปหน้า Home เสมอ
  const homePath = "/home";

  // ปิดเมนู account เมื่อคลิกรอบนอก
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ตัดชื่อที่จะแสดง (ชื่อจริง ถ้าไม่มีใช้ local-part ของอีเมล)
  const displayName =
    currentUser?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "");

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <NavLink to={shopPath}>Shop</NavLink>

        <div
          className="dropdown"
          onMouseEnter={() => setCategoriesOpen(true)}
          onMouseLeave={() => setCategoriesOpen(false)}
        >
          <button
            className="dropbtn"
            aria-expanded={categoriesOpen}
            aria-haspopup="true"
            onClick={() => setCategoriesOpen((v) => !v)}
          >
            Categories
          </button>

          <div className={`dropdown-content ${categoriesOpen ? "show" : ""}`}>
            <NavLink to="/categories/face">Face</NavLink>
            <NavLink to="/categories/eyes">Eyes</NavLink>
            <NavLink to="/categories/lips">Lips</NavLink>
            <NavLink to="/categories/cheeks">Cheeks</NavLink>
            <NavLink to="/categories/body">Body</NavLink>
          </div>
        </div>

        <NavLink to="/aboutus">About Us</NavLink>
      </div>

      {/* CENTER logo → กลับหน้า Home เสมอ */}
      <div className="navbar-center">
        <Link to={homePath}>
          <img src="/assets/pic2.png" alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
          <FaSearch className="search-icon" />
        </div>

        <NavLink to={shopPath}>
          <FaShoppingCart className="navbar-icon" />
        </NavLink>
        <NavLink to={shopPath}>
          <FaHeart className="navbar-icon" />
        </NavLink>

        {/* Account */}
        {!currentUser ? (
          <Link
            to="/login"
            state={{ background: location, fromNavIcon: true }}
            aria-label="Login"
          >
            <FaUser className="navbar-icon" />
          </Link>
        ) : (
          // ล็อกอินแล้ว (role: user หรือ admin)
          <div className="nav-account" ref={menuRef}>
            {/* ถ้าเป็น user → โชว์ชื่อแทนไอคอน */}
            {!isAdmin ? (
              <button
                type="button"
                className="nav__userPill"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={`${currentUser.name} (${currentUser.email})`}
              >
                {displayName}
              </button>
            ) : (
              // ถ้าเป็น admin ให้คงไอคอนเดิมไว้
              <button
                type="button"
                className="btn-reset navbar-icon"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={`${currentUser.name} (${currentUser.email})`}
              >
                <FaUser />
              </button>
            )}

            {menuOpen && (
              <div className="nav-menu" role="menu">
                <div className="nav-menu__header">
                  <div className="nav-menu__name">{currentUser.name}</div>
                  <div className="nav-menu__email">{currentUser.email}</div>
                </div>

                <button
                  className="nav-menu__item"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/home", { replace: true, state: {} });
                    setTimeout(() => logout(), 0);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
