import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { getLowStockProducts } from "@/api/reportApi";

interface LowStockProduct {
  productName: string;
  stockQty: number;
}

export default function LowStockWidget() {
  const [lowStockItems, setLowStockItems] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    getLowStockProducts()
      .then(setLowStockItems)
      .catch((err) => console.error(err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-white/40 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 rounded-full shadow">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Low Stock Alerts</h2>
      </div>

      {/* List */}
      <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {lowStockItems.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            ✅ All products in good stock!
          </p>
        ) : (
          lowStockItems.map((item, index) => (
            <motion.div
              key={item.productName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex justify-between items-center p-3 rounded-xl bg-white/30 backdrop-blur-sm border border-gray-200 hover:shadow-md transition"
            >
              <span className="font-semibold text-gray-800 truncate">
                {item.productName}
              </span>
              <span className="text-sm font-bold text-red-600">
                {item.stockQty} left
              </span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
