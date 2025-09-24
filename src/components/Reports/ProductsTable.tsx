import { useEffect, useState } from "react";

interface Product {
  id: number;
  productName: string | null;
  designCode: string;
  pattern: string;
  brandName: string | null;
  clothTypeName: string | null;
  categoryName: string;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="p-4 shadow rounded-xl bg-white">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Design Code</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Pattern</th>
            <th className="p-2 text-left">Brand</th>
            <th className="p-2 text-left">Cloth Type</th>
            <th className="p-2 text-left">Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.designCode}</td>
              <td className="p-2">{p.productName || "-"}</td>
              <td className="p-2">{p.pattern}</td>
              <td className="p-2">{p.brandName || "-"}</td>
              <td className="p-2">{p.clothTypeName || "-"}</td>
              <td className="p-2">{p.categoryName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
