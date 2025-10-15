import axios from "@/api/axios";

export const getAllProducts = async () => {
  const res = await axios.get("/api/products");
  return res.data;
};
