import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircleMore, Bell, User, SearchIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./AdminTopbar.css";

export default function AdminTopbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ปิดเมนูเมื่อคลิกรอบนอก
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="adminbar">
      <div className="adminbar__inner adminbar__inner--bleed">
        {/* LEFT : Brand */}
        <Link
          to="/admin"
          className="adminbar__brand"
          aria-label="Seller Centre"
        >
          <img src="/assets/Logo.png" alt="IRIS" className="adminbar__logo" />
          <span className="adminbar__brandText">Seller Centre</span>
        </Link>

        {/* RIGHT : Search + Icons + Account */}
        <div className="adminbar__right">
            <div className="adminbar__searchWrap">
            <input className="adminbar__search" placeholder="Search" />
            <SearchIcon
              className="adminbar__searchIcon"
              size={18}
              strokeWidth={2}
            />
          </div>

          {/* ฟองแชทสีแดงเข้ม พร้อม ... ข้างใน */}
          <button
            className="adminbar__icon adminbar__icon--chat"
            title="Messages"
          >
            <MessageCircleMore size={18} strokeWidth={2} />
          </button>

          {/* กระดิ่ง + badge สีชมพู + จุดสถานะด้านล่าง */}
          <button
            className="adminbar__icon adminbar__icon--bell"
            title="Notifications"
          >
            <Bell size={18} strokeWidth={2} />
            <span className="adminbar__badge">6</span>
            <span className="adminbar__dot" />
          </button>

          <div className="adminbar__account" ref={menuRef}>
            <button
              className="adminbar__icon"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              title={
                currentUser
                  ? `${currentUser.name} (${currentUser.email})`
                  : "Account"
              }
            >
              <User size={18} strokeWidth={2} />
            </button>

            {open && (
              <div className="adminbar__menu" role="menu">
                <div className="adminbar__menuHeader">
                  <div className="adminbar__menuName">{currentUser?.name}</div>
                  <div className="adminbar__menuEmail">
                    {currentUser?.email}
                  </div>
                </div>
                <button
                  className="adminbar__menuItem"
                  onClick={() => {
                    setOpen(false);
                    navigate("/admin");
                  }}
                >
                  Admin dashboard
                </button>
                <button
                  className="adminbar__menuItem"
                  onClick={() => {
                    setOpen(false);
                    navigate("/home", { replace: true, state: {} });
                    setTimeout(() => logout(), 0);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
