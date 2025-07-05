import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '../../stylesheet/Brand.css';

const Brand = ({ brand }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        description: brand.description || '',
        image: brand.image?.url || ''
      });
    }
  }, [brand]);

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
      formDataToSend.append('description', formData.description);

      if (formData.file) {
        formDataToSend.append('image', formData.file);
      }

      let response;
      if (brand) {
        // Update existing brand
        response = await axios.put(`/api/brands/${brand._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Brand updated successfully!');
        // Optionally update local state with the updated brand data
        setFormData(prev => ({
          ...prev,
          name: response.data.name,
          description: response.data.description,
          image: response.data.image?.url || ''
        }));
      } else {
        // Create new brand
        response = await axios.post('/api/brands/new', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Brand created successfully!');
      }

      // Redirect after success
      setTimeout(() => {
        navigate(`/brands/edit/${response.data._id}`);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-form-container">
      <Sidebar />

      <div className="form-header">
        <h2>{brand ? 'Edit Brand' : 'Add New Brand'}</h2>
        <div className="form-icon">
          {brand ? '✏️' : '➕'}
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

      <form className="brand-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Brand Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter brand name"
          />
        </div>

        <div className="form-group">
          <label>
            Description <span className="required">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Describe your brand..."
          />
        </div>

        <div className="form-group">
          <label>
            Image {!brand && <span className="required">*</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={!brand}
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
              brand ? 'Update Brand' : 'Create Brand'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Brand;