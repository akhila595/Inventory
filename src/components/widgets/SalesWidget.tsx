import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getYearlyReport,
} from "@/api/reportApi";

export default function SalesWidget() {
  const today = new Date();
  const [salesData, setSalesData] = useState<{ name: string; sales: number }[]>([]);
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [date, setDate] = useState<Date | null>(today);
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let resData = null;
        if (reportType === "daily" && date)
          resData = await getDailyReport(date.toISOString().split("T")[0]);
        else if (reportType === "weekly" && startDate && endDate)
          resData = await getWeeklyReport(
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0]
          );
        else if (reportType === "monthly")
          resData = await getMonthlyReport(year, month);
        else if (reportType === "yearly")
          resData = await getYearlyReport(year);

        if (resData) {
          const aggregated: Record<string, number> = {};
          resData.productSales.forEach(
            (sale: any) =>
              (aggregated[sale.productName] =
                (aggregated[sale.productName] || 0) + sale.quantity)
          );
          setSalesData(
            Object.entries(aggregated).map(([name, sales]) => ({ name, sales }))
          );
        }
      } catch {
        setError("Failed to load sales data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reportType, date, startDate, endDate, year, month]);

  const glassSelectStyle =
    "bg-gradient-to-r from-[#312e81]/70 to-[#1e1b4b]/70 text-cyan-100 border border-white/20 rounded-lg px-3 py-2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300";

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0f172a]/90 via-[#1e1b4b]/80 to-[#312e81]/90 shadow-2xl border border-white/10 backdrop-blur-2xl transition-all duration-500">
      <div className="flex flex-col bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 transition-all duration-500 hover:shadow-cyan-500/20 hover:-translate-y-[2px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-300 flex items-center gap-2 drop-shadow-sm">
            <TrendingUp className="text-cyan-400 w-6 h-6" />
            Sales Overview
          </h2>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className={glassSelectStyle}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          {reportType === "daily" && (
            <DatePicker
              selected={date}
              onChange={setDate}
              dateFormat="yyyy-MM-dd"
              className={glassSelectStyle}
            />
          )}
          {reportType === "weekly" && (
            <>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                dateFormat="yyyy-MM-dd"
                className={glassSelectStyle}
              />
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                dateFormat="yyyy-MM-dd"
                className={glassSelectStyle}
              />
            </>
          )}
          {reportType === "monthly" && (
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className={glassSelectStyle}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          )}
          {reportType === "yearly" && (
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className={glassSelectStyle}
            >
              {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Chart / Data */}
        {loading ? (
          <p className="text-sm text-cyan-300 animate-pulse">Loading sales data...</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <div className="rounded-2xl bg-gradient-to-tr from-[#1e1b4b]/90 via-[#312e81]/80 to-[#3730a3]/90 backdrop-blur-xl p-4 shadow-inner border border-white/10 transition-all duration-500 hover:shadow-cyan-400/10">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#E0E7FF" />
                <YAxis stroke="#E0E7FF" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 12,
                    color: "#F0F9FF",
                    backdropFilter: "blur(10px)",
                  }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Bar
                  dataKey="sales"
                  fill="url(#barGradient)"
                  radius={[10, 10, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A5F3FC" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#7DD3FC" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
