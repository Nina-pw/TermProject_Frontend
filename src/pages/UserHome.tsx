import { useMemo, useRef, useState } from "react";
import "./UserHome.css";

type SimpleProduct = {
  id: number;
  name: string;
  price: number;
  img?: string;
};

const CHIPS = [
  { key: "bestsellers", label: "Bestsellers" },
  { key: "new", label: "New", checked: true },
  { key: "priceAsc", label: "Price ascending" },
  { key: "priceDesc", label: "Price descending" },
  { key: "rating", label: "Rating" },
];

const lipsProducts: SimpleProduct[] = new Array(8).fill(0).map((_, i) => ({
  id: i + 1,
  name: "Text",
  price: 0,
}));
const mascaraProducts: SimpleProduct[] = new Array(8).fill(0).map((_, i) => ({
  id: i + 101,
  name: "Text",
  price: 0,
}));

/** การ์ดสินค้า (มี placeholder) */
function ProductCard({ p }: { p: SimpleProduct }) {
  return (
    <div className="card">
      <div className="card__thumb">
        {/* ถ้าไม่มีรูปให้ขึ้น placeholder */}
        <div className="card__ph">
          <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden>
            <path
              d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M3 19l6-7 5 5 3-3 4 5H3z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <circle cx="9" cy="8" r="1.6" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div className="card__body">
        <div className="card__name">{p.name}</div>
        <div className="card__price">${p.price}</div>
      </div>
    </div>
  );
}

/** แถวสไลด์สินค้าแนวนอน */
function ProductCarousel({
  titleImg,
  titleText,
  items,
  query,
  sort,
}: {
  titleImg?: string;
  titleText: string;
  items: SimpleProduct[];
  query: string;
  sort: "priceAsc" | "priceDesc" | "default";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let out = items.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "priceAsc") out = out.slice().sort((a, b) => a.price - b.price);
    if (sort === "priceDesc")
      out = out.slice().sort((a, b) => b.price - a.price);
    return out;
  }, [items, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 4));
  const [page, setPage] = useState(0);

  const scrollToPage = (idx: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: idx * width, behavior: "smooth" });
    setPage(idx);
  };

  return (
    <section className="sec">
      <div
        className="hero"
        style={{
          backgroundImage: titleImg ? `url(${titleImg})` : undefined,
        }}
      >
        <div className="hero__title">{titleText}</div>
      </div>

      <div className="row">
        <div className="row__viewport" ref={wrapRef}>
          <div className="row__track">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>

        <button
          className="row__next"
          onClick={() => scrollToPage(Math.min(page + 1, totalPages - 1))}
          aria-label="Next"
        >
          ▶
        </button>

        <div className="row__dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`dot ${i === page ? "is-active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToPage(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function UserHome() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState(CHIPS.find((c) => c.checked)?.key ?? "");

  const sort: "priceAsc" | "priceDesc" | "default" =
    chip === "priceAsc" ? "priceAsc" : chip === "priceDesc" ? "priceDesc" : "default";

  return (
    <div className="uHome container">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="searchWrap">
          <input
            className="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="searchIcon">🔍</span>
        </div>

        <div className="chips">
          {CHIPS.map((c) => (
            <button
              key={c.key}
              onClick={() => setChip(c.key)}
              className={`chip ${chip === c.key ? "is-active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <ProductCarousel
        titleImg="/assets/hero-lips.jpg"   /* ใส่รูปของคุณ */
        titleText="LIPS"
        items={lipsProducts}
        query={query}
        sort={sort}
      />

      <ProductCarousel
        titleImg="/assets/hero-mascara.jpg" /* ใส่รูปของคุณ */
        titleText="MASCARA"
        items={mascaraProducts}
        query={query}
        sort={sort}
      />
    </div>
  );
}
