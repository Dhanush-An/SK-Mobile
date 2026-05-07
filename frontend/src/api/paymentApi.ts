import axiosClient from './axiosClient';

export const paymentApi = {
  createOrder: (orderId: string) => axiosClient.post('/payments/create-order', { orderId }),
  verify: (data: any) => axiosClient.post('/payments/verify', data),
};
