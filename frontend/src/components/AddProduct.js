import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../stylesheet/AddProduct.css';

const Product = ({ product }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    image: null
  });
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandLoading, setBrandLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();


  useEffect(() => {

    // Fetch brands when component mounts
    const fetchBrands = async () => {
      try {
        const response = await axios.get('/api/brands');
        setBrands(response.data);
        setBrandLoading(false);
      } catch (err) {
        setError('Failed to load brands');
        setBrandLoading(false);
      }
    };
    fetchBrands();

    // Fetch category when component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategory(response.data);
        setCategoryLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setCategoryLoading(false);
      }
    };
    fetchCategories();

    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand?._id || '',
        category: product.category?._id || '',
        shortDescription: product.shortDescription || '',
        longDescription: product.longDescription || '',
        image: product.image?.url || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image: previewUrl,
      file // Store the actual file object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('longDescription', formData.longDescription);

      if (formData.file) {
        formDataToSend.append('image', formData.file);
      }

      let response;
      if (product) {
        // Update existing product
        response = await axios.put(`/api/products/${product._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Product updated successfully!');
        // Optionally update local state with the updated product data
        setFormData(prev => ({
          ...prev,
          name: response.data.name,
          brand: response.data.brand?._id || '',
          category: response.data.category?._id || '',
          shortDescription: response.data.shortDescription,
          longDescription: response.data.longDescription,
          image: response.data.image?.url || ''
        }));
      } else {
        // Create new product
        response = await axios.post('/api/products/new', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Product created successfully!');
      }

      // Redirect after success
      setTimeout(() => {
        navigate(`/products/get/all`);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <Sidebar />

      <div className="form-header">
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        <div className="form-icon">
          {product ? '✏️' : '➕'}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
          <span className="spinner-small"></span>
        </div>
      )}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Product name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label>
            Brand
          </label>
          {brandLoading ? (
            <div className="loading-text">Loading brands...</div>
          ) : (
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="brand-select"
            >
              <option value="">Select a brand</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          )}
        </div>


        <div className="form-group">
          <label>
            Category
          </label>
          {categoryLoading ? (
            <div className="loading-text">Loading category...</div>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="category-select"
            >
              <option value="">Select a category</option>
              {category.map(cate => (
                <option key={cate._id} value={cate._id}>
                  {cate.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>
            Product description
          </label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            rows="8"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Product short description
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Image {!product && <span className="required">*</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={!product}
          />
          {formData.image && (
            <div className="image-preview">
              <img
                src={formData.image}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Product;