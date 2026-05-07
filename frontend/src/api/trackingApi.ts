import axiosClient from './axiosClient';

export const trackingApi = {
  updateLocation: (latitude: number, longitude: number, orderId?: string) => 
    axiosClient.post('/tracking/update', { latitude, longitude, orderId }),
  
  getTechnicianLocation: (technicianId: string) => 
    axiosClient.get(`/tracking/${technicianId}`),
  
  getAllActive: () => 
    axiosClient.get('/tracking/all'),
};
