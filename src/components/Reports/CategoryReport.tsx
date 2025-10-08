import React, { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  categoryId: number;
  categoryName: string;
}

export default function CategoryReport() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading Category Report...</p>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">🏷️ Category Report</h2>
      <ul className="list-disc pl-6">
        {categories.map((cat) => (
          <li key={cat.categoryId}>{cat.categoryName}</li>
        ))}
      </ul>
    </div>
  );
}
