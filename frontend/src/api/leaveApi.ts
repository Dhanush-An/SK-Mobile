import axiosClient from './axiosClient';

export const leaveApi = {
  apply: (data: { reason: string, startDate: Date, endDate: Date }) => 
    axiosClient.post('/leaves/apply', data),
  
  getAll: () => 
    axiosClient.get('/leaves'),
  
  updateStatus: (id: string, status: 'approved' | 'rejected') => 
    axiosClient.put(`/leaves/${id}/status`, { status })
};
