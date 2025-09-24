import { useEffect, useState } from "react";

interface SupplierReportItem {
  supplierName: string;
  productName: string | null;
  quantity: number;
  thresholdPrice: number;
  purchaseDate: string;
}

export default function SupplierReport() {
  const [data, setData] = useState<SupplierReportItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/supplier/2?startDate=2025-08-01&endDate=2025-08-17")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="p-4 shadow rounded-xl bg-white">
      <h2 className="text-xl font-semibold mb-4">Supplier Report</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Supplier</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-right">Quantity</th>
            <th className="p-2 text-right">Threshold Price</th>
            <th className="p-2 text-left">Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{item.supplierName}</td>
              <td className="p-2">{item.productName || "-"}</td>
              <td className="p-2 text-right">{item.quantity}</td>
              <td className="p-2 text-right">{item.thresholdPrice.toFixed(2)}</td>
              <td className="p-2">{item.purchaseDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
