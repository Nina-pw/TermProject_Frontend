// src/components/ProductCard.tsx
import React, { useRef } from "react";
import "./ProductCard.css";

type Product = {
  p_id: string;
  name: string;
  price: number;
  image: string;
  swatches?: string[];
  badges?: string[];
};

export default function ProductCard({
  product,
  showAddToCart = true,
  clickableImage = true,
}: {
  product: Product;
  showAddToCart?: boolean;
  clickableImage?: boolean;
}) {
  const swatchContainerRef = useRef<HTMLDivElement | null>(null);
  const swatchSize = 36; // px
  const swatchGap = 10;  // px

const scrollSwatches = (direction: "left" | "right") => {
  if (swatchContainerRef.current) {
    const scrollAmount = swatchSize + swatchGap; // ทีละ 1 swatch
    swatchContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};



  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          onClick={() => {
            if (clickableImage) window.location.href = `/products/${product.p_id}`;
          }}
          role={clickableImage ? "button" : undefined}
        />
        {product.badges?.length ? (
          <div className="badges">
            {product.badges.map((b) => (
              <span key={b} className="badge">{b}</span>
            ))}
          </div>
        ) : null}
      </div>

      {/* swatches row */}
      {product.swatches && product.swatches.length ? (
        <div className="swatches-row">
          <button className="swatch-arrow" onClick={() => scrollSwatches("left")}>
            ‹
          </button>
          <div className="swatches-viewport">
            <div className="swatches" ref={swatchContainerRef}>
              {product.swatches.map((s, i) => (
                <button
                  key={i}
                  className="swatch"
                  style={{
                    background: s.startsWith("#") || s.startsWith("rgb")
                      ? s
                      : `url(${s})`,
                  }}
                  aria-label={`Shade ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <button className="swatch-arrow" onClick={() => scrollSwatches("right")}>
            ›
          </button>
        </div>
      ) : null}

      <div className="product-meta">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-cta">
          <div className="product-price">${product.price.toFixed(2)}</div>
          {showAddToCart ? (
            <button className="add-to-cart">
              ADD TO CART
              {/* ADD TO CART • ${product.price.toFixed(0)} */}
            </button>
          ) : (
            <button className="add-to-cart outlined" disabled>
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
