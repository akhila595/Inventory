import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";

interface ProductSale {
  profit: number;
  loss: number;
}

export default function ProfitLossWidget() {
  const [data, setData] = useState<{ name: string; value: number }[]>([
    { name: "Profit", value: 0 },
    { name: "Loss", value: 0 },
  ]);

  const COLORS = ["#10b981", "#ef4444"]; // Green for profit, Red for loss

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/monthly?year=2025&month=8")
      .then((res) => res.json())
      .then((resData) => {
        const totalProfit = resData.totalProfit ?? 0;
        const totalLoss = resData.totalLoss ?? 0;
        setData([
          { name: "Profit", value: totalProfit },
          { name: "Loss", value: totalLoss },
        ]);
      })
      .catch((err) => console.error("Error fetching profit/loss data:", err));
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-6 h-6 text-indigo-600" />
        <h2 className="text-lg font-bold text-gray-800">Profit vs Loss</h2>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `₹${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
