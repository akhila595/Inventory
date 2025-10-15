import axios from "@/api/axios";

export const stockIn = async (formData: FormData) => {
  const res = await axios.post("/api/stock-in", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const stockOut = async (data: any) => {
  const res = await axios.post("/api/stock-out", data);
  return res.data;
};
