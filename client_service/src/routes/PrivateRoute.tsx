import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import type { PrivateRouteProps } from '../types';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const context = useContext(AuthContext);
  if (!context) return <Navigate to="/login" />;

  const { user } = context;

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
