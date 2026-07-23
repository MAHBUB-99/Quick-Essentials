export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  farmName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface Order {
  id: string;
  /** Human-facing order number, e.g. "FB-2024-001234". */
  reference: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: 'card' | 'bkash' | 'nagad';
  placedAt: string;
  transactionId?: string;
}
