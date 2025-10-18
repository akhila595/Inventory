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
    if (!url) return "/images/pexels-jplenio-1103970.jpg";
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col
        bg-gradient-to-br from-[#bcdfff] via-[#cde7ff] to-[#e0f0ff]
        rounded-2xl shadow-xl border border-[#a3c9f3] p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-400/20 rounded-full shadow-sm">
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
        <h2 className="text-lg font-semibold text-[#1f2d3d] tracking-wide">
          Top Selling Products
        </h2>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[260px] pr-1">
        {products.length === 0 ? (
          <p className="text-[#0f172a] italic text-center py-8">
            No products sold yet.
          </p>
        ) : (
          products.map((product, idx) => (
            <motion.div
              key={product.productName}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl
                bg-white/60 border border-[#dbeeff] hover:bg-white/70 transition shadow-sm"
            >
              <img
                src={getImageUrl(product.productImage)}
                alt={product.productName}
                className="w-12 h-12 object-cover rounded-lg shadow-sm"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = "/images/pexels-jplenio-1103970.jpg")
                }
              />
              <div className="flex-1">
                <p className="font-medium text-[#0f172a] truncate">
                  {product.productName}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#059669]">
                {product.quantitySold} sold
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
