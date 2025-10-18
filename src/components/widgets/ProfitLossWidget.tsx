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

  const COLORS = ["#34d399", "#f87171"]; // green & red

  useEffect(() => {
    // Keep your date params or make them dynamic if needed
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col items-center justify-center
        bg-gradient-to-br from-[#bcdfff] via-[#cde7ff] to-[#e0f0ff]
        rounded-2xl shadow-xl border border-[#a3c9f3] p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#38bdf8]/20 rounded-full shadow-sm">
          <DollarSign className="w-5 h-5 text-[#38bdf8]" />
        </div>
        <h2 className="text-lg font-semibold text-[#1f2d3d]">
          Profit vs Loss
        </h2>
      </div>

      {/* Chart card (white-ish for contrast) */}
      <div className="w-full rounded-2xl bg-[#f3f9ff] p-2">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
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
                backgroundColor: "rgba(243, 249, 255, 0.95)",
                borderRadius: 10,
                border: "1px solid rgba(163,201,243,0.6)",
                color: "#1f2d3d",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
