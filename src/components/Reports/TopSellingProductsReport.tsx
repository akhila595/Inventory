import React from "react";
import { Crown } from "lucide-react";

const topProducts = [
  { name: "Denim Jacket", sales: 320 },
  { name: "Sneakers", sales: 280 },
  { name: "T-Shirt", sales: 250 },
  { name: "Cap", sales: 180 },
];

export default function TopSellingProductsWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">Top Selling Products</h2>
      </div>
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div
            key={product.name}
            className="flex justify-between items-center p-4 rounded-xl shadow-md bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 hover:scale-[1.02] transition-transform"
          >
            <span className="font-medium text-gray-700">
              #{index + 1} {product.name}
            </span>
            <span className="text-sm font-bold text-indigo-600">{product.sales} sales</span>
          </div>
        ))}
      </div>
    </div>
  );
}
