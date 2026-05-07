import axiosClient from './axiosClient';

export const serviceApi = {
  getAll: (admin = false) => axiosClient.get(`/services${admin ? '?all=true' : ''}`),
  getById: (id: string) => axiosClient.get(`/services/${id}`),
  create: (data: any) => axiosClient.post('/services', data),
  update: (id: string, data: any) => axiosClient.put(`/services/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/services/${id}`),
};
