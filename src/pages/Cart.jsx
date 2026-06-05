import React, { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const initialItems = [
  { id: 1, name: "Cartoon Astronaut T-Shirts", price: 2499, quantity: 1, image: "https://via.placeholder.com/80x80?text=Shirt+1" },
  { id: 2, name: "Cartoon Astronaut T-Shirts", price: 2499, quantity: 1, image: "https://via.placeholder.com/80x80?text=Shirt+2" },
  { id: 3, name: "Cartoon Astronaut T-Shirts", price: 2499, quantity: 1, image: "https://via.placeholder.com/80x80?text=Shirt+3" },
];

export default function Cart() {
  const [items, setItems] = useState(initialItems);
  const [coupon, setCoupon] = useState("");

  const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id));

  const updateQty = (id, val) => {
    const qty = Math.max(1, Number(val));
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white px-6 py-8 font-sans">

        <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-2xl font-bold text-gray-800">#let's_talk</h1>
            <p className="text-gray-600 mt-2">LEAVE A MESSAGE, We love to hear from you!</p>
            </div>

      {/* Cart Table */}
      <div className="w-full border-t border-b border-gray-200 mb-12">
        {/* Header */}
        <div className="grid grid-cols-[80px_100px_1fr_120px_140px_120px] text-xs font-semibold text-gray-600 tracking-widest uppercase py-4 border-b border-gray-200 text-center">
          <span>Remove</span>
          <span>Image</span>
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>

        {/* Rows */}
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[80px_100px_1fr_120px_140px_120px] items-center py-5 border-b border-gray-100 text-center"
          >
            {/* Remove */}
            <div className="flex justify-center">
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Remove item"
              >
                <AiOutlineCloseCircle size={22} />
              </button>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border border-gray-100"
              />
            </div>

            {/* Product */}
            <div className="text-sm text-gray-700 text-center">{item.name}</div>

            {/* Price */}
            <div className="text-sm text-gray-700">₹{item.price.toLocaleString()}</div>

            {/* Quantity */}
            <div className="flex justify-center">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQty(item.id, e.target.value)}
                className="w-16 border border-gray-300 rounded text-center text-sm py-1.5 focus:outline-none focus:border-[#088178]"
              />
            </div>

            {/* Subtotal */}
            <div className="text-sm text-gray-700">
              ₹{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="flex flex-col lg:flex-row gap-10 justify-between">

        {/* Apply Coupon */}
        <div className="flex-1 max-w-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Apply Coupon</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Your Coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-[#088178] placeholder-gray-400"
            />
            <button className="bg-[#088178] hover:bg-[#066b63] text-white text-sm font-semibold px-6 py-2.5 rounded transition-colors">
              Apply
            </button>
          </div>
        </div>

        {/* Cart Total */}
        <div className="flex-1 max-w-lg border border-gray-200 rounded p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Cart Total</h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border border-gray-200">
                <td className="py-3 px-4 text-gray-600">Cart Subtotal</td>
                <td className="py-3 px-4 text-gray-700 text-right">₹{subtotal.toLocaleString()}</td>
              </tr>
              <tr className="border border-gray-200">
                <td className="py-3 px-4 text-gray-600">Shipping</td>
                <td className="py-3 px-4 text-gray-700 text-right">Free</td>
              </tr>
              <tr className="border border-gray-200">
                <td className="py-3 px-4 font-bold text-gray-800">Total</td>
                <td className="py-3 px-4 font-bold text-gray-800 text-right">₹{subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <button className="mt-5 bg-[#088178] hover:bg-[#066b63] text-white text-sm font-semibold px-6 py-3 rounded transition-colors">
            Proceed to checkout
          </button>
        </div>

      </div>
    </div>
  );
}