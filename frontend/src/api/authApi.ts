import axiosClient from './axiosClient';

export const authApi = {
  login: (email: string, password: string) => axiosClient.post('/auth/login', { email, password }),
  register: (data: any) => axiosClient.post('/auth/register', data),
  getProfile: () => axiosClient.get('/auth/profile'),
  updateProfile: (data: any) => axiosClient.put('/auth/profile', data),
  onboardTech: (data: any) => axiosClient.post('/auth/onboard-tech', data),
  getTechs: () => axiosClient.get('/auth/technicians'),
  updateUser: (id: string, data: any) => axiosClient.put(`/auth/users/${id}`, data),
};
