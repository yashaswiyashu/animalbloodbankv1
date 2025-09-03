import React, { useEffect, useState, useContext } from 'react';
import api from '../../../api/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../../styles/forms.css';
import '../../../styles/dashboard.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Product Interface
interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  price: number;
  quantity: number;
  category: string;
}

interface ProductFormData {
  product_name: string;
  product_description: string;
  price: string;
  quantity: string;
  category: string;
}

type GetProductsResponse = Product[];


const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: '',
    product_description: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const context = useContext(AuthContext);
  const navigate = useNavigate();

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
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('Updated products:', products);
  }, [products]);

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
      product_name: '',
      product_description: '',
      price: '',
      quantity: '',
      category: ''
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.vendor_api.put(`/vendor/inventory/product/${editingProduct._id}`, formData);
      } else {
        await api.vendor_api.post('/vendor/inventory/product', formData);
      }
      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.vendor_api.delete(`/vendor/inventory/product/${productId}`);
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      product_description: product.product_description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category
    });
  };

  const filteredProducts = (products ?? []).filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  // const filteredProducts = products;

  const categories = Array.from(new Set(products.map(p => p.category)));


  return (
    <div className="center-page">
        <div className="dashboard-header">
          <button className="form-button" onClick={() => navigate('/vendor')}><ArrowBackIcon/></button>
          <h2>Product Dashboard</h2>
          <button className="form-button" onClick={handleLogout}>Logout</button>
        </div>
      <div className="dashboard-container">

        <div className="dashboard-content">
          <div className="dashboard-actions">
            <button 
              className="form-button add-button" 
              onClick={() => setIsAddingProduct(true)}
            >
              Add New Product
            </button>

            <input 
              className="form-input"
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <select 
              className="form-input" 
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {(isAddingProduct || editingProduct) && (
            <div className='modal-overlay'>
              <div className="modal-content">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      className="form-input"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                      placeholder="Product Name"
                      required
                      />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-input"
                      name="product_description"
                      value={formData.product_description}
                      onChange={handleInputChange}
                      placeholder="Product Description"
                      rows={3}
                      />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-input"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                      required
                      />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-input"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Quantity"
                      required
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
                  <div className="form-buttons">
                    <button type="submit" className="form-button">
                      {editingProduct ? 'Update' : 'Add'} Product
                    </button>
                    <button 
                      type="button" 
                      className="form-button cancel-button"
                      onClick={() => {resetForm(); setIsAddingProduct(false);}}
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
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>{product.product_name}</td>
                    <td>{product.product_description}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.category}</td>
                    <td>
                      <button 
                        className="action-button edit"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <p>No products found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
