import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDailyReport, getWeeklyReport, getMonthlyReport, getYearlyReport } from "@/api/reportApi";

export default function SalesWidget() {
  const today = new Date();
  const [salesData, setSalesData] = useState<{ name: string; sales: number }[]>([]);
  const [reportType, setReportType] = useState<"daily"|"weekly"|"monthly"|"yearly">("monthly");
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
        if (reportType === "daily" && date) resData = await getDailyReport(date.toISOString().split("T")[0]);
        else if (reportType === "weekly" && startDate && endDate) resData = await getWeeklyReport(startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]);
        else if (reportType === "monthly") resData = await getMonthlyReport(year, month);
        else if (reportType === "yearly") resData = await getYearlyReport(year);

        if (resData) {
          const aggregated: Record<string, number> = {};
          resData.productSales.forEach((sale: any) => aggregated[sale.productName] = (aggregated[sale.productName] || 0) + sale.quantity);
          setSalesData(Object.entries(aggregated).map(([name, sales]) => ({ name, sales })));
        }
      } catch {
        setError("Failed to load sales data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reportType, date, startDate, endDate, year, month]);

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-emerald-500 w-6 h-6" /> Sales Overview
        </h2>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as any)}
          className="border border-gray-300 bg-white rounded-lg px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Date/Month/Year Pickers */}
      <div className="flex flex-wrap gap-4 mb-4">
        {reportType === "daily" && <DatePicker selected={date} onChange={setDate} dateFormat="yyyy-MM-dd" className="border rounded-lg px-3 py-1 shadow-sm text-sm" />}
        {reportType === "weekly" && <>
          <DatePicker selected={startDate} onChange={setStartDate} dateFormat="yyyy-MM-dd" className="border rounded-lg px-3 py-1 shadow-sm text-sm" />
          <DatePicker selected={endDate} onChange={setEndDate} dateFormat="yyyy-MM-dd" className="border rounded-lg px-3 py-1 shadow-sm text-sm" />
        </>}
        {reportType === "monthly" && <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="border rounded-lg px-3 py-1 shadow-sm text-sm">
          {Array.from({length:12}, (_,i)=> <option key={i} value={i+1}>{new Date(0,i).toLocaleString("en",{month:"long"})}</option>)}
        </select>}
        {reportType === "yearly" && <select value={year} onChange={(e)=>setYear(parseInt(e.target.value))} className="border rounded-lg px-3 py-1 shadow-sm text-sm">
          {Array.from({length:10}, (_,i)=> today.getFullYear()-5+i).map(y=> <option key={y} value={y}>{y}</option>)}
        </select>}
      </div>

      {loading ? <p className="text-gray-500 text-sm">Loading...</p> :
       error ? <p className="text-red-500 text-sm">{error}</p> :
       <ResponsiveContainer width="100%" height={250}>
         <BarChart data={salesData}>
           <XAxis dataKey="name" stroke="#6b7280" />
           <YAxis />
           <Tooltip cursor={{ fill:"rgba(0,0,0,0.05)" }} />
           <Bar dataKey="sales" fill="url(#salesGradient)" radius={[10,10,0,0]} />
           <defs>
             <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
               <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6}/>
             </linearGradient>
           </defs>
         </BarChart>
       </ResponsiveContainer>
      }
    </div>
  );
}
