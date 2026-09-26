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
    const { chat_response, ...safeCurrentForm } = currentForm;
    formData.append("current_form", JSON.stringify(safeCurrentForm));
  }

  const response = await apiClient.post("/api/submit-query", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const saveDeviationToDatabase = async (payload) => {
  const response = await apiClient.post("/api/deviation/save", payload);
  return response.data;
};
