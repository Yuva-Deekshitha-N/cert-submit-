import axios from './axios';

export const uploadCertificate = async (formData) => {
  const response = await axios.post('/api/certificates/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};
