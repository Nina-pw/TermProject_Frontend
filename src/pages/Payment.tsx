import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "./payment.css";

interface OrderItem {
  id: number;
  name: string;
  shadeName?: string;
  unitPrice: string;
  qty: number;
  lineTotal: string;
  imageUrl?: string;
}

interface Order {
  id: number;
  grandTotal: string;
  subtotal: string;
  shippingFee: string;
  expiresAt?: string;
  items: OrderItem[];
  promptpayQR: string;
}

export default function PaymentPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/orders/1/payment")
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error("Failed to load payment info", err))
      .finally(() => setLoading(false));
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShipping({ ...shipping, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✅ Shipping info saved!\nName: ${shipping.fullName}\nPhone: ${shipping.phone}\nAddress: ${shipping.address}`);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!order) return <p className="error">Order not found</p>;

  return (
    <div className="page-container">
      {/* ซ้าย: QR + ฟอร์ม */}
      <div className="payment-section">
        <div className="qr-wrapper">
          <h2>PromptPay QR</h2>
          <QRCode value={order.promptpayQR} size={220} />
          <p className="amount">Total: {order.grandTotal}฿</p>
          <p className="expire">
            Expires at:{" "}
            {order.expiresAt
              ? new Date(order.expiresAt).toLocaleString()
              : "—"}
          </p>
        </div>

        <form className="shipping-form" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>
          <label>Full Name</label>
          <input type="text" name="fullName" value={shipping.fullName} onChange={handleInput} required />
          <label>Phone Number</label>
          <input type="tel" name="phone" value={shipping.phone} onChange={handleInput} required />
          <label>Address</label>
          <textarea name="address" rows={3} value={shipping.address} onChange={handleInput} required />
          <button type="submit" className="btn-submit">Confirm Shipping</button>
        </form>
      </div>

      {/* ขวา: รายการสินค้าแบบมีรูป */}
      <div className="cart-section">
        <h2>Your Order</h2>
        <ul className="cart-list">
          {order.items.map((item) => (
            <li key={item.id} className="cart-item">
              <div className="item-left">
                <div className="qty-badge">{item.qty}</div>
                <img src={item.imageUrl || "https://via.placeholder.com/60"} alt={item.name} />
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  {item.shadeName && <p className="shade">{item.shadeName}</p>}
                </div>
              </div>
              <div className="item-right">
                {parseFloat(item.unitPrice) === 0 ? (
                  <p className="price">FREE</p>
                ) : (
                  <p className="price">{item.unitPrice}฿</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{order.subtotal}฿</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{order.shippingFee === "0.00" ? "FREE" : `$${order.shippingFee}`}</span>
          </div>
          <div className="summary-total">
            <strong>Total</strong>
            <strong>{order.grandTotal}฿</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
