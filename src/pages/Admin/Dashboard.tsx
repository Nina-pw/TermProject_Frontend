import { MOCK_ORDERS } from "../../mocks/orders";
import { MOCK_PRODUCTS } from "../../mocks/products";
import { MOCK_USERS } from "../../mocks/users";

export default function AdminDashboard() {
  const totalOrders = MOCK_ORDERS.length;
  const totalProducts = MOCK_PRODUCTS.length;
  const totalCustomers = MOCK_USERS.filter(u => u.role === "user").length;
  const totalSales = MOCK_ORDERS.reduce((s, o) => s + o.grand_total, 0);

  return (
    <>
      <h2 style={{margin:"0 0 12px", fontWeight:500, fontFamily: "Quattrocento", fontSize: 24}}>Dashboard</h2>

      {/* KPI */}
      <div className="kpi">
        <div className="kpi__card"><div className="kpi__label">Total Sales</div><div className="kpi__value">฿ {totalSales.toLocaleString()}</div></div>
        <div className="kpi__card"><div className="kpi__label">Total Orders</div><div className="kpi__value">{totalOrders}</div></div>
        <div className="kpi__card"><div className="kpi__label">Products</div><div className="kpi__value">{totalProducts}</div></div>
        <div className="kpi__card"><div className="kpi__label">Customers</div><div className="kpi__value">{totalCustomers}</div></div>
      </div>

      {/* Recent orders */}
      <div className="panel">
        <div className="panel__title">Recent Orders</div>
        <table className="table">
          <thead><tr><th>#</th><th>Date</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {MOCK_ORDERS.slice(0, 8).map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>User #{o.userID}</td>
                <td><span className={`pill pill--${o.status}`}>{o.status}</span></td>
                <td>฿ {o.grand_total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
