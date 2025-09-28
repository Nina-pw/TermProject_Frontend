// src/pages/Home.tsx
import "./Home.css";
import { MOCK_PRODUCTS } from "../mocks/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const heroUrl = "/assets/Home1.png";

  return (
    <div className="home">
      {/* HERO แบบเต็มหน้าจอกว้าง */}
      <section className="hero full-bleed">
        <img src={heroUrl} alt="New Products 2025" className="hero__bg" />
        <div className="hero__overlay">
          {/* ใช้ container แค่กับตัวอักษร เพื่อให้กึ่งกลางตามกริดของหน้า */}
          <div className="container hero__inner">
            <h1 className="hero__title">New Products for 2025</h1>
            <button className="hero__btn">SHOP NOW</button>
          </div>
        </div>
      </section>

      {/* RECOMMEND */}
      <section className="section section--soft">
        <div className="container">
          <h2 className="section__title">RECOMMEND</h2>
          <div className="grid">
            {MOCK_PRODUCTS.slice(0, 6).map((p) => (
              <ProductCard
                key={p.p_id}
                product={p}
                showAddToCart={false} // ← ซ่อนปุ่มในหน้าแรก
                clickableImage={true} // (ตัวเลือก) ให้คลิกรูปไปหน้า /product/:id
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
