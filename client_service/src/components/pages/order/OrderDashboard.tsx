import React, { useEffect, useState, useContext } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import react-select
import '../../../styles/forms.css';
import '../../../styles/dashboard.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Order Interface
interface Order {
  _id: string;
  farmer_name: string;
    products: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  total_price: number;
  category: string;
  farmerId: string; // Assuming we have a farmerId associated with the order
}

interface OrderFormData {
  farmerId: string;
  products: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  total_price: string;
  category: string;
}

interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  price: number;
  quantity: number;
  category: string;
}

type GetOrdersResponse = Order[];
type GetFarmersResponse = {
    users: Farmer[];
};
type GetProductsResponse = Product[];
// Farmer Interface (assuming you have a list of farmers)
interface Farmer {
  _id: string;
  farmer_name: string;
}

const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    farmerId: '',
    products: [{ product_id: '', quantity: 0, price: 0 }],
    total_price: '',
    category: ''
  });
  const [farmers, setFarmers] = useState<Farmer[]>([]); // Store list of farmers
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.vendor_api.get<GetOrdersResponse>('/vendor/order/vendor-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const res = await api.auth_api.get<GetFarmersResponse>('/auth/get-users/farmer'); // Assuming you have an endpoint to get farmers
      setFarmers(res.data.users || []);
      console.log(farmers);
      
    } catch (error) {
      console.error('Error fetching farmers:', error);
    }
  };

    const fetchProducts = async () => {
    try {
      const res = await api.vendor_api.get<GetProductsResponse>('/vendor/inventory/products');
      console.log(products);
      setProducts(res.data);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchFarmers();
    fetchProducts();
  }, []);

  useEffect(() => {
    const totalPrice = formData.products.reduce((acc, curr) => {
        const productDetails = productId.find(p => p.value === curr.product_id);
        const productPrice = productDetails ? productDetails.price : 0;
        return acc + (productPrice * curr.quantity);
    }, 0);

    setFormData(prev => ({
        ...prev,
        price: totalPrice
    }));

    }, [formData.products, products]);

  const handleLogout = () => {
    if (context) {
      context.logout();
      navigate('/login');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      farmerId: '',
      products: [{ product_id: '', quantity: 0, price: 0 }],
      total_price: '',
      category: ''
    });
    setIsAddingOrder(false);
    setEditingOrder(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await api.vendor_api.put(`/vendor/order/edit/${editingOrder._id}`, formData);
      } else {
        await api.vendor_api.post('/vendor/order/add', formData);
      }
      await fetchOrders();
      resetForm();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.vendor_api.delete(`/vendor/order/delete/${orderId}`);
        await fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      farmerId: order.farmerId,
      products: order.products.map(product => ({
        product_id: product.product_id,
        quantity: product.quantity,
        price: product.price
      })),
      total_price: order.total_price.toString(),
      category: order.category
    });
  };

    const filteredOrders = (orders ?? []).filter(order => {
    const matchesSearch = order.products.some(product => {
        const productName = productId.find(p => p.value === product.product_id)?.label || '';
        return productName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const matchesCategory = filterCategory ? order.category === filterCategory : true;

    return matchesSearch && matchesCategory;
    });

  // Farmer options for the Select dropdown

    const farmerOptions = farmers.map(farmer => ({
        label: farmer.farmer_name,
    }));
    
    const productOptions = products.map(product => ({
        label: product.product_name,
    }));

    const farmerId = farmers.map(farmer => ({
        label: farmer.farmer_name,
        value: farmer._id
    }));


    const productId = products.map(product => ({
        label: product.product_name,
        value: product._id,
        price: product.price
    }));

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            color: 'black', // selected text color
            backgroundColor: 'white', // dropdown box background
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'black', // selected value text color
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: 'white', // dropdown menu background
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: 'black', // dropdown option text color
            backgroundColor: state.isFocused ? '#f0f0f0' : 'whhite', // hover color
        }),
    };



  return (
    <div className="center-page">
      <div className="dashboard-header">
        <button className="form-button" onClick={() => navigate('/vendor')}><ArrowBackIcon/></button>
        <h2>Order Dashboard</h2>
        <button className="form-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-actions">
            <button 
              className="form-button add-button" 
              onClick={() => setIsAddingOrder(true)}
            >
              Add New Order
            </button>

            <input 
              className="form-input"
              type="text"
              placeholder="Search by order description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <select 
              className="form-input" 
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {/* Filter options here */}
            </select>
          </div>

          {(isAddingOrder || editingOrder) && (
            <div className="modal-overlay">
                <div className="modal-content">
                <h3>{editingOrder ? 'Edit Order' : 'Add New Order'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                    <Select
                        className="form-select"
                        options={farmerOptions}
                        value={farmerId.find(f => f.value === formData.farmerId)}
                        onChange={(selectedOption: any) =>
                        setFormData(prev => ({
                            ...prev,
                            farmerId: selectedOption.value,
                        }))
                        }
                        placeholder="Select Farmer"
                        required
                        styles={customStyles}
                    />
                    </div>

                    {/* Dynamic Product Rows */}
                    {formData.products.map((item, index) => (
                    <div key={index} className="product-row">
                        <Select
                        className="form-select"
                        options={productOptions}
                        value={productId.find(p => p.value === item.product_id)}
                        onChange={(selectedOption: any) => {
                            const updatedProducts = [...formData.products];
                            updatedProducts[index].product_id = selectedOption.value;
                            setFormData(prev => ({ ...prev, products: updatedProducts }));
                        }}
                        placeholder="Select Product"
                        required
                        styles={customStyles}
                        />
                        <input
                        className="form-input"
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => {
                            const updatedProducts = [...formData.products];
                            updatedProducts[index].quantity = Number(e.target.value);
                            setFormData(prev => ({ ...prev, products: updatedProducts }));
                        }}
                        required
                        />
                        {/* Optional Remove Button */}
                        {formData.products.length > 1 && (
                        <button
                            type="button"
                            className="remove-button"
                            onClick={() => {
                            const updatedProducts = formData.products.filter(
                                (_, i) => i !== index
                            );
                            setFormData(prev => ({ ...prev, products: updatedProducts }));
                            }}
                        >
                            ✖
                        </button>
                        )}
                    </div>
                    ))}

                    {/* Add Product Button */}
                    <button
                    type="button"
                    className="add-button"
                    onClick={() =>
                        setFormData(prev => ({
                        ...prev,
                        products: [...prev.products, { product_id: '', quantity: 0, price: 0 }],
                        }))
                    }
                    >
                    + Add Product
                    </button>

                    {/* Other Static Fields */}
                    <div className="form-group">
                    <input
                        className="form-input"
                        name="price"
                        type="number"
                        value={formData.total_price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        required
                        disabled
                    />
                    </div>

                    <div className="form-group">
                    <input
                        className="form-input"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Category"
                    />
                    </div>

                    {/* Form Buttons */}
                    <div className="form-buttons">
                    <button type="submit" className="form-button">
                        {editingOrder ? 'Update' : 'Add'} Order
                    </button>
                    <button
                        type="button"
                        className="form-button cancel-button"
                        onClick={() => {
                        resetForm();
                        setIsAddingOrder(false);
                        }}
                    >
                        Cancel
                    </button>
                    </div>
                </form>
                </div>
            </div>
            )}


          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                    <tr key={order._id}>
                        <td>{order.farmer_name}</td>

                        <td>
                        {order.products.map((product, index) => {
                            const productName = productId.find(p => p.value === product.product_id)?.label || 'Unknown Product';
                            return (
                            <div key={index}>
                                {productName} (Qty: {product.quantity})
                            </div>
                            );
                        })}
                        </td>
                        
                        <td>{order.total_price}</td>
                        <td>{order.category}</td>

                        <td>
                        <button
                            className="action-button edit"
                            onClick={() => handleEdit(order)}
                        >
                            Edit
                        </button>
                        <button
                            className="action-button delete"
                            onClick={() => handleDelete(order._id)}
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}

              </tbody>
            </table>
            {filteredOrders.length === 0 && <p>No orders found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
