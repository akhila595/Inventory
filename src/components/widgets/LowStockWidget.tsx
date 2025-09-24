import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface LowStockProduct {
  productName: string;
  stockQty: number;
}

export default function LowStockWidget() {
  const [lowStockItems, setLowStockItems] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/low-stock")
      .then((res) => res.json())
      .then((data) => setLowStockItems(data))
      .catch((err) => console.error("Error fetching low stock items:", err));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h2 className="text-xl font-bold text-gray-800">Low Stock Alerts</h2>
      </div>
      <div className="space-y-2 overflow-y-auto">
        {lowStockItems.map((item) => (
          <div
            key={item.productName}
            className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 shadow-sm"
          >
            <span className="font-medium text-gray-700">{item.productName}</span>
            <span className="text-sm font-bold text-red-600">{item.stockQty} left</span>
          </div>
        ))}
      </div>
    </div>
  );
}
