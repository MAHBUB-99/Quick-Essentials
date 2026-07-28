export type UserRole = 'customer' | 'farmer';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
