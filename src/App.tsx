import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Widgets
import SalesWidget from "@/components/widgets/SalesWidget";
import ProfitLossWidget from "@/components/widgets/ProfitLossWidget";
import TopSellingProductsWidget from "@/components/widgets/TopSellingProductsWidget";
import LowStockWidget from "@/components/widgets/LowStockWidget";

// Forms
import StockInForm from "@/components/forms/StockInForm";
import StockOutForm from "@/components/forms/StockOutForm";

// Reports
import MonthlyReport from "@/components/Reports/MonthlyReport";
import CategoryReport from "@/components/Reports/CategoryReport";
import TopSellingProductsReport from "@/components/Reports/TopSellingProductsReport";
import SupplierReport from "@/components/Reports/SupplierReport";
import ProductsTable from "@/components/Reports/ProductsTable";

// Sidebar
import Sidebar from "@/components/Sidebar/Sidebar"; // ✅ Correctly imported

export default function App() {
  const [showStockInForm, setShowStockInForm] = useState(false);
  const [showStockOutForm, setShowStockOutForm] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [activeReport, setActiveReport] = useState<number | null>(null);

  const reports = [
    { id: 1, name: "📆 Monthly Report", color: "bg-gradient-to-r from-blue-400 to-indigo-600" },
    { id: 2, name: "🏷️ Category Report", color: "bg-gradient-to-r from-green-400 to-emerald-600" },
    { id: 3, name: "⭐ Top Selling Products", color: "bg-gradient-to-r from-purple-400 to-pink-600" },
    { id: 4, name: "🏭 Supplier Report", color: "bg-gradient-to-r from-pink-400 to-rose-600" },
    { id: 5, name: "📦 Products Table", color: "bg-gradient-to-r from-orange-400 to-yellow-600 col-span-2" },
  ];

  const renderReport = () => {
    switch (activeReport) {
      case 1:
        return <MonthlyReport />;
      case 2:
        return <CategoryReport />;
      case 3:
        return <TopSellingProductsReport />;
      case 4:
        return <SupplierReport />;
      case 5:
        return <ProductsTable />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 relative">
        {/* Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-[70%,30%] gap-6 mb-6">
          <div className={cn("rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform", "bg-gradient-to-r from-green-100 to-blue-100")}>
            <SalesWidget />
          </div>
          <div className={cn("rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform", "bg-gradient-to-r from-indigo-100 to-purple-100")}>
            <ProfitLossWidget />
          </div>
        </div>

        {/* Middle Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-[30%,70%] gap-6 mb-6">
          <div className={cn("rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform", "bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100")}>
            <LowStockWidget />
          </div>
          <div className={cn("rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform", "bg-gradient-to-r from-pink-100 to-fuchsia-100")}>
            <TopSellingProductsWidget />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 p-6 rounded-2xl shadow-md flex gap-6 justify-center flex-wrap h-32 items-center">
          <button
            onClick={() => setShowStockInForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-110 transition-transform"
          >
            Stock In
          </button>
          <button
            onClick={() => setShowStockOutForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-110 transition-transform"
          >
            Stock Out
          </button>
          <button
            onClick={() => setShowReportMenu(!showReportMenu)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-110 transition-transform"
          >
            Generate Report
          </button>
        </div>

        {/* Reports Menu */}
        {showReportMenu && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {reports.map((report) => (
              <button
                key={report.id}
                className={cn(
                  "p-6 rounded-2xl shadow-lg text-white font-semibold text-lg hover:scale-[1.05] transition-transform",
                  report.color
                )}
                onClick={() => setActiveReport(report.id)}
              >
                {report.name}
              </button>
            ))}
          </div>
        )}

        {/* Render Selected Report */}
        <div className="mt-6">{renderReport()}</div>

        {/* Stock In Modal */}
        {showStockInForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl">
              <button
                onClick={() => setShowStockInForm(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>
              <StockInForm />
            </div>
          </div>
        )}

        {/* Stock Out Modal */}
        {showStockOutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl">
              <button
                onClick={() => setShowStockOutForm(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>
              <StockOutForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
