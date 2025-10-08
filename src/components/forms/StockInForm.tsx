import React, { useState, useEffect } from "react";

interface Option {
  id: number;
  name: string;
}

const StockInForm: React.FC = () => {
  const [showForm, setShowForm] = useState(true);

  const [formData, setFormData] = useState({
    categoryId: "",
    brandId: "",
    clothTypeId: "",
    colorId: "",
    sizeId: "",
    designCode: "",
    sku: "",
    quantity: "",
    basePrice: "",
    taxPerUnit: "",
    transportPerUnit: "",
    sellingPrice: "",
    purchaseDate: "",
    supplierName: "",
    remarks: "",
    pattern: "",
    productName: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [clothTypes, setClothTypes] = useState<Option[]>([]);
  const [colors, setColors] = useState<Option[]>([]);
  const [sizes, setSizes] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes, clothRes, colorRes, sizeRes] = await Promise.all([
          fetch("http://localhost:8080/api/categories"),
          fetch("http://localhost:8080/api/brands"),
          fetch("http://localhost:8080/api/cloth-types"),
          fetch("http://localhost:8080/api/colors"),
          fetch("http://localhost:8080/api/sizes"),
        ]);

        const [catData, brandData, clothData, colorData, sizeData] = await Promise.all([
          catRes.json(),
          brandRes.json(),
          clothRes.json(),
          colorRes.json(),
          sizeRes.json(),
        ]);

        setCategories(catData.map((item: any) => ({
          id: item.categoryId,
          name: item.categoryName ?? `Category ${item.categoryId}`,
        })));

        setBrands(brandData.map((item: any) => ({
          id: item.id,
          name: item.brand ?? `Brand ${item.id}`,
        })));

        setClothTypes(clothData.map((item: any) => ({
          id: item.id,
          name: item.clothType ?? `Cloth Type ${item.id}`,
        })));

        setColors(colorData.map((item: any) => ({
          id: item.id,
          name: item.color ?? `Color ${item.id}`,
        })));

        setSizes(sizeData.map((item: any) => ({
          id: item.id,
          name: item.size ?? `Size ${item.id}`,
        })));
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const brand = brands.find((b) => b.id.toString() === formData.brandId)?.name || "";
    const cloth = clothTypes.find((c) => c.id.toString() === formData.clothTypeId)?.name || "";
    const color = colors.find((col) => col.id.toString() === formData.colorId)?.name || "";
    const designCode = formData.designCode || "";

    const autoProductName = `${designCode}${brand ? ` - ${brand}` : ""}${cloth ? ` - ${cloth}` : ""}`;
    const autoPattern = `${color}${cloth ? ` ${cloth}` : ""}`;

    setFormData((prev) => ({
      ...prev,
      productName: autoProductName.trim(),
      pattern: autoPattern.trim(),
    }));
  }, [formData.brandId, formData.clothTypeId, formData.colorId, formData.designCode, brands, clothTypes, colors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

      if (!validImageTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP image.');
        return;
      }

      if (file.size > maxSizeInBytes) {
        alert('File size exceeds 2MB. Please upload a smaller image.');
        return;
      }

      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();

    if (imageFile) {
      formPayload.append("image", imageFile);
    }

    const stockData = {
      categoryId: parseInt(formData.categoryId),
      brandId: parseInt(formData.brandId),
      clothTypeId: parseInt(formData.clothTypeId),
      colorId: parseInt(formData.colorId),
      sizeId: parseInt(formData.sizeId),
      designCode: formData.designCode,
      pattern: formData.pattern,
      sku: formData.sku,
      quantity: parseInt(formData.quantity),
      basePrice: parseFloat(formData.basePrice),
      taxPerUnit: parseFloat(formData.taxPerUnit),
      transportPerUnit: parseFloat(formData.transportPerUnit),
      sellingPrice: parseFloat(formData.sellingPrice),
      purchaseDate: formData.purchaseDate,
      supplierName: formData.supplierName,
      remarks: formData.remarks,
      productName: formData.productName,
    };

    formPayload.append("data", new Blob([JSON.stringify(stockData)], { type: "application/json" }));

    try {
      const response = await fetch("http://localhost:8080/api/stock-in", {
        method: "POST",
        body: formPayload,
      });

      if (response.ok) {
        alert("Stock successfully added!");
        setFormData({
          categoryId: "",
          brandId: "",
          clothTypeId: "",
          colorId: "",
          sizeId: "",
          designCode: "",
          sku: "",
          quantity: "",
          basePrice: "",
          taxPerUnit: "",
          transportPerUnit: "",
          sellingPrice: "",
          purchaseDate: "",
          supplierName: "",
          remarks: "",
          pattern: "",
          productName: "",
        });
        setImageFile(null);
        setShowForm(false);
      } else {
        alert("Failed to add stock. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  const renderDropdown = (
    label: string,
    name: keyof typeof formData,
    options: Option[]
  ) => (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
        className="w-full border rounded-md px-4 py-2 bg-violet-100 focus:bg-violet-200"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id.toString()}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );

  if (!showForm) {
    return (
      <div className="text-center mt-8">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
          onClick={() => setShowForm(true)}
        >
          + Add Stock
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8 max-h-screen overflow-y-auto">
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
        title="Close Form"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Stock In Form</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderDropdown("Category", "categoryId", categories)}
        {renderDropdown("Brand", "brandId", brands)}
        {renderDropdown("Cloth Type", "clothTypeId", clothTypes)}
        {renderDropdown("Color", "colorId", colors)}
        {renderDropdown("Size", "sizeId", sizes)}

        <div>
          <label className="block font-medium mb-1">Design Code</label>
          <input type="text" name="designCode" value={formData.designCode} onChange={handleChange} required className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">SKU</label>
          <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Base Price</label>
          <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required min="0" step="0.01" className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Tax Per Unit</label>
          <input type="number" name="taxPerUnit" value={formData.taxPerUnit} onChange={handleChange} min="0" step="0.01" className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Transport Per Unit</label>
          <input type="number" name="transportPerUnit" value={formData.transportPerUnit} onChange={handleChange} min="0" step="0.01" className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Selling Price</label>
          <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} min="0" step="0.01" className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Purchase Date</label>
          <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Supplier Name</label>
          <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} required className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input type="text" name="productName" value={formData.productName} readOnly className="w-full border rounded-md px-4 py-2 bg-gray-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Pattern</label>
          <input type="text" name="pattern" value={formData.pattern} readOnly className="w-full border rounded-md px-4 py-2 bg-gray-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Remarks</label>
          <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={3} className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100" />
        </div>

        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="h-32 mt-2 object-contain border rounded"
            />
          )}
        </div>

        <div className="col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Add Stock
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockInForm;
