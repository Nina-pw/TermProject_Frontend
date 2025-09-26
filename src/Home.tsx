import './Home.css';

const products = [
  { id: 1, name: "Product 1", price: 49.99, img: "/images/product1.png" },
  { id: 2, name: "Product 2", price: 59.99, img: "/images/product2.png" },
  { id: 3, name: "Product 3", price: 39.99, img: "/images/product3.png" },
  { id: 4, name: "Product 4", price: 29.99, img: "/images/product4.png" },
];

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Home</h1>
      <p>Browse our latest products below!</p>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
