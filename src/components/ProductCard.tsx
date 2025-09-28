import { Link } from "react-router-dom";
import { type Product } from "../types";
import "./ProductCard.css";

type Props = {
  product: Product;
  showAddToCart?: boolean;   // ← เพิ่ม
  clickableImage?: boolean;  // (ไม่บังคับ) คลิกภาพไปหน้า detail
};

export default function ProductCard({
  product,
  showAddToCart = true,
  clickableImage = true,
}: Props) {
  const img = product.primary_image_url ?? product.images?.[0] ?? "/assets/placeholder.png";
  const price = product.variants?.[0]?.price ?? product.base_price;

  const Image = (
    <img src={img} alt={product.pname} className="p-card__img" />
  );

  return (
    <article className={`p-card ${!showAddToCart ? "p-card--noCta" : ""}`}>
      {clickableImage ? (
        <Link to={`/product/${product.p_id}`} className="p-card__imageWrap">
          {Image}
        </Link>
      ) : (
        <div className="p-card__imageWrap">{Image}</div>
      )}

      <div className="p-card__meta">
        <h3 className="p-card__name">{product.pname}</h3>
        <div className="p-card__price">฿ {price.toFixed(0)}</div>
      </div>

      {showAddToCart && (
        <button className="p-card__btn">Add to cart</button>
      )}
    </article>
  );
}
