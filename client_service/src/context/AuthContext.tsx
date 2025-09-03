import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, PaymentInfo, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Try to load user from localStorage on first render
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(() => {
    const storedPaymentInfo = localStorage.getItem('paymentInfo');
    return storedPaymentInfo ? JSON.parse(storedPaymentInfo) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (paymentInfo) {
      localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
    } else {
      localStorage.removeItem('paymentInfo');
    }
  }, [paymentInfo]);

  const login = (data: User) => setUser(data);
  const logout = () => setUser(null);
  const savePaymentInfo = (info: PaymentInfo) => setPaymentInfo(info);

  return (
    <AuthContext.Provider value={{ user, login, logout, paymentInfo, savePaymentInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
