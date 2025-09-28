// src/pages/Admin/Layout.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Search as SearchIcon, MessageSquare, Bell, User } from "lucide-react";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="adminShell">

      {/* ===== Admin Topbar ===== */}
      <header className="adminTopbar">
        <div className="adminTopbar__brand" onClick={() => navigate("/admin")} role="button">
          <img src="/assets/Logo.png" alt="IRIS" className="adminTopbar__logo" />
          <span>Seller Centre</span>
        </div>

        <div className="adminTopbar__right">
          <div className="adminTopbar__search">
            <input placeholder="Search" />
            <SearchIcon className="adminTopbar__searchIcon" size={16} strokeWidth={2} />
          </div>

          <button className="iconBtn" aria-label="Messages">
            <MessageSquare size={18} strokeWidth={2} />
          </button>

          <button className="iconBtn iconBtn--dot" aria-label="Notifications">
            <Bell size={18} strokeWidth={2} />
            <span className="iconBtn__dot" />
          </button>

          <button className="iconBtn" aria-label="Account">
            <User size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ===== Body: sidebar + content ===== */}
      <div className="admin">
        <aside className="admin__sidebar">
          <div className="admin__menuHeader">Main menu</div>
          <nav className="admin__menu">
            <NavLink end to="/admin" className="admin__menuItem">Dashboard</NavLink>
            <NavLink to="/admin/orders" className="admin__menuItem">Order Management</NavLink>
            <NavLink to="/admin/customers" className="admin__menuItem">Customers</NavLink>
            <NavLink to="/admin/categories" className="admin__menuItem">Categories</NavLink>

            <div className="admin__menuHeader">Product</div>
            <NavLink to="/admin/add-product" className="admin__menuItem">Add Products</NavLink>
            <NavLink to="/admin/products" className="admin__menuItem">Product List</NavLink>

            <div className="admin__menuHeader">Admin</div>
            <NavLink to="/admin/roles" className="admin__menuItem">Admin role</NavLink>
          </nav>
        </aside>

        <section className="admin__content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
