import axiosClient from './axiosClient';

export const announcementApi = {
  getAll: () => axiosClient.get('/announcements'),
  create: (data: { title: string; content: string; priority?: string }) => 
    axiosClient.post('/announcements', data),
  delete: (id: string) => axiosClient.delete(`/announcements/${id}`),
};
