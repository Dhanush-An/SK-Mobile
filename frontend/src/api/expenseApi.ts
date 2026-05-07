import axiosClient from './axiosClient';

export const expenseApi = {
  getAll: () => axiosClient.get('/expenses'),
  create: (data: any) => axiosClient.post('/expenses', data),
  updateStatus: (id: string, status: string) => axiosClient.put(`/expenses/${id}/status`, { status }),
};
