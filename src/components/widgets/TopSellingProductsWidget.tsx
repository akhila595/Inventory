// src/components/widgets/TopSellingProductsWidget.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getTopSellingProducts } from "@/api/reportApi";

interface TopProduct {
  productName: string;
  quantitySold: number;
  productImage?: string;
}

export default function TopSellingProductsWidget() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const getImageUrl = (url?: string) => {
    if (!url) return "/default-product.jpg";
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Provide startDate, endDate, and optional limit
        const data = await getTopSellingProducts("2025-08-01", "2025-08-31", 5);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching top selling products:", err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-white/40 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-100 rounded-full shadow">
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Top Selling Products</h2>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[260px] pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {products.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            No products sold yet.
          </p>
        ) : (
          products.map((product, idx) => (
            <motion.div
              key={product.productName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/30 backdrop-blur-sm border border-gray-200 hover:shadow-md transition"
            >
              <img
                src={getImageUrl(product.productImage)}
                alt={product.productName}
                className="w-12 h-12 object-cover rounded-lg shadow-sm"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = "/default-product.jpg")
                }
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 truncate">
                  {product.productName}
                </p>
              </div>
              <span className="text-sm font-bold text-indigo-600">
                {product.quantitySold} sold
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
