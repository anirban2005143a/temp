import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const submitDeviationQuery = async ({ query, file, currentForm }) => {
  const formData = new FormData();

  if (query && query.trim()) {
    formData.append("query", query.trim());
  }

  if (file) {
    formData.append("file", file);
  }

  if (currentForm) {
    formData.append("current_form", JSON.stringify(currentForm));
  }

  const response = await apiClient.post("/api/submit-query", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const saveDeviationToDatabase = async (payload) => {
  // await new Promise((res , rej)=>{
  //   setTimeout(() => {
  //     res(4)
  //   }, 5000);
  // })
  const response = await apiClient.post("/api/deviation/save", payload);
  return response.data;
};
