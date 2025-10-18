import axios from "@/api/axios";

// Handles stock-in with multipart form data
export const stockIn = async (formData: FormData) => {
  const response = await axios.post("/api/stock-in", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Handles stock-out with JSON data
export const stockOut = async (data: any) => {
  const response = await axios.post("/api/stock-out", data);
  return response.data;
};
