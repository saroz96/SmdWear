import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../stylesheet/EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    additionalInformation: '',
    image: null,
    currentImageUrl: '',
    imagePreview: null
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [brandLoading, setBrandLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch product data, brands, and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands
        const brandsResponse = await axios.get('/api/brands');
        setBrands(brandsResponse.data);
        setBrandLoading(false);

        // Fetch categories
        const categoriesResponse = await axios.get('/api/categories');
        setCategories(categoriesResponse.data);
        setCategoryLoading(false);

        // Fetch product
        const productResponse = await axios.get(`/api/products/${id}`);
        setProduct(productResponse.data);
        setFormData({
          name: productResponse.data.name,
          brand: productResponse.data.brand?._id || productResponse.data.brand || '',
          category: productResponse.data.category?._id || productResponse.data.category || '',
          shortDescription: productResponse.data.shortDescription || '',
          longDescription: productResponse.data.longDescription || '',
          additionalInformation: productResponse.data.additionalInformation || '',
          currentImageUrl: productResponse.data.image?.url || '',
          image: null,
          imagePreview: null
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: previewUrl
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
      formDataToSend.append('additionalInformation', formData.additionalInformation);

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.put(
        `/api/products/edit/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('Product updated successfully!');
      setProduct(response.data.product);
      setFormData(prev => ({
        ...prev,
        currentImageUrl: response.data.product.image.url,
        image: null,
        imagePreview: null
      }));

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="product-form-container">
        <Sidebar />
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error && !fetching) {
    return (
      <div className="product-form-container">
        <Sidebar />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => navigate('/products')} className="back-btn">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <Sidebar />

      <div className="form-header">
        <h2>Edit Product</h2>
        <div className="form-icon">✏️</div>
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
          <button onClick={() => navigate(`/products/get/all`)} className="view-btn">
            View All Products
          </button>
        </div>
      )}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Product Name <span className="required">*</span>
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
          <label>Brand</label>
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
          <label>Category</label>
          {categoryLoading ? (
            <div className="loading-text">Loading categories...</div>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="category-select"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Product Description</label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            rows="8"
          />
        </div>

        <div className="form-group">
          <label>Short Description</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Additional Information</label>
          <textarea
            name="additionalInformation"
            value={formData.additionalInformation}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Current Image</label>
          {formData.currentImageUrl && (
            <div className="current-image">
              <img
                src={formData.currentImageUrl}
                alt="Current product"
                className="current-image-preview"
              />
            </div>
          )}

          <label>Update Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {formData.imagePreview && (
            <div className="image-preview">
              <p>New Image Preview:</p>
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Updating...
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;