import React, { useState } from "react";

interface Option {
  id: number;
  name: string;
}

const StockOutForm: React.FC = () => {
  const [stockOutData, setStockOutData] = useState({
    sku: "",
    quantity: "",
    saleDate: "",
    remarks: "",
    sellingPrice: "",
    finalPrice: "",
  });

  // Handle changes in input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStockOutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      sku: stockOutData.sku,
      quantity: parseInt(stockOutData.quantity),
      saleDate: stockOutData.saleDate,
      remarks: stockOutData.remarks,
      sellingPrice: parseFloat(stockOutData.sellingPrice),
      finalPrice: parseFloat(stockOutData.finalPrice),
    };

    try {
      const response = await fetch("http://localhost:8080/api/stock-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Stock successfully updated!");
        setStockOutData({
          sku: "",
          quantity: "",
          saleDate: "",
          remarks: "",
          sellingPrice: "",
          finalPrice: "",
        });
      } else {
        alert("Failed to update stock. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Stock Out Form</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={stockOutData.sku}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={stockOutData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sale Date</label>
          <input
            type="datetime-local"
            name="saleDate"
            value={stockOutData.saleDate}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={stockOutData.remarks}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Selling Price</label>
          <input
            type="number"
            name="sellingPrice"
            value={stockOutData.sellingPrice}
            onChange={handleChange}
            required
            min="1"
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Final Price</label>
          <input
            type="number"
            name="finalPrice"
            value={stockOutData.finalPrice}
            onChange={handleChange}
            required
            min="1"
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div className="col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Process Stock Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockOutForm;
