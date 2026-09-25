import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const submitDeviationQuery = async ({ query, file, currentForm }) => {
  const formData = new FormData();

  if (query && query.trim()) {
    formData.append('query', query.trim());
  }

  if (file) {
    formData.append('file', file);
  }

  if (currentForm) {
    formData.append('current_form', JSON.stringify(currentForm));
  }

  const response = await axios.post(`${API_BASE_URL}/api/submit-query`, formData, {
    headers: {
      "Content-Type": 'multipart/form-data',
    },
  });

  return response.data;
};
