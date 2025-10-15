import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { getMonthlyReport } from "@/api/reportApi";

export default function ProfitLossWidget() {
  const [data, setData] = useState([
    { name: "Profit", value: 0 },
    { name: "Loss", value: 0 },
  ]);

  const COLORS = ["#10b981", "#ef4444"]; // green & red

  useEffect(() => {
    getMonthlyReport(2025, 8)
      .then((resData) =>
        setData([
          { name: "Profit", value: resData.totalProfit ?? 0 },
          { name: "Loss", value: resData.totalLoss ?? 0 },
        ])
      )
      .catch(console.error);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-indigo-100 rounded-full shadow">
          <DollarSign className="w-5 h-5 text-indigo-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Profit vs Loss</h2>
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={85}
            label={({ name, value }) => `${name}: ₹${value}`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `₹${value}`}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
