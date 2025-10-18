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
    "appearance-none bg-[#f3f8ff] text-[#1f2d3d] border border-[#d0e0f0] rounded-lg px-3 py-2 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-[#3498db] transition-all duration-300";

  return (
    <>
      <style>
        {`
          select option {
            background-color: #f3f8ff;
            color: #1f2d3d;
          }
          select option:disabled {
            color: #94a3b8;
            background-color: #f3f8ff;
          }
        `}
      </style>

      {/* Slightly darker blue background */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#bcdfff] via-[#cde7ff] to-[#e0f0ff] shadow-xl border border-[#a3c9f3] transition-all duration-500">
        <div className="flex flex-col bg-[#e6f2ff] p-6 rounded-2xl shadow-lg border border-[#bcdfff] transition-all duration-500 hover:shadow-[#3498db]/30 hover:-translate-y-[2px]">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1d8de2] flex items-center gap-2 drop-shadow-sm">
              <TrendingUp className="text-[#1d8de2] w-6 h-6" />
              Sales Overview
            </h2>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className={`${glassSelectStyle} pr-8`}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#1d8de2]">
                ▼
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            {reportType === "daily" && (
              <DatePicker
                selected={date}
                onChange={setDate}
                dateFormat="yyyy-MM-dd"
                className={glassSelectStyle}
                calendarClassName="light-datepicker"
              />
            )}
            {reportType === "weekly" && (
              <>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  dateFormat="yyyy-MM-dd"
                  className={glassSelectStyle}
                  calendarClassName="light-datepicker"
                />
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  dateFormat="yyyy-MM-dd"
                  className={glassSelectStyle}
                  calendarClassName="light-datepicker"
                />
              </>
            )}
            {reportType === "monthly" && (
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className={`${glassSelectStyle} pr-8`}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(0, i).toLocaleString("en", { month: "long" })}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#1d8de2]">
                  ▼
                </div>
              </div>
            )}
            {reportType === "yearly" && (
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className={`${glassSelectStyle} pr-8`}
                >
                  {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#1d8de2]">
                  ▼
                </div>
              </div>
            )}
          </div>

          {/* Chart / Data */}
          {loading ? (
            <p className="text-sm text-[#1d8de2] animate-pulse">Loading sales data...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <div className="rounded-2xl bg-white p-4 shadow-inner border border-[#bcdfff] transition-all duration-500 hover:shadow-[#1d8de2]/20">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" stroke="#1f2d3d" />
                  <YAxis stroke="#1f2d3d" />
                  <Tooltip
                    contentStyle={{
                      background: "#f3f8ff",
                      border: "1px solid #d0e0f0",
                      borderRadius: 12,
                      color: "#1f2d3d",
                    }}
                    cursor={{ fill: "rgba(52, 152, 219, 0.1)" }}
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
                      <stop offset="0%" stopColor="#66b3ff" stopOpacity={0.95} />
                      <stop offset="50%" stopColor="#339af0" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#1d8de2" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
