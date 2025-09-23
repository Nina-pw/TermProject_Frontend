import './App.css';

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">IRIS</div>
        <nav className="nav">
          <a href="#">SHOP</a>
          <a href="#">CATEGORIES ▼</a>
          <a href="#">ABOUT US</a>
        </nav>
        <div className="header-right">
          <input type="text" placeholder="Search" className="search" />
          <button className="icon">🛒</button>
          <button className="icon">❤️</button>
          <button className="icon">👤</button>
        </div>
      </header>

      {/* Hero / Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Style</h1>
          <p>Shop the latest trends and exclusive products today!</p>
          <button className="cta">SHOP NOW</button>
        </div>
      </section>

      {/* Recommend Section */}
      <section className="recommend">
        <h2>RECOMMEND</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="/images/product1.png" alt="Product 1" />
            <h3>Product 1</h3>
            <p>$49.99</p>
          </div>
          <div className="product-card">
            <img src="/images/product2.png" alt="Product 2" />
            <h3>Product 2</h3>
            <p>$59.99</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
