import { useEffect, useState } from "react";

interface CategoryReportItem {
  categoryName: string;
  totalSales: number;
  totalCost: number;
  profit: number;
  loss: number;
}

export default function CategoryReport() {
  const [categories, setCategories] = useState<CategoryReportItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/category?startDate=2025-08-01&endDate=2025-08-31")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div className="p-4 shadow rounded-xl bg-white">
      <h2 className="text-xl font-semibold mb-4">Category Report</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-right">Sales</th>
            <th className="p-2 text-right">Cost</th>
            <th className="p-2 text-right">Profit</th>
            <th className="p-2 text-right">Loss</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.categoryName}</td>
              <td className="p-2 text-right">{c.totalSales.toFixed(2)}</td>
              <td className="p-2 text-right">{c.totalCost.toFixed(2)}</td>
              <td className="p-2 text-right text-green-600">{c.profit.toFixed(2)}</td>
              <td className="p-2 text-right text-red-600">{c.loss.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
