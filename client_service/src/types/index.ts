import type { JSX } from 'react';

export type UserRole = 'admin' | 'doctor' | 'hospital' | 'pharmacy' | 'lab' | 'organisation' | 'farmer'| 'vendor' | 'Animal Enthusiasts';

export interface User {
  role: UserRole;
  [key: string]: any;
}

export type PaymentInfo = {
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
};

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  paymentInfo: PaymentInfo | null;
  savePaymentInfo: (info: PaymentInfo) => void;
}

export interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles: UserRole[];
}