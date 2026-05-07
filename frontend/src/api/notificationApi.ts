import axiosClient from './axiosClient';

export const notificationApi = {
  getAll: () => axiosClient.get('/notifications'),
  markAsRead: (id: string) => axiosClient.put(`/notifications/${id}/read`),
};
