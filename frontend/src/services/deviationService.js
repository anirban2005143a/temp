import api from './api';

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

  const response = await api.post('/api/submit-query', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
