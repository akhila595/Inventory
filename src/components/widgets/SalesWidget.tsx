import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import DatePicker from "react-datepicker"; // ✅ correct import
import "react-datepicker/dist/react-datepicker.css";

interface ProductSale {
  productName: string;
  quantity: number;
}

interface SalesResponse {
  productSales: ProductSale[];
}

type ReportType = "daily" | "weekly" | "monthly" | "yearly";

export default function SalesWidget() {
  const today = new Date();

  const [salesData, setSalesData] = useState<{ name: string; sales: number }[]>(
    []
  );
  const [reportType, setReportType] = useState<ReportType>("monthly");

  // Date state management (dynamic defaults)
  const [date, setDate] = useState<Date | null>(today);
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  // Extra states for better UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url = "";

    if (reportType === "daily" && date) {
      const formattedDate = date.toISOString().split("T")[0];
      url = `http://localhost:8080/api/reports/daily?date=${formattedDate}`;
    } else if (reportType === "weekly" && startDate && endDate) {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
      url = `http://localhost:8080/api/reports/weekly?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    } else if (reportType === "monthly") {
      url = `http://localhost:8080/api/reports/monthly?year=${year}&month=${month}`;
    } else if (reportType === "yearly") {
      url = `http://localhost:8080/api/reports/yearly?year=${year}`;
    }

    if (!url) return;

    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((resData: SalesResponse) => {
        setError(null);
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
      .catch(() => setError("Failed to load sales data."))
      .finally(() => setLoading(false));
  }, [reportType, date, startDate, endDate, year, month]);

  return (
    <div className="h-full flex flex-col">
      {/* Header with dropdown */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
        <div className="flex items-center gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
      </div>

      {/* Date/Month/Year Inputs */}
      <div className="flex flex-wrap gap-3 mb-4">
        {reportType === "daily" && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Select Date</label>
            <DatePicker
              selected={date}
              onChange={(date: Date | null) => setDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border rounded-lg px-2 py-1"
            />
          </div>
        )}

        {reportType === "weekly" && (
          <>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border rounded-lg px-2 py-1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border rounded-lg px-2 py-1"
              />
            </div>
          </>
        )}

        {reportType === "monthly" && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Select Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index + 1}>
                  {new Date(0, index).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        )}

        {reportType === "yearly" && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Select Year</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                )
              )}
            </select>
          </div>
        )}
      </div>

      {/* Loading / Error / Chart */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
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
      )}
    </div>
  );
}
