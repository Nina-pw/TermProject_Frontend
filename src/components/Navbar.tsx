// // src/components/Navbar.tsx
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import { ShoppingCart, Heart, User, Search as SearchIcon } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { useEffect, useMemo, useRef, useState } from "react";
// import "./Navbar.css";

// export default function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { currentUser, isAdmin, logout } = useAuth();

//   const [menuOpen, setMenuOpen] = useState(false);       // account menu
//   const [catOpen, setCatOpen] = useState(false);         // categories dropdown
//   const menuRef = useRef<HTMLDivElement | null>(null);
//   const catRef = useRef<HTMLDivElement | null>(null);

//   // เส้นทางหลักของ navbar ตาม role
//   const basePath = useMemo(() => {
//     if (!currentUser) return "/home";
//     return isAdmin ? "/admin" : "/userHome";
//   }, [currentUser, isAdmin]);

//   // ปิดเมนูต่าง ๆ เมื่อคลิกนอก
//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpen(false);
//       }
//       if (catRef.current && !catRef.current.contains(e.target as Node)) {
//         setCatOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   return (
//     <header className="nav">
//       <div className="nav__inner nav__inner--bleed">
//         {/* LEFT ── Shop / Categories / About */}
//         <nav className="nav__left">
//           <NavLink to={basePath} className="nav__link">Shop</NavLink>

//           {/* Categories dropdown */}
//           <div
//             className={`nav__dropdown ${catOpen ? "is-open" : ""}`}
//             ref={catRef}
//             onMouseEnter={() => setCatOpen(true)}
//             onMouseLeave={() => setCatOpen(false)}
//           >
//             <button
//               type="button"
//               className="nav__dropBtn nav__link"
//               aria-haspopup="menu"
//               aria-expanded={catOpen}
//               onClick={() => setCatOpen(v => !v)}
//             >
//               Categories ▾
//             </button>

//             <div className="nav__dropMenu" role="menu">
//               <NavLink to="/categories/face" className="nav__dropItem" onClick={() => setCatOpen(false)}>Face</NavLink>
//               <NavLink to="/categories/eyes" className="nav__dropItem" onClick={() => setCatOpen(false)}>Eyes</NavLink>
//               <NavLink to="/categories/lips" className="nav__dropItem" onClick={() => setCatOpen(false)}>Lips</NavLink>
//               <NavLink to="/categories/cheeks" className="nav__dropItem" onClick={() => setCatOpen(false)}>Cheeks</NavLink>
//               <NavLink to="/categories/body" className="nav__dropItem" onClick={() => setCatOpen(false)}>Body</NavLink>
//             </div>
//           </div>

//           <NavLink to={basePath} className="nav__link">About us</NavLink>
//         </nav>

//         {/* CENTER ── โลโก้กดแล้วกลับ basePath */}
//         <Link to={basePath} className="nav__brand nav__brand--stack" aria-label="IRIS Home">
//           <img src="/assets/pic2.png" alt="IRIS logo" className="nav__logo" />
//         </Link>

//         {/* RIGHT ── Search + icons */}
//         <div className="nav__right">
//           <div className="nav__searchWrap">
//             <input className="nav__search" placeholder="Search..." />
//             <SearchIcon className="nav__searchIconSvg" size={18} strokeWidth={2} />
//           </div>

//           <NavLink to={basePath} className="nav__icon" aria-label="Cart">
//             <ShoppingCart size={22} strokeWidth={2} />
//           </NavLink>

//           <NavLink to={basePath} className="nav__icon" aria-label="Wishlist">
//             <Heart size={22} strokeWidth={2} />
//           </NavLink>

//           {!currentUser ? (
//             // ยังไม่ล็อกอิน → /login เป็น sheet
//             <NavLink
//               to="/login"
//               state={{ background: location, fromNavIcon: true }}
//               className="nav__icon"
//               aria-label="Login"
//             >
//               <User size={22} strokeWidth={2} />
//             </NavLink>
//           ) : (
//             // เมนูบัญชี
//             <div className="nav__account" ref={menuRef}>
//               <button
//                 type="button"
//                 className="nav__icon"
//                 aria-haspopup="menu"
//                 aria-expanded={menuOpen}
//                 onClick={() => setMenuOpen(v => !v)}
//                 title={`${currentUser.name} (${currentUser.email})`}
//               >
//                 <User size={22} strokeWidth={2} />
//               </button>

//               {menuOpen && (
//                 <div className="nav__menu" role="menu">
//                   <div className="nav__menuHeader">
//                     <div className="nav__menuName">{currentUser.name}</div>
//                     <div className="nav__menuEmail">{currentUser.email}</div>
//                   </div>

//                   {isAdmin ? (
//                     <button
//                       className="nav__menuItem"
//                       onClick={() => { setMenuOpen(false); navigate("/admin"); }}
//                     >
//                       Admin dashboard
//                     </button>
//                   ) : (
//                     <button
//                       className="nav__menuItem"
//                       onClick={() => { setMenuOpen(false); navigate("/userHome"); }}
//                     >
//                       My page
//                     </button>
//                   )}

//                   <button
//                     className="nav__menuItem"
//                     onClick={() => {
//                       setMenuOpen(false);
//                       // กลับหน้า Home แล้วค่อยล้าง session
//                       navigate("/home", { replace: true, state: {} });
//                       setTimeout(() => logout(), 0);
//                     }}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

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
    <nav className="navbar">
      {/* Left menu */}
      <div className="navbar-left">
        <NavLink to={basePath}>Shop</NavLink>

        {/* Categories dropdown */}
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

          {/* render เสมอ + toggle class show */}
          <div className={`dropdown-content ${categoriesOpen ? "show" : ""}`}>
            <NavLink to="/categories/face">Face</NavLink>
            <NavLink to="/categories/eyes">Eyes</NavLink>
            <NavLink to="/categories/lips">Lips</NavLink>
            <NavLink to="/categories/cheeks">Cheeks</NavLink>
            <NavLink to="/categories/body">Body</NavLink>
          </div>
        </div>

        <NavLink to={basePath}>About Us</NavLink>
      </div>

      {/* Center logo */}
      <div className="navbar-center">
        <Link to={basePath}>
          <img src="/assets/pic2.png" alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      {/* Right icons */}
      <div className="navbar-right">
        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
          <FaSearch className="search-icon" />
        </div>

        <NavLink to={basePath}>
          <FaShoppingCart className="navbar-icon" />
        </NavLink>
        <NavLink to={basePath}>
          <FaHeart className="navbar-icon" />
        </NavLink>

        {/* Account */}
        {!currentUser ? (
          // ⬅️ ไปหน้า Login แบบเต็มหน้า (ไม่เปิดเป็น sheet)
          <NavLink to="/login" aria-label="Login">
            <FaUser className="navbar-icon" />
          </NavLink>
        ) : (
          <div className="nav-account" ref={menuRef}>
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
              <div className="nav-menu" role="menu">
                <div className="nav-menu__header">
                  <div className="nav-menu__name">{currentUser.name}</div>
                  <div className="nav-menu__email">{currentUser.email}</div>
                </div>

                {isAdmin ? (
                  <button
                    className="nav-menu__item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/admin");
                    }}
                  >
                    Admin dashboard
                  </button>
                ) : (
                  <button
                    className="nav-menu__item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/userHome");
                    }}
                  >
                    My page
                  </button>
                )}

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
