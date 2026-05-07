export interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isActive: boolean;
}
