import axiosClient from './axiosClient';

export const campaignApi = {
  getAll: () => axiosClient.get('/campaigns/all'),
  create: (data: any) => axiosClient.post('/campaigns/create', data),
  delete: (id: string) => axiosClient.delete(`/campaigns/${id}`),
};
