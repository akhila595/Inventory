import { useEffect, useState } from "react";

interface MonthlyProductSale {
  productName: string;
  sku: string;
  quantity: number;
  saleTotal: number;
  costTotal: number;
  profit: number;
  loss: number;
}

interface MonthlyReportResponse {
  month: string;
  totalSales: number;
  totalProfit: number;
  totalLoss: number;
  totalQuantitySold: number;
  productSales: MonthlyProductSale[];
}

export default function MonthlyReport() {
  const [report, setReport] = useState<MonthlyReportResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/monthly?year=2025&month=8")
      .then(res => res.json())
      .then(data => setReport(data));
  }, []);

  if (!report) return <p>Loading...</p>;

  return (
    <div className="p-4 shadow rounded-xl bg-white">
      <h2 className="text-xl font-semibold mb-4">Monthly Report - {report.month}</h2>
      <p>Total Sales: {report.totalSales}</p>
      <p>Total Profit: {report.totalProfit}</p>
      <p>Total Quantity Sold: {report.totalQuantitySold}</p>

      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">SKU</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Sales</th>
            <th className="p-2 text-right">Cost</th>
            <th className="p-2 text-right">Profit</th>
            <th className="p-2 text-right">Loss</th>
          </tr>
        </thead>
        <tbody>
          {report.productSales.map((p, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{p.productName}</td>
              <td className="p-2">{p.sku}</td>
              <td className="p-2 text-right">{p.quantity}</td>
              <td className="p-2 text-right">{p.saleTotal.toFixed(2)}</td>
              <td className="p-2 text-right">{p.costTotal.toFixed(2)}</td>
              <td className="p-2 text-right text-green-600">{p.profit.toFixed(2)}</td>
              <td className="p-2 text-right text-red-600">{p.loss.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
