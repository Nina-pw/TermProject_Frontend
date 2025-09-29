import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./AdminTopbar.css";

export default function AdminTopbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // เส้นทางหลักตาม role (เหมือนของเดิม)
  const basePath = useMemo(() => {
    if (!currentUser) return "/home";
    return isAdmin ? "/admin" : "/userHome";
  }, [currentUser, isAdmin]);

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

  return (
    <nav className="AdminTopbar">
      {/* Left: logo + Seller Centre text */}
      <div className="AdminTopbar-left">
        <Link to={basePath} className="brand">
          <img src="/assets/pic3.png" alt="Logo" className="AdminTopbar-logo" />
          <span className="brand-text">Seller Centre</span>
        </Link>
      </div>

      {/* Right: search + account */}
      <div className="AdminTopbar-right">
        <div className="AdminTopbar-search">
          <input type="text" placeholder="Search..." aria-label="Search" />
          <FaSearch className="search-icon" />
        </div>

        {/* Account */}
        {!currentUser ? (
          <NavLink to="/login" aria-label="Login">
            <FaUser className="AdminTopbar-icon" />
          </NavLink>
        ) : (
          <div className="AdminTopbar-account" ref={menuRef}>
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

            {menuOpen && (
              <div className="AdminTopbar-menu" role="menu">
                <div className="AdminTopbar-menu__header">
                  <div className="AdminTopbar-menu__name">
                    {currentUser.name}
                  </div>
                  <div className="AdminTopbar-menu__email">
                    {currentUser.email}
                  </div>
                </div>

                {/* {isAdmin ? (
                  <button
                    className="AdminTopbar-menu__item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/admin");
                    }}
                  >
                    
                  </button>
                ) : (
                  <button
                    className="AdminTopbar-menu__item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/userHome");
                    }}
                  >
                    My page
                  </button>
                )} */}

                <button
                  className="AdminTopbar-menu__item"
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
