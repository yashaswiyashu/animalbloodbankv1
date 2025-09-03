import React, { useEffect, useState, useContext } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../../styles/dashboard.css';

interface Product {
  _id: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  total_amount: number;
  status: string;
}

type GetProductsResponse = Product[];
type GetOrdersResponse = Order[];

const VendorOverviewDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.vendor_api.get<GetProductsResponse>('/vendor/inventory/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.vendor_api.get<GetOrdersResponse>('/vendor/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate('/login');
    }
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="center-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Vendor Dashboard</h2>
          <button className="role-button" onClick={() => navigate('/product')}>
            Products
          </button>   
          <button className="role-button" onClick={() => navigate('/order')}>
            Orders
          </button>   
          <button className="form-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="overview-cards">
          <div className="overview-card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className="overview-card">
            <h3>Total Stock</h3>
            <p>{totalStock}</p>
          </div>
          <div className="overview-card">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="overview-card">
            <h3>Total Revenue</h3>
            <p>₹ {totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOverviewDashboard;
