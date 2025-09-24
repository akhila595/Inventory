import React, { useEffect, useState } from "react";

interface TopProduct {
  productName: string;
  quantitySold: number;
  productImage?: string;
}

export default function TopSellingProductsWidget() {
  const [products, setProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/top-selling?startDate=2025-08-01&endDate=2025-08-31&limit=5")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching top selling products:", err));
  }, []);

  return (
    <div className="bg-purple-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-purple-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-purple-800">Top Selling Products 🏆</h3>
        <a href="#" className="text-purple-600 text-sm hover:underline">See all</a>
      </div>
      <ul>
        {products.map((p, index) => (
          <li key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
            <div className="flex items-center">
              <img
                src={p.productImage || "/default-product.jpg"}
                alt={p.productName}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <span className="text-gray-700">{index + 1}. {p.productName}</span>
            </div>
            <span className="font-semibold text-gray-900">{p.quantitySold} sold</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
