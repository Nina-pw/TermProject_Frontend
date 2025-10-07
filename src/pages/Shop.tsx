import { useEffect, useMemo, useRef, useState } from "react";
import "./Shop.css";

/* ---------- Types ---------- */
export type SimpleProduct = {
  id: number;
  name: string;
  price: number;
  img?: string | null;
};

type ApiProduct =
  | {
      id?: number;
      p_id?: number;
      pname?: string;
      name?: string;
      base_price?: number | string;
      price?: number | string;
      primary_image_url?: string | null;
      images?: string[] | null;
      img?: string | null;
    }
  | Record<string, unknown>;

type SortKey = "priceAsc" | "priceDesc" | "default";

/* ---------- UI config ---------- */
const CHIPS = [
  { key: "bestsellers", label: "Bestsellers" },
  { key: "new", label: "New", checked: true },
  { key: "priceAsc", label: "Price ascending" },
  { key: "priceDesc", label: "Price descending" },
  { key: "rating", label: "Rating" },
] as const;

// ถ้าหน้าบ้านยังไม่มี endpoint ดึง categories ให้ใช้ลิสต์คงที่ก่อน
const CATEGORIES = ["LIPS", "EYES", "FACE", "CHEEKS", "BODY", "TOOLS"] as const;

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE ?? "";

/* ---------- Helpers ---------- */
function toSimple(p: ApiProduct): SimpleProduct | null {
  const id = Number((p as any).id ?? (p as any).p_id);
  const name = String((p as any).pname ?? (p as any).name ?? "");
  const priceRaw = (p as any).base_price ?? (p as any).price ?? 0;
  const price = Number(priceRaw);
  const img =
    (p as any).primary_image_url ??
    (p as any).img ??
    (Array.isArray((p as any).images) ? (p as any).images[0] : undefined);

  if (!Number.isFinite(id) || !name) return null;
  return { id, name, price: Number.isFinite(price) ? price : 0, img };
}

async function fetchCategory(category: string, signal?: AbortSignal) {
  // รองรับทั้งสองเส้นแบบเดิม
  const urls = [
    `${API_BASE}/api/products?category=${encodeURIComponent(category)}`,
    `${API_BASE}/api/shop/products?category=${encodeURIComponent(category)}`,
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u, { signal, credentials: "include" });
      if (!res.ok) continue;
      const data = await res.json();
      const list: ApiProduct[] = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.items)
        ? (data as any).items
        : [];
      const mapped = list.map(toSimple).filter(Boolean) as SimpleProduct[];
      if (mapped.length) return mapped;
    } catch {
      // ลองตัวถัดไป
    }
  }
  return [] as SimpleProduct[];
}

/* ---------- UI pieces ---------- */
function ProductCard({ p, loading = false }: { p?: SimpleProduct; loading?: boolean }) {
  if (loading) {
    return (
      <div className="card is-loading">
        <div className="card__thumb" />
        <div className="card__body">
          <div className="card__name skeleton" />
          <div className="card__price skeleton" />
        </div>
      </div>
    );
  }
  if (!p) return null;
  return (
    <div className="card">
      <div className="card__thumb">
        {p.img ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img src={p.img} alt={p.name} />
        ) : (
          <div className="card__ph" aria-label="no image">
            <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden>
              <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14" fill="none" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M3 19l6-7 5 5 3-3 4 5H3z" fill="none" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx="9" cy="8" r="1.6" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>
      <div className="card__body">
        <div className="card__name">{p.name}</div>
        <div className="card__price">${p.price}</div>
      </div>
    </div>
  );
}

function ProductCarousel({
  titleImg,
  titleText,
  items,
  query,
  sort,
  loading = false,
}: {
  titleImg?: string;
  titleText: string;
  items: SimpleProduct[];
  query: string;
  sort: SortKey;
  loading?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let out = items.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "priceAsc") out = out.slice().sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") out = out.slice().sort((a, b) => b.price - a.price);
    return out;
  }, [items, query, sort]);

  const total = loading ? 8 : filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / 4));
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
      <div className="hero" style={{ backgroundImage: titleImg ? `url(${titleImg})` : undefined }}>
        <div className="hero__title">{titleText}</div>
      </div>

      <div className="row">
        <div className="row__viewport" ref={wrapRef}>
          <div className="row__track">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCard key={`ph-${i}`} loading />)
              : filtered.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>

        <button className="row__next" onClick={() => scrollToPage(Math.min(page + 1, totalPages - 1))} aria-label="Next">
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

/* ---------- Page ---------- */
export default function Shop() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState(CHIPS.find((c) => (c as any).checked)?.key ?? "");
  const sort: SortKey = chip === "priceAsc" ? "priceAsc" : chip === "priceDesc" ? "priceDesc" : "default";

  // เก็บข้อมูลต่อหมวดใน object แทน state หลายตัว
  const [byCategory, setByCategory] = useState<Record<string, SimpleProduct[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    (async () => {
      const entries = await Promise.all(
        CATEGORIES.map(async (cat) => [cat, await fetchCategory(cat, ctrl.signal)] as const)
      );
      const obj: Record<string, SimpleProduct[]> = {};
      for (const [cat, list] of entries) obj[cat] = list;
      setByCategory(obj);
      setLoading(false);
    })();

    return () => ctrl.abort();
  }, []);

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
              onClick={() => setChip(c.key as any)}
              className={`chip ${chip === c.key ? "is-active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections: loop ทุกหมวด */}
      {CATEGORIES.map((cat) => (
        <ProductCarousel
          key={cat}
          titleImg={`/assets/hero-${cat.toLowerCase()}.jpg`}  // วางรูป banner ชื่อไฟล์ตามหมวด (ถ้าไม่มีปล่อยว่างได้)
          titleText={cat}
          items={byCategory[cat] ?? []}
          query={query}
          sort={sort}
          loading={loading}
        />
      ))}
    </div>
  );
}
