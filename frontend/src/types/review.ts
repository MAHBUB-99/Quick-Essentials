export interface Review {
  id: string;
  productId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  /** 1–5 */
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
}
