// src/pages/Home.tsx
import "./Home.css";
import ProductCard from "../components/ProductCard";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Banner = {
  id: string;
  img: string;
  title?: string;
  subtitle?: string;
  btnText?: string;
  action: "route" | "scroll" | "routeWithQuery";
  route?: string;
  query?: Record<string, string>;
  scrollToId?: string;
};

type Product = {
  p_id: string;
  name: string;
  price: number;
  image: string;
  swatches?: string[]; // hex color or image url for shade dots
  badges?: string[]; // e.g. ["Bestseller"]
};

export default function Home() {
  const navigate = useNavigate();

  const banners: Banner[] = [
    {
      id: "hero-1",
      img: "/assets/pic7.png",
      title: "Shop Our Entire Collection",
      subtitle: "Discover our curated selection for the year.",
      btnText: "SHOP NOW",
      action: "route",
      route: "/Shop",
    },
    {
      id: "hero-2",
      img: "/assets/pic6.jpg",
      title: "Bestsellers",
      subtitle: "Our customers' favourite picks.",
      btnText: "SHOP NOW",
      action: "scroll",
      scrollToId: "bestsellers",
    },
    {
      id: "hero-3",
      img: "/assets/pic5.png",
      title: "New Arrivals",
      subtitle: "Fresh products — just landed.",
      btnText: "SHOP NOW",
      action: "routeWithQuery",
      route: "/Shop",
      query: { filter: "new" },
    },
  ];

  // HERO carousel state
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const autoplayDelay = 4000;

  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, autoplayDelay);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goTo = (i: number) => {
    setIndex(i % banners.length);
    startAuto();
  };

  const handleBtn = (b: Banner) => {
    if (b.action === "route" && b.route) {
      navigate(b.route);
    } else if (b.action === "routeWithQuery" && b.route) {
      const q = new URLSearchParams(b.query || {}).toString();
      navigate(`${b.route}${q ? `?${q}` : ""}`);
    } else if (b.action === "scroll" && b.scrollToId) {
      const el = document.getElementById(b.scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // ----------------------
  // 🔥 Bestsellers state
  // ----------------------
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [bsLoading, setBsLoading] = useState(false);
  const [bsError, setBsError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Array of products 
  // useEffect(() => {
  //   fetch("/api/bestsellers")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("no api");
  //       return res.json();
  //     })
  //     .then((data) => setBestsellers(data))
  //     .catch(() => {
  //       // fallback: load mock data bundled in public or inline fallback
  //       // Option A: fetch from /mock-bestsellers.json (recommended)
  //       fetch("/mock-bestsellers.json")
  //         .then((r) => r.json())
  //         .then((d) => setBestsellers(d))
  //         .catch(() => {
  //           // Inline minimal fallback in case nothing exists
  //           setBestsellers([
  //             {
  //               p_id: "1",
  //               name: "Soft Pinch Liquid Contour",
  //               price: 28,
  //               image: "/assets/product1.jpg",
  //               swatches: ["#f0d7cf", "#d6b79a", "#a97b55"],
  //               badges: ["Bestseller"],
  //             },
  //             {
  //               p_id: "2",
  //               name: "Soft Pinch Tinted Lip Oil",
  //               price: 22,
  //               image: "/assets/product2.jpg",
  //               swatches: ["#f1b0a9", "#d86b7b", "#7b2b3a"],
  //             },
  //             {
  //               p_id: "3",
  //               name: "Warm Wishes Effortless Bronzer Stick",
  //               price: 28,
  //               image: "/assets/product3.jpg",
  //               swatches: ["#f3d6c2", "#d9a07a", "#8f5a3a"],
  //             },
  //             {
  //               p_id: "4",
  //               name: "Find Comfort Mini Lotion & Fragrance",
  //               price: 27,
  //               image: "/assets/product4.jpg",
  //               swatches: ["#f8e7e5", "#e7c9c5"],
  //             },
  //           ]);
  //         });
  //     });
  // }, []);


  // Mock data from public/mock-bestsellers.json
  useEffect(() => {
  fetch("/api/bestsellers")
    .then((res) => {
      if (!res.ok) throw new Error("no api");
      return res.json();
    })
    .then((data) => setBestsellers(data))
    .catch(() => {
      // ถ้าไม่มี backend ให้โหลด mock file จาก public/
      fetch("/mock-bestsellers.json")
        .then((r) => {
          if (!r.ok) throw new Error("no mock");
          return r.json();
        })
        .then((d) => setBestsellers(d))
        .catch((err) => {
          console.error("Failed to load mock-bestsellers.json", err);
          // เอา inline fallback ออก — ถ้าต้องการให้ว่างไว้ ให้เป็น [] หรือ set error state เพื่อแสดง UI ว่าไม่มีข้อมูล
          setBestsellers([]);
        });
    });
}, []);

//Backend API
// useEffect(() => {
//     let mounted = true;
//     const controller = new AbortController();

//     const loadBestsellers = async () => {
//       setBsLoading(true);
//       setBsError(null);
//       try {
//         const res = await fetch("/api/bestsellers", {
//           signal: controller.signal,
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
//         const data = await res.json();
//         if (mounted) setBestsellers(data);
//       } catch (err: any) {
//         if (err.name === "AbortError") return;
//         console.error("Failed to load bestsellers:", err);
//         if (mounted) setBsError(err.message || "Failed to load data");
//       } finally {
//         if (mounted) setBsLoading(false);
//       }
//     };

//     loadBestsellers();

//     return () => {
//       mounted = false;
//       controller.abort();
//     };
//   }, []);


  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -420, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 420, behavior: "smooth" });
  };

  return (
    <div className="home">
      {/* HERO carousel */}
      <section
        className="hero full-bleed carousel"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <div
          className="carousel-track"
          ref={trackRef}
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite"
        >
          {banners.map((b) => (
            <div key={b.id} className="carousel-slide">
              <img src={b.img} alt={b.title ?? "Hero"} className="hero__bg" />
              <div className="hero__overlay">
                <div className="container hero__inner">
                  {b.title && <h1 className="hero__title">{b.title}</h1>}
                  {b.subtitle && (
                    <p className="hero__subtitle">{b.subtitle}</p>
                  )}
                  {b.btnText && (
                    <button
                      className="hero__btn"
                      onClick={() => handleBtn(b)}
                    >
                      {b.btnText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="carousel-dots">
          {banners.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* arrows */}
        <button
          className="carousel-arrow left"
          onClick={() => {
            setIndex((i) => (i - 1 + banners.length) % banners.length);
            startAuto();
          }}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          className="carousel-arrow right"
          onClick={() => {
            setIndex((i) => (i + 1) % banners.length);
            startAuto();
          }}
          aria-label="Next slide"
        >
          ›
        </button>
      </section>

       {/* 🔥 Bestsellers section */}
      <section id="bestsellers" className="section section--bestsellers">
        <div className="container">
          <div className="bestsellers-headline">
            <h2 className="section__title">Bestsellers</h2>
            <a className="small-link" href="/shop?sort=bestseller">SHOP NOW</a>
          </div>

          <div className="bestseller-wrapper">
            <button className="scroll-btn left" onClick={scrollLeft} aria-label="Scroll left">‹</button>

            <div className="bestseller-scroll" ref={scrollRef}>
              {bestsellers.map((p) => (
                <ProductCard
                  key={p.p_id}
                  product={p}
                  showAddToCart={true}
                  clickableImage={true}
                />
              ))}
            </div>

             {/* <div className="bestseller-scroll" ref={scrollRef}>
              {bsLoading && <p>Loading...</p>}
              {bsError && <p className="error">{bsError}</p>}
              {!bsLoading && !bsError &&
                bestsellers.map((p) => (
                  <ProductCard
                    key={p.p_id}
                    product={p}
                    showAddToCart={true}
                    clickableImage={true}
                  />
                ))}
            </div> */}

            <button className="scroll-btn right" onClick={scrollRight} aria-label="Scroll right">›</button>
          </div>
        </div>
      </section>

      {/* Banner with text + image (after Bestsellers) */}
      <section className="section banner-shade">
        <div className="container banner-shade__inner">
          <div className="banner-shade__image">
            <img src="/assets/pic8.jpg" alt="Find your shade" />
          </div>
          <div className="banner-shade__content">
            <h2 className="banner-shade__title">Find Your Perfect Shade</h2>
            <p className="banner-shade__desc">
              Discover foundation and makeup that match your unique skin tone.
              Our shade finder helps you explore and select products with
              confidence.
            </p>
            <button className="banner-shade__btn">FIND YOUR SHADE</button>
          </div>
        </div>
      </section>

            {/* Shop by Categories */}
      <section className="section section--categories">
        <div className="container">
          <div className="categories-headline">
            <h2 className="section__title">Shop by Categories</h2>
            <a className="small-link" href="/categories">SEE MORE</a>
          </div>

          <div className="categories-grid">
            {[
              { id: "face", name: "Face", img: "/assets/pic11.jpg" },
              { id: "Eyes", name: "Eyes", img: "/assets/pic9.jpg" },
              { id: "Lips", name: "Lips", img: "/assets/pic10.jpg" },
              { id: "Cheeks", name: "Cheeks", img: "/assets/pic12.jpg" },
            ].map((cat) => (
              <a
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="category-card"
              >
                <div className="hex">
                  <img src={cat.img} alt={cat.name} />
                  <span className="cat-label">{cat.name}</span>
                </div>
              </a>
            ))}
          </div>


        </div>
      </section>



    </div>
  );
}
