export type OrderStatus = 'pending' | 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  _id: string;
  customerId: string | any;
  serviceId: string | any;
  technicianId?: string | any;
  preferredDate: string;
  preferredTime: string;
  address: string;
  contactPhone: string;
  notes?: string;
  technicianNote?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  workProofImage?: string;
  rejectReason?: string;
  createdAt: string;
}
