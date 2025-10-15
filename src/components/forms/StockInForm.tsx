import React, { useState, useEffect } from "react";
import { getCategories, getBrands, getClothTypes, getColors, getSizes } from "@/api/masterDataApi";
import api from "@/api/axios";

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

  // Fetch dropdown options using the imported API functions
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes, clothRes, colorRes, sizeRes] = await Promise.all([
          getCategories(),
          getBrands(),
          getClothTypes(),
          getColors(),
          getSizes(),
        ]);

        setCategories(catRes);
        setBrands(brandRes);
        setClothTypes(clothRes);
        setColors(colorRes);
        setSizes(sizeRes);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };

    fetchOptions();
  }, []);

  // Auto-generate Product Name & Pattern
  useEffect(() => {
    const brand = brands.find((b) => b.id.toString() === formData.brandId)?.name ?? "";
    const cloth = clothTypes.find((c) => c.id.toString() === formData.clothTypeId)?.name ?? "";
    const color = colors.find((col) => col.id.toString() === formData.colorId)?.name ?? "";
    const designCode = formData.designCode ?? "";

    const autoProductName = [
      designCode,
      brand ? ` - ${brand}` : "",
      cloth ? ` - ${cloth}` : "",
    ].join("").trim();

    const autoPattern = [color, cloth ? ` ${cloth}` : ""].join("").trim();

    setFormData((prev) => ({
      ...prev,
      productName: autoProductName,
      pattern: autoPattern,
    }));
  }, [formData.brandId, formData.clothTypeId, formData.colorId, formData.designCode, brands, clothTypes, colors]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate & set image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

      if (!validImageTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP image.");
        return;
      }

      if (file.size > maxSizeInBytes) {
        alert("File size exceeds 2MB. Please upload a smaller image.");
        return;
      }

      setImageFile(file);
    }
  };

  // Submit Form
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
      const response = await api.post("/stock-in", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("✅ Stock successfully added!");
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
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("Failed to add stock. Please check console for details.");
    }
  };

  const renderDropdown = (label: string, name: keyof typeof formData, options: Option[]) => (
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

        {/* Input Fields */}
        <div>
          <label className="block font-medium mb-1">Design Code</label>
          <input
            type="text"
            name="designCode"
            value={formData.designCode}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
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
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Base Price</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Selling Price</label>
          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Supplier Name</label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          >
            Add Stock
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockInForm;
