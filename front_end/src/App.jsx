import React, { useState, useEffect } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");

  // Fetch products from the backend on load
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setOrderStatus(""); // Clear previous order messages when adding new items
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart })
      });
      
      const data = await response.json();
      setOrderStatus(data.message);
      setCart([]); // Empty cart after successful checkout
    } catch (error) {
      console.error("Checkout failed:", error);
      setOrderStatus("Checkout failed. Please try again.");
    }
  };

  // Calculate total price
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">The Layered Lair</h1>
        <p className="text-slate-500 mt-2 text-lg">Premium 3D Printed Toys & Gadgets</p>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Product Grid */}
        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{product.category}</span>
              </div>
              <p className="text-slate-500 mb-6 text-sm">Material: <span className="font-medium text-slate-700">{product.material}</span></p>
              
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xl font-black text-indigo-600">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Cart Sidebar */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-8">
          <h2 className="text-2xl font-bold mb-6 border-b border-slate-100 pb-4 text-slate-800">Your Cart</h2>
          
          {cart.length === 0 ? (
            <p className="text-slate-500 italic text-center py-4">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-slate-700">
                  <span className="truncate pr-4">{item.name}</span>
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-slate-100 pt-6 mt-4">
            <div className="flex justify-between font-black text-xl mb-6 text-slate-800">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-emerald-500 text-white py-3.5 rounded-lg font-bold hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Checkout & Print
            </button>
          </div>

          {orderStatus && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium text-center">
              {orderStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;