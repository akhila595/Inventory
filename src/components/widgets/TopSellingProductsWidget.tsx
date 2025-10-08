import React, { useEffect, useState } from "react";

interface TopProduct {
  productName: string;
  quantitySold: number;
  imageUrl?: string;
}

export default function TopSellingProductsWidget() {
  const [products, setProducts] = useState<TopProduct[]>([]);

  const API_BASE = "http://localhost:8080";

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/default-product.jpg";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE}${imageUrl}`;
  };

  useEffect(() => {
    fetch(
      `${API_BASE}/api/reports/top-selling?startDate=2025-08-01&endDate=2025-08-31&limit=5`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Error fetching top selling products:", err)
      );
  }, []);

  return (
    <div className="bg-purple-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-purple-600 max-h-[600px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-purple-800">
          Top Selling Products 🏆
        </h3>
        <a href="#" className="text-purple-600 text-sm hover:underline">
          See all
        </a>
      </div>
      <ul>
        {products.map((p, index) => (
          <li
            key={index}
            className="flex items-start gap-4 py-5 border-b last:border-b-0"
          >
            {/* Image */}
            <img
              src={getImageUrl(p.imageUrl)}
              alt={p.productName}
              className="w-56 h-56 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-product.jpg";
              }}
            />

            {/* Product Text Info */}
            <div className="flex flex-col justify-between h-full">
              <span className="text-gray-800 text-lg font-medium">
                {index + 1}. {p.productName}
              </span>
              <span className="text-gray-900 font-semibold mt-2">
                {p.quantitySold} sold
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
