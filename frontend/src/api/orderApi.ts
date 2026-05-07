import axiosClient from './axiosClient';

export const orderApi = {
  create: (data: any) => axiosClient.post('/orders', data),
  getMyOrders: (status?: string) => axiosClient.get(`/orders/my${status ? `?status=${status}` : ''}`),
  getById: (id: string) => axiosClient.get(`/orders/${id}`),
  cancel: (id: string) => axiosClient.put(`/orders/${id}/cancel`),
  
  // Admin/Tech
  getAllOrders: (status?: string) => axiosClient.get(`/orders/all${status ? `?status=${status}` : ''}`),
  getAssigned: (status?: string) => axiosClient.get(`/orders/assigned${status ? `?status=${status}` : ''}`),
  assign: (id: string, technicianId: string) => axiosClient.put(`/orders/${id}/assign`, { technicianId }),
  updateStatus: (id: string, data: any) => axiosClient.put(`/orders/${id}/status`, data),
  getReports: () => axiosClient.get('/orders/reports'),
};
