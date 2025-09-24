import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface ProductSale {
  productName: string;
  quantity: number;
}

export default function SalesWidget() {
  const [salesData, setSalesData] = useState<{ name: string; sales: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/monthly?year=2025&month=8")
      .then((res) => res.json())
      .then((resData) => {
        const aggregated: Record<string, number> = {};
        resData.productSales.forEach((sale: ProductSale) => {
          if (!aggregated[sale.productName]) aggregated[sale.productName] = 0;
          aggregated[sale.productName] += sale.quantity;
        });
        const chartData = Object.keys(aggregated).map((key) => ({
          name: key,
          sales: aggregated[key],
        }));
        setSalesData(chartData);
      })
      .catch((err) => console.error("Error fetching sales data:", err));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
        <TrendingUp className="w-6 h-6 text-green-600" />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={salesData}>
          <XAxis dataKey="name" stroke="#555" />
          <YAxis />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
          <Bar dataKey="sales" fill="url(#salesGradient)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
