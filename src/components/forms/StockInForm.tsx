import React, { useState, useEffect } from "react";
import {
  getCategories,
  getBrands,
  getClothTypes,
  getColors,
  getSizes,
} from "@/api/masterDataApi";
import { stockIn } from "@/api/stockApi";
import { toast } from "react-hot-toast";

interface Option {
  id: number | string;
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
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  // ✅ Fetch dropdown options
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

        setCategories(
          Array.isArray(catRes)
            ? catRes.map((c: any) => ({ id: c.categoryId, name: c.categoryName }))
            : []
        );
       setBrands(
         Array.isArray(brandRes)
             ? brandRes.map((b: any) => ({ id: b.id, name: b.brand }))
             : []
          );

        setClothTypes(
          Array.isArray(clothRes)
            ? clothRes.map((c: any) => ({ id: c.id, name: c.clothType }))
            : []
        );
        setColors(
          Array.isArray(colorRes)
            ? colorRes.map((c: any) => ({ id: c.id, name: c.color }))
            : []
        );
        setSizes(
          Array.isArray(sizeRes)
            ? sizeRes.map((s: any) => ({ id: s.id, name: s.size }))
            : []
        );
      } catch (err) {
        console.error("❌ Failed to fetch dropdown data:", err);
        toast.error("Failed to load dropdown data");
      }
    };
    fetchOptions();
  }, []);

  // ✅ Auto-generate productName & pattern
  useEffect(() => {
    const brand = brands.find((b) => String(b.id) === formData.brandId)?.name || "";
    const cloth = clothTypes.find((c) => String(c.id) === formData.clothTypeId)?.name || "";
    const color = colors.find((col) => String(col.id) === formData.colorId)?.name || "";
    const designCode = formData.designCode || "";

    setFormData((prev) => ({
      ...prev,
      productName: [designCode, brand && ` - ${brand}`, cloth && ` - ${cloth}`]
        .filter(Boolean)
        .join(" ")
        .trim(),
      pattern: [color, cloth && ` ${cloth}`].filter(Boolean).join("").trim(),
    }));
  }, [formData.brandId, formData.clothTypeId, formData.colorId, formData.designCode, brands, clothTypes, colors]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) return toast.error("Invalid image type.");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be < 2MB.");

    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const payload = new FormData();
    if (imageFile) payload.append("image", imageFile);

    const stockData = {
      ...formData,
      categoryId: Number(formData.categoryId),
      brandId: Number(formData.brandId),
      clothTypeId: Number(formData.clothTypeId),
      colorId: Number(formData.colorId),
      sizeId: Number(formData.sizeId),
      quantity: Number(formData.quantity),
      basePrice: Number(formData.basePrice),
      taxPerUnit: Number(formData.taxPerUnit),
      transportPerUnit: Number(formData.transportPerUnit),
      sellingPrice: Number(formData.sellingPrice),
    };

    payload.append("data", new Blob([JSON.stringify(stockData)], { type: "application/json" }));

    try {
      const response = await stockIn(payload);
      const messageText =
        typeof response === "string" ? response : response?.message || "✅ Stock added successfully!";

      setMessage(messageText);
      setIsError(messageText.startsWith("❌"));

      messageText.startsWith("❌") ? toast.error(messageText) : toast.success(messageText);

      if (!messageText.startsWith("❌")) {
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
      }
    } catch (err: any) {
      console.error("❌ Stock In API failed:", err);
      const errorMsg = err?.response?.data || "Failed to add stock.";
      setMessage(errorMsg);
      setIsError(true);
      toast.error(errorMsg);
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
        {Array.isArray(options) &&
          options.map((o) =>
            o?.id != null ? (
              <option key={String(o.id)} value={String(o.id)}>
                {o.name}
              </option>
            ) : null
          )}
      </select>
    </div>
  );

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

        {[
          { label: "Design Code", name: "designCode" },
          { label: "SKU", name: "sku" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "Base Price", name: "basePrice", type: "number" },
          { label: "Tax Per Unit", name: "taxPerUnit", type: "number" },
          { label: "Transport Per Unit", name: "transportPerUnit", type: "number" },
          { label: "Selling Price", name: "sellingPrice", type: "number" },
          { label: "Purchase Date", name: "purchaseDate", type: "date" },
          { label: "Supplier Name", name: "supplierName" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block font-medium mb-1">{f.label}</label>
            <input
              type={f.type || "text"}
              name={f.name}
              value={(formData as any)[f.name]}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full border rounded-md px-4 py-2 bg-green-50 focus:bg-green-100"
          />
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

        <div className="text-center mt-6 md:col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          >
            Add Stock
          </button>
        </div>
      </form>

      {message && (
        <div
          className={`mt-6 text-center text-lg font-semibold ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default StockInForm;
