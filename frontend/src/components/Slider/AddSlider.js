import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import '../../stylesheet/Slider/AddSlider.css';

const AddSlider = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    isActive: true,
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('isActive', formData.isActive);

      if (formData.file) {
        formDataToSend.append('image', formData.file);
      } else {
        throw new Error('Image is required');
      }

      const response = await axios.post('/api/admin/slider/new', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Slider added successfully!');
      
      // Reset form after success
      setFormData({
        title: '',
        description: '',
        link: '',
        isActive: true,
        image: null
      });

      // Optionally redirect after delay
      setTimeout(() => {
        navigate('/admin/sliders');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <Sidebar />

      <div className="form-header">
        <h2>Add New Slider</h2>
        <div className="form-icon">🖼️</div>
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
          <label>Title (Optional)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter slide title"
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter slide description"
          />
        </div>

        <div className="form-group">
          <label>Link URL (Optional)</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Active Slide
          </label>
        </div>

        <div className="form-group">
          <label>
            Image <span className="required">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {formData.image && (
            <div className="image-preview">
              <img
                src={formData.image}
                alt="Preview"
                className="preview-image"
              />
              <div className="image-specs">
                Recommended size: 1920x800px (landscape)
              </div>
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
                Uploading...
              </>
            ) : (
              'Add Slider'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSlider;