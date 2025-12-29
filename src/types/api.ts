// API-related type definitions

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  isVerified?: boolean;
  createdAt?: string;
}

