export interface CartItem {
  productId: string;
  name: string;
  image: string;
  farmName: string;
  unitPrice: number;
  unit: string;
  quantity: number;
  /** Max quantity the user may add (bounded by product stock). */
  maxQuantity: number;
}
